import { XMLParser } from 'fast-xml-parser';

// Configure parser for arXiv Atom 1.0 XML
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => {
        // These elements can appear multiple times in an entry
        return ['entry', 'author', 'category', 'link'].includes(name);
    },
});

/**
 * Parse arXiv Atom XML response into a structured array of papers
 */
export function parseArxivResponse(xmlData) {
    const parsed = parser.parse(xmlData);
    const feed = parsed.feed;

    if (!feed || !feed.entry) {
        return { papers: [], totalResults: 0 };
    }

    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];

    const papers = entries.map((entry) => {
        // Extract arXiv ID from the entry id URL
        // e.g., "http://arxiv.org/abs/2401.12345v1" -> "2401.12345v1"
        const idUrl = entry.id || '';
        const paperId = idUrl.replace('http://arxiv.org/abs/', '');

        // Extract authors
        const authors = (entry.author || []).map((a) =>
            typeof a === 'string' ? a : a.name || ''
        );

        // Extract categories
        const categories = (entry.category || []).map(
            (c) => c['@_term'] || ''
        );

        // Extract primary category
        const primaryCategory =
            entry['arxiv:primary_category']?.['@_term'] ||
            categories[0] ||
            '';

        // Extract PDF link
        const links = entry.link || [];
        const pdfLink = links.find(
            (l) => l['@_title'] === 'pdf' || l['@_type'] === 'application/pdf'
        );
        const pdfUrl = pdfLink ? pdfLink['@_href'] : '';

        // Extract abstract link
        const absLink = links.find(
            (l) => l['@_rel'] === 'alternate'
        );
        const abstractUrl = absLink ? absLink['@_href'] : idUrl;

        // Clean up title and summary (remove extra whitespace/newlines)
        const title = (entry.title || '').replace(/\s+/g, ' ').trim();
        const abstract = (entry.summary || '').replace(/\s+/g, ' ').trim();

        return {
            id: paperId,
            source: 'arxiv',
            title,
            authors,
            abstract,
            categories,
            primaryCategory,
            publishedDate: entry.published || '',
            updatedDate: entry.updated || '',
            pdfUrl,
            abstractUrl,
            doi: entry['arxiv:doi'] || null,
            journalRef: entry['arxiv:journal_ref'] || null,
            comment: entry['arxiv:comment'] || null,
        };
    });

    // Extract total results from OpenSearch metadata
    const totalResults = parseInt(
        feed['opensearch:totalResults'] || papers.length,
        10
    );

    return { papers, totalResults };
}

