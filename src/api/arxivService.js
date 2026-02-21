import { arxivApi } from "./api.js";
import { parseArxivResponse } from "../utils/xmlParser.js";

// arXiv rate limit: they require at least 3 seconds between calls
// Using 4 seconds to be safe and avoid 429 errors
let lastCallTimestamp = 0;
const RATE_LIMIT_MS = 4000;
const MAX_RETRIES = 2;

async function respectRateLimit() {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimestamp;

    if (timeSinceLastCall < RATE_LIMIT_MS) {
        const delay = RATE_LIMIT_MS - timeSinceLastCall;
        console.log(`Rate limit: waiting ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    lastCallTimestamp = Date.now();
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            await respectRateLimit();
            const result = await arxivApi.get(url);
            return result;
        } catch (err) {
            if (err.response?.status === 429 && attempt < retries) {
                const backoff = (attempt + 1) * 5000; // 5s, 10s
                console.log(`arXiv 429 - retrying in ${backoff / 1000}s (attempt ${attempt + 1}/${retries})`);
                await new Promise((resolve) => setTimeout(resolve, backoff));
                lastCallTimestamp = Date.now();
            } else {
                throw err;
            }
        }
    }
}

/**
 * Build an arXiv search query string from filter parameters
 *
 * Prefixes: ti: (title), au: (author), abs: (abstract), cat: (category), all: (all fields)
 * Operators: AND, OR, ANDNOT
 *
 * Example output: (cat:cs.AI+OR+cat:cs.LG)+AND+all:transformer
 */
export function buildSearchQuery({ keywords = [], categories = [], authors = [] }) {
    const parts = [];

    // Category filter: (cat:cs.AI+OR+cat:cs.LG)
    if (categories.length > 0) {
        const catQuery = categories.map((c) => `cat:${c}`).join('+OR+');
        parts.push(categories.length > 1 ? `(${catQuery})` : catQuery);
    }

    // Keyword filter: (all:transformer+OR+all:neural+network)
    // arXiv uses + for spaces, NOT %20
    if (keywords.length > 0) {
        const kwQuery = keywords
            .map((k) => `all:${k.trim().replace(/\s+/g, '+')}`)
            .join('+OR+');
        parts.push(keywords.length > 1 ? `(${kwQuery})` : kwQuery);
    }

    // Author filter: (au:smith+OR+au:johnson)
    if (authors.length > 0) {
        const auQuery = authors
            .map((a) => `au:${a.trim().replace(/\s+/g, '+')}`)
            .join('+OR+');
        parts.push(authors.length > 1 ? `(${auQuery})` : auQuery);
    }

    // Join all parts with AND
    return parts.join('+AND+');
}

/**
 * Search papers on arXiv
 *
 * @param {string} query - Raw search query string or pre-built query
 * @param {object} options - { start, maxResults, sortBy, sortOrder }
 * @returns {Promise<{ papers: Array, totalResults: number }>}
 */
export async function searchPapers(query, options = {}) {
    const {
        start = 0,
        maxResults = 25,
        sortBy = 'submittedDate',
        sortOrder = 'descending',
    } = options;

    await respectRateLimit();

    console.log(`arXiv search: query="${query}" start=${start} max=${maxResults}`);

    // Build URL manually to avoid axios double-encoding the arXiv query operators (+OR+, +AND+)
    const url = `/query?search_query=${query}&start=${start}&max_results=${maxResults}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    const result = await fetchWithRetry(url);

    console.log(`arXiv response: ${result.status}, data length: ${result.data?.length || 0}`);

    const parsed = parseArxivResponse(result.data);
    console.log(`Parsed ${parsed.papers.length} papers (total: ${parsed.totalResults})`);

    return parsed;
}

/**
 * Fetch a single paper by arXiv ID
 *
 * @param {string} arxivId - e.g., "2401.12345" or "2401.12345v1"
 * @returns {Promise<object|null>} Paper object or null
 */
export async function getPaperById(arxivId) {
    const result = await fetchWithRetry(`/query?id_list=${arxivId}`);

    const { papers } = parseArxivResponse(result.data);
    return papers.length > 0 ? papers[0] : null;
}

/**
 * Fetch feed papers based on user filter profiles
 *
 * @param {Array} filters - Array of filter objects with keywords, categories, etc.
 * @param {number} maxResults - Max results per filter
 * @returns {Promise<Array>} Merged and deduplicated papers sorted by date
 */
export async function fetchFeedPapers(filters, maxResults = 25) {
    const allPapers = [];

    console.log(`fetchFeedPapers: ${filters.length} filters total`);

    for (const filter of filters) {
        console.log(`Filter: "${filter.name}" active=${filter.isActive} source=${filter.source}`);

        if (!filter.isActive) {
            console.log(`Skipping (inactive)`);
            continue;
        }
        if (filter.source && filter.source !== 'arxiv' && filter.source !== 'both') {
            console.log(`Skipping (source=${filter.source}, not arxiv)`);
            continue;
        }

        const query = buildSearchQuery({
            keywords: filter.keywords || [],
            categories: filter.categories || [],
        });

        if (!query) {
            console.log(`Skipping (empty query)`);
            continue;
        }

        console.log(`Query: ${query}`);

        try {
            const { papers } = await searchPapers(query, {
                maxResults,
                sortBy: 'submittedDate',
                sortOrder: 'descending',
            });

            console.log(`Got ${papers.length} papers`);
            allPapers.push(...papers);
        } catch (err) {
            console.error(`Error for "${filter.name}":`, err.message);
        }
    }

    // Deduplicate by paper ID
    const seen = new Set();
    const unique = allPapers.filter((paper) => {
        if (seen.has(paper.id)) return false;
        seen.add(paper.id);
        return true;
    });

    // Sort by published date (newest first)
    unique.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return unique;
}

/**
 * Quick search by simple keyword string (for Search tab)
 */
export async function quickSearch(keyword, start = 0, maxResults = 25) {
    const query = `all:${keyword.trim().replace(/\s+/g, '+')}`;
    return searchPapers(query, { start, maxResults });
}
