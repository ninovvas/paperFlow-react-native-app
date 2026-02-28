import { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaperCard from '../../components/PaperCard';
import EmptyState from '../../components/EmptyState';
import ScanToSearch from '../../components/ScanToSearch';
import { useFavorites } from '../../contexts/papers/useFavorites.js';
import * as arxivService from '../../api/arxivService.js';
import * as crossrefService from '../../api/crossrefService.js';

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [searchSource, setSearchSource] = useState('all'); // 'all', 'arxiv', 'crossref'
    const { isFavorite, addFavorite, getFavoriteByPaperId, removeFavorite } = useFavorites();

    const executeSearch = useCallback(async (searchQuery) => {
        const trimmed = searchQuery.trim();
        if (!trimmed) return;

        Keyboard.dismiss();
        setIsLoading(true);
        setHasSearched(true);
        setQuery(trimmed);

        try {
            const allPapers = [];
            let total = 0;

            // arXiv search
            if (searchSource === 'all' || searchSource === 'arxiv') {
                try {
                    const arxivResult = await arxivService.quickSearch(trimmed, 0, 30);
                    allPapers.push(...arxivResult.papers);
                    total += arxivResult.totalResults;
                } catch (err) {
                    console.error('arXiv search error:', err.message);
                }
            }

            // Crossref search
            if (searchSource === 'all' || searchSource === 'crossref') {
                try {
                    const crResult = await crossrefService.searchPapers(trimmed, { rows: 20 });
                    allPapers.push(...crResult.papers);
                    total += crResult.totalResults;
                } catch (err) {
                    console.error('Crossref search error:', err.message);
                }
            }

            // Deduplicate
            const seen = new Set();
            const unique = allPapers.filter((p) => {
                if (seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
            });

            setPapers(unique);
            setTotalResults(total);
        } catch (err) {
            console.error('Search error:', err);
            setPapers([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchSource]);

    const handleSearch = useCallback(() => { executeSearch(query); }, [query, executeSearch]);
    const handleScanSearch = useCallback((scannedText) => { executeSearch(scannedText); }, [executeSearch]);

    const handlePaperPress = (paper) => {
        navigation.navigate('PaperDetails', { paperId: paper.id, source: paper.source, paper });
    };

    const handleBookmark = async (paper) => {
        if (isFavorite(paper.id)) {
            const fav = getFavoriteByPaperId(paper.id);
            if (fav) await removeFavorite(fav.id);
        } else {
            await addFavorite({
                paperId: paper.id, source: paper.source, title: paper.title,
                authors: paper.authors, abstract: paper.abstract, categories: paper.categories,
                publishedDate: paper.publishedDate, pdfUrl: paper.pdfUrl,
            });
        }
    };

    const renderPaper = ({ item }) => (
        <PaperCard
            title={item.title} authors={item.authors} primaryCategory={item.primaryCategory}
            publishedDate={item.publishedDate} source={item.source}
            onPress={() => handlePaperPress(item)}
            onBookmark={() => handleBookmark(item)}
            isBookmarked={isFavorite(item.id)}
        />
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <View style={styles.inputContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search papers directly (no filter needed)"
                        placeholderTextColor="#94a3b8"
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => { setQuery(''); setPapers([]); setHasSearched(false); }}>
                            <Ionicons name="close-circle" size={20} color="#cbd5e1" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Source Toggle */}
            <View style={styles.sourceToggle}>
                {[
                    { key: 'all', label: 'All Sources' },
                    { key: 'arxiv', label: 'arXiv' },
                    { key: 'crossref', label: 'Crossref' },
                ].map((src) => (
                    <TouchableOpacity
                        key={src.key}
                        style={[styles.sourceTab, searchSource === src.key && styles.sourceTabActive]}
                        onPress={() => setSearchSource(src.key)}
                    >
                        <Text style={[styles.sourceTabText, searchSource === src.key && styles.sourceTabTextActive]}>
                            {src.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Results */}
            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#1B4F72" />
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            ) : (
                <FlatList
                    data={papers}
                    renderItem={renderPaper}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={papers.length === 0 ? styles.emptyList : styles.list}
                    ListHeaderComponent={
                        <>
                            <ScanToSearch onSearch={handleScanSearch} />
                            {papers.length > 0 && (
                                <View style={styles.resultHeader}>
                                    <Text style={styles.resultText}>
                                        {papers.length} results{totalResults > papers.length ? ` (of ${totalResults.toLocaleString()} total)` : ''}
                                    </Text>
                                </View>
                            )}
                        </>
                    }
                    ListEmptyComponent={
                        hasSearched ? (
                            <EmptyState icon="search-outline" title="No results found"
                                message={`No papers matched "${query}". Try different keywords or switch source.`} />
                        ) : (
                            <EmptyState icon="search-outline" title="Search Academic Papers"
                                message="Search directly across arXiv and Crossref — no filters needed. Type keywords or scan a paper title with your camera." />
                        )
                    }
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', gap: 8,
    },
    inputContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9',
        borderRadius: 12, paddingHorizontal: 12, gap: 8,
    },
    input: { flex: 1, fontSize: 15, color: '#1e293b', paddingVertical: 10 },
    searchButton: { backgroundColor: '#1B4F72', borderRadius: 12, padding: 12 },
    sourceToggle: {
        flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8,
        borderBottomWidth: 1, borderBottomColor: '#e2e8f0', gap: 8,
    },
    sourceTab: {
        flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center',
        backgroundColor: '#f1f5f9',
    },
    sourceTabActive: { backgroundColor: '#1B4F72' },
    sourceTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    sourceTabTextActive: { color: '#fff' },
    list: { paddingBottom: 8 },
    emptyList: { flexGrow: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16, color: '#64748b' },
    resultHeader: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 4 },
    resultText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
});
