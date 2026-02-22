import { crossrefApi } from "./api.js";

/**
 * Search Crossref API for academic papers
 * Docs: https://api.crossref.org/swagger-ui/index.html
 * Free, no auth needed, rate limit ~50 req/sec (polite pool with mailto)
 */
export async function searchPapers(query, options = {}) {
    const {
        rows = 25,
        offset = 0,
        fromDate = null,    // YYYY-MM-DD
        untilDate = null,   // YYYY-MM-DD
        sort = 'published',
        order = 'desc',
    } = options;

    const params = {
        query,
        rows,
        offset,
        sort,
        order,
        mailto: 'paperflow@example.com', // Polite pool
    };

    // Date filter
    if (fromDate) {
        params['filter'] = `from-pub-date:${fromDate}`;
        if (untilDate) {
            params['filter'] += `,until-pub-date:${untilDate}`;
        }
    } else if (untilDate) {
        params['filter'] = `until-pub-date:${untilDate}`;
    }

    console.log(`Crossref search: query="${query}" rows=${rows} offset=${offset}`);

    const result = await crossrefApi.get('/works', { params });
    const data = result.data?.message;

    console.log(`Crossref: ${data?.items?.length || 0} results (total: ${data?.['total-results'] || 0})`);

    const papers = (data?.items || []).map(normalizeCrossrefItem);

    return {
        papers,
        totalResults: data?.['total-results'] || 0,
    };
}

/**
 * Normalize a Crossref work item to our unified paper format
 */
function normalizeCrossrefItem(item) {
    const title = item.title?.[0] || 'Untitled';
    const authors = (item.author || []).map((a) =>
        `${a.given || ''} ${a.family || ''}`.trim()
    );

    // Extract date - Crossref uses 'issued' for publication date, 'published' or 'created' as fallbacks
    const dateParts = item.issued?.['date-parts']?.[0]
        || item.published?.['date-parts']?.[0]
        || item['published-print']?.['date-parts']?.[0]
        || item['published-online']?.['date-parts']?.[0]
        || [];

    let publishedDate = '';
    if (dateParts.length >= 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
        publishedDate = `${dateParts[0]}-${String(dateParts[1]).padStart(2, '0')}-${String(dateParts[2]).padStart(2, '0')}`;
    } else if (dateParts.length >= 2 && dateParts[0] && dateParts[1]) {
        publishedDate = `${dateParts[0]}-${String(dateParts[1]).padStart(2, '0')}-01`;
    } else if (dateParts.length >= 1 && dateParts[0]) {
        publishedDate = `${dateParts[0]}-01-01`;
    }

    return {
        id: item.DOI || `cr-${Math.random().toString(36).substr(2, 9)}`,
        source: 'crossref',
        title,
        authors,
        abstract: item.abstract
            ? item.abstract.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
            : '',
        categories: item.subject || [],
        primaryCategory: item.subject?.[0] || item.type || '',
        publishedDate,
        pdfUrl: item.link?.[0]?.URL || '',
        abstractUrl: item.URL || `https://doi.org/${item.DOI}`,
        doi: item.DOI || '',
        journalRef: item['container-title']?.[0] || '',
        publisher: item.publisher || '',
    };
}
