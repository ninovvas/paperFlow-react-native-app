import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Linking,
    Share,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import * as arxivService from '../../api/arxivService.js';
import { useFavorites } from '../../contexts/papers/useFavorites.js';
import { useTheme } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PaperDetailsScreen = ({ route, navigation }) => {
    // Receive route params: paperId, source, and optionally the full paper object
    const { paperId, source, paper: passedPaper } = route.params;

    const [paper, setPaper] = useState(passedPaper || null);
    const [isLoading, setIsLoading] = useState(!passedPaper);
    const [error, setError] = useState(null);
    const { isFavorite, addFavorite, getFavoriteByPaperId, removeFavorite } = useFavorites();

    const isBookmarked = paper ? isFavorite(paper.id) : false;

    const { colors } = useTheme();


    useEffect(() => {
        if (passedPaper) return;

        async function fetchPaper() {
            try {
                setIsLoading(true);
                if (source === 'arxiv') {
                    const fetched = await arxivService.getPaperById(paperId);
                    setPaper(fetched);
                }
            } catch (err) {
                console.error('Error fetching paper details:', err);
                setError('Failed to load paper details.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPaper();
    }, [paperId, source, passedPaper]);

    // Update header title with paper title
    useEffect(() => {
        if (paper?.title) {
            navigation.setOptions({
                title: paper.title.length > 30
                    ? paper.title.substring(0, 30) + '...'
                    : paper.title,
            });
        }
    }, [paper, navigation]);

    const handleOpenPdf = () => {
        if (paper?.pdfUrl) {
            Linking.openURL(paper.pdfUrl);
        }
    };

    const handleOpenAbstract = () => {
        if (paper?.abstractUrl) {
            Linking.openURL(paper.abstractUrl);
        }
    };

    const handleShare = async () => {
        if (!paper) return;
        try {
            await Share.share({
                title: paper.title,
                message: `Check out this paper: "${paper.title}"\n\n${paper.abstractUrl || paper.pdfUrl}`,
            });
        } catch (err) {
            console.error('Share error:', err);
        }
    };

    const handleBookmark = async () => {
        if (!paper) return;
        try {
            if (isBookmarked) {
                const fav = getFavoriteByPaperId(paper.id);
                if (fav) await removeFavorite(fav.id);
            } else {
                await addFavorite({
                    paperId: paper.id,
                    source: paper.source,
                    title: paper.title,
                    authors: paper.authors,
                    abstract: paper.abstract,
                    categories: paper.categories,
                    publishedDate: paper.publishedDate,
                    pdfUrl: paper.pdfUrl,
                });
            }
        } catch (err) {
            console.error('Bookmark error:', err);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#1B4F72" />
                <Text style={styles.loadingText}>Loading paper details...</Text>
            </View>
        );
    }

    if (error || !paper) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                <Text style={styles.errorText}>{error || 'Paper not found.'}</Text>
            </View>
        );
    }

    const formattedDate = paper.publishedDate
        ? new Date(paper.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Unknown date';

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            {/* Source Badge Header */}
            <View style={styles.sourceHeader}>
                <View style={[
                    styles.sourceBadge,
                    paper.source === 'mdpi' && styles.sourceBadgeMdpi,
                ]}>
                    <Text style={styles.sourceBadgeText}>
                        {paper.source === 'arxiv' ? 'arXiv' : 'MDPI'}
                    </Text>
                </View>
                <Text style={styles.paperId}>{paper.id}</Text>
            </View>

            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>{paper.title}</Text>

                {/* Authors */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="people" size={18} color="#1B4F72" />
                        <Text style={styles.sectionTitle}>Authors</Text>
                    </View>
                    <Text style={styles.authorsText}>
                        {paper.authors.join(', ') || 'Unknown'}
                    </Text>
                </View>

                {/* Categories */}
                {paper.categories && paper.categories.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="pricetags" size={18} color="#1B4F72" />
                            <Text style={styles.sectionTitle}>Categories</Text>
                        </View>
                        <View style={styles.chipRow}>
                            {paper.categories.map((cat, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.categoryChip,
                                        cat === paper.primaryCategory && styles.primaryChip,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            cat === paper.primaryCategory && styles.primaryChipText,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Date */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar" size={18} color="#1B4F72" />
                        <Text style={styles.sectionTitle}>Published</Text>
                    </View>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>

                {/* Abstract */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text" size={18} color="#1B4F72" />
                        <Text style={styles.sectionTitle}>Abstract</Text>
                    </View>
                    <Text style={styles.abstractText}>{paper.abstract}</Text>
                </View>

                {/* Journal Ref / Comment */}
                {paper.journalRef && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="book" size={18} color="#1B4F72" />
                            <Text style={styles.sectionTitle}>Journal Reference</Text>
                        </View>
                        <Text style={styles.metaText}>{paper.journalRef}</Text>
                    </View>
                )}

                {paper.comment && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="chatbubble" size={18} color="#1B4F72" />
                            <Text style={styles.sectionTitle}>Comment</Text>
                        </View>
                        <Text style={styles.metaText}>{paper.comment}</Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title={isBookmarked ? 'Saved to Favorites' : 'Save to Favorites'}
                        variant={isBookmarked ? 'secondary' : 'primary'}
                        onPress={handleBookmark}
                        icon={
                            <Ionicons
                                name={isBookmarked ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isBookmarked ? '#ef4444' : '#fff'}
                            />
                        }
                        style={styles.actionButton}
                    />

                    {paper.pdfUrl ? (
                        <Button
                            title="Open PDF"
                            onPress={handleOpenPdf}
                            icon={<Ionicons name="document" size={20} color="#fff" />}
                            style={styles.actionButton}
                        />
                    ) : null}

                    <Button
                        title="View on arXiv"
                        variant="secondary"
                        onPress={handleOpenAbstract}
                        icon={<Ionicons name="open-outline" size={20} color="#1B4F72" />}
                        style={styles.actionButton}
                    />

                    <Button
                        title="Share"
                        variant="outline"
                        onPress={handleShare}
                        icon={<Ionicons name="share-outline" size={20} color="#1B4F72" />}
                        style={styles.actionButton}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    errorText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
    },
    sourceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 8,
    },
    sourceBadge: {
        backgroundColor: '#D6EAF8',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    sourceBadgeMdpi: {
        backgroundColor: '#D5F5E3',
    },
    sourceBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1B4F72',
    },
    paperId: {
        fontSize: 13,
        color: '#94a3b8',
        fontFamily: 'monospace',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 20,
        lineHeight: 30,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
    },
    authorsText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    categoryChip: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    primaryChip: {
        backgroundColor: '#D6EAF8',
    },
    chipText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
    primaryChipText: {
        color: '#1B4F72',
        fontWeight: '600',
    },
    dateText: {
        fontSize: 14,
        color: '#475569',
    },
    abstractText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 24,
    },
    metaText: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    actions: {
        gap: 10,
        marginTop: 12,
    },
    actionButton: {
        width: '100%',
    },
});

export default PaperDetailsScreen;
