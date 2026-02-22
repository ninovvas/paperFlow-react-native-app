import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SOURCE_COLORS = {
    arxiv: { bg: '#D6EAF8', text: '#1B4F72' },
    crossref: { bg: '#D5F5E3', text: '#1E8449' },
    mdpi: { bg: '#FADBD8', text: '#922B21' },
};

const PaperCard = ({
    title,
    authors = [],
    primaryCategory,
    publishedDate,
    source,
    onPress,
    onBookmark,
    isBookmarked = false,
    style = {},
}) => {
    const formattedDate = publishedDate
        ? new Date(publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '';

    const authorText =
        authors.length > 2
            ? `${authors[0]}, ${authors[1]} +${authors.length - 2} more`
            : authors.join(', ');

    const sourceLabel = source === 'arxiv' ? 'arXiv' : source === 'crossref' ? 'Crossref' : 'MDPI';
    const sourceColor = SOURCE_COLORS[source] || SOURCE_COLORS.arxiv;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isBookmarked && styles.containerBookmarked,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.sourceBadge, { backgroundColor: sourceColor.bg }]}>
                <Text style={[styles.sourceBadgeText, { color: sourceColor.text }]}>
                    {sourceLabel}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <View style={styles.authorRow}>
                    <Ionicons name="people-outline" size={14} color="#64748b" />
                    <Text style={styles.authors} numberOfLines={1}>
                        {authorText || 'Unknown authors'}
                    </Text>
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.categoryChip}>
                        <Text style={styles.categoryText}>
                            {primaryCategory || 'General'}
                        </Text>
                    </View>

                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>

            {onBookmark && (
                <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={onBookmark}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={isBookmarked ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isBookmarked ? '#ef4444' : '#cbd5e1'}
                    />
                </TouchableOpacity>
            )}

            <Ionicons
                name="chevron-forward"
                size={20}
                color="#cbd5e1"
                style={styles.chevron}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerBookmarked: {
        backgroundColor: '#FEF9E7',
        borderWidth: 1,
        borderColor: '#F9E79F',
    },
    sourceBadge: {
        backgroundColor: '#D6EAF8',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 18,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 48,
    },
    sourceBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1B4F72',
    },
    content: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 6,
        lineHeight: 20,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    authors: {
        fontSize: 13,
        color: '#64748b',
        flex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryChip: {
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    categoryText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: '#94a3b8',
    },
    bookmarkButton: {
        padding: 4,
        marginRight: 4,
    },
    chevron: {
        marginLeft: 2,
    },
});

export default PaperCard;
