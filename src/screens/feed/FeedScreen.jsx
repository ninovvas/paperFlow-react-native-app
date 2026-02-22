import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PaperCard from '../../components/PaperCard';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../contexts/auth/useAuth.js';
import { useFilters } from '../../contexts/filters/useFilters.js';
import { useFavorites } from '../../contexts/papers/useFavorites.js';
import * as arxivService from '../../api/arxivService.js';
import * as crossrefService from '../../api/crossrefService.js';

export default function FeedScreen({ navigation }) {
    const { auth } = useAuth();
    const { filters } = useFilters();
    const { isFavorite, addFavorite, getFavoriteByPaperId, removeFavorite } = useFavorites();
    const isFocused = useIsFocused();

    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchedFilterCount, setLastFetchedFilterCount] = useState(-1);

    const activeFilters = filters.filter((f) => f.isActive);

    const fetchPapers = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const allPapers = [];
            console.log(`Feed: ${activeFilters.length} active filters`);

            if (activeFilters.length === 0) {
                // New user or no filters: show empty state
                console.log('Feed: No active filters - showing empty state');
                setPapers([]);
                setLastFetchedFilterCount(0);
                return;
            }

            for (const filter of activeFilters) {
                const maxResults = filter.maxResults || 25;
                const src = filter.source || 'arxiv';
                const keywords = (filter.keywords || []).join(' ');

                console.log(`Processing filter "${filter.name}" source=${src} max=${maxResults}`);

                // arXiv
                if (src === 'arxiv' || src === 'both') {
                    try {
                        const result = await arxivService.fetchFeedPapers([filter], maxResults);
                        allPapers.push(...result);
                    } catch (err) {
                        console.error(`arXiv error: ${err.message}`);
                    }
                }

                // Crossref
                if (src === 'crossref' || src === 'both') {
                    try {
                        const result = await crossrefService.searchPapers(keywords, {
                            rows: maxResults,
                            fromDate: filter.dateFrom || null,
                            untilDate: filter.dateUntil || null,
                        });
                        allPapers.push(...result.papers);
                    } catch (err) {
                        console.error(`Crossref error: ${err.message}`);
                    }
                }
            }

            // Deduplicate
            const seen = new Set();
            const unique = allPapers.filter((p) => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
            unique.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

            console.log(`Feed: Got ${unique.length} unique papers`);
            setPapers(unique);
            setLastFetchedFilterCount(activeFilters.length);
        } catch (err) {
            console.error('Feed fetch error:', err);
            setError('Failed to load papers. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [activeFilters]);

    useEffect(() => { fetchPapers(); }, []);

    useEffect(() => {
        if (isFocused && lastFetchedFilterCount >= 0 && lastFetchedFilterCount !== activeFilters.length) {
            const timer = setTimeout(() => fetchPapers(), 2000);
            return () => clearTimeout(timer);
        }
    }, [isFocused, activeFilters.length]);

    const handleRefresh = () => { setIsRefreshing(true); fetchPapers(false); };

    const handlePaperPress = (paper) => {
        navigation.navigate('PaperDetails', { paperId: paper.id, source: paper.source, paper });
    };

    const handleBookmark = async (paper) => {
        try {
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
        } catch (err) { console.error('Bookmark error:', err); }
    };

    const renderPaper = ({ item }) => (
        <PaperCard title={item.title} authors={item.authors} primaryCategory={item.primaryCategory}
            publishedDate={item.publishedDate} source={item.source}
            onPress={() => handlePaperPress(item)} onBookmark={() => handleBookmark(item)}
            isBookmarked={isFavorite(item.id)} />
    );

    if (isLoading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#1B4F72" /><Text style={styles.loadingText}>Loading papers...</Text></View>;
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="cloud-offline-outline" size={48} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchPapers()}>
                    <Ionicons name="refresh" size={18} color="#fff" /><Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={papers} renderItem={renderPaper} keyExtractor={(item) => item.id}
                contentContainerStyle={papers.length === 0 ? styles.emptyList : styles.list}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#1B4F72" colors={['#1B4F72']} />}
                ListEmptyComponent={
                    <EmptyState icon="newspaper-outline" title="No papers yet"
                        message="Create your first filter to start receiving personalized paper recommendations from arXiv and Crossref."
                        actionTitle="Create Filter"
                        onAction={() => navigation.navigate('FiltersTab', { screen: 'CreateFilter' })} />
                }
                ListHeaderComponent={
                    activeFilters.length > 0 ? (
                        <View style={styles.header}>
                            <View style={styles.filterInfo}>
                                <Ionicons name="filter" size={16} color="#1B4F72" />
                                <Text style={styles.filterInfoText}>{activeFilters.length} active filter{activeFilters.length !== 1 ? 's' : ''}</Text>
                            </View>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerText}>{papers.length} papers</Text>
                                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.7}>
                                    <Ionicons name="refresh" size={18} color="#1B4F72" /><Text style={styles.refreshText}>Refresh</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.filterChips}>
                                {activeFilters.map((f) => (
                                    <View key={f.id} style={styles.chip}>
                                        <Text style={styles.chipText}>{f.name}</Text>
                                        <Text style={styles.chipSource}>{f.source}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : null
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    list: { paddingBottom: 8 },
    emptyList: { flexGrow: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 32 },
    loadingText: { marginTop: 12, fontSize: 16, color: '#64748b' },
    errorText: { marginTop: 12, fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },
    retryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, backgroundColor: '#1B4F72', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
    filterInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    filterInfoText: { fontSize: 13, color: '#1B4F72', fontWeight: '500' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    headerText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
    refreshButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D6EAF8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    refreshText: { fontSize: 13, color: '#1B4F72', fontWeight: '600' },
    filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', gap: 4, alignItems: 'center' },
    chipText: { fontSize: 12, color: '#475569', fontWeight: '500' },
    chipSource: { fontSize: 10, color: '#94a3b8' },
});
