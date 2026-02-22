import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterCard = ({
    name,
    keywords = [],
    categories = [],
    source,
    isActive,
    onPress,
    onDelete,
    onToggleActive,
    style = {},
}) => {
    const sourceLabel = source === 'arxiv' ? 'arXiv' : source === 'mdpi' ? 'MDPI' : 'Both';

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.nameRow}>
                    <Ionicons name="filter" size={18} color="#1B4F72" />
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                </View>
                <View style={styles.headerActions}>
                    <Switch
                        value={isActive}
                        onValueChange={onToggleActive}
                        trackColor={{ false: '#e2e8f0', true: '#93C5FD' }}
                        thumbColor={isActive ? '#1B4F72' : '#cbd5e1'}
                        style={styles.switch}
                    />
                    <TouchableOpacity
                        onPress={onDelete}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.body}>
                {keywords.length > 0 && (
                    <View style={styles.tagRow}>
                        <Ionicons name="key-outline" size={14} color="#64748b" />
                        <Text style={styles.tagText} numberOfLines={1}>
                            {keywords.join(', ')}
                        </Text>
                    </View>
                )}

                {categories.length > 0 && (
                    <View style={styles.chipRow}>
                        {categories.slice(0, 4).map((cat, i) => (
                            <View key={i} style={styles.chip}>
                                <Text style={styles.chipText}>{cat}</Text>
                            </View>
                        ))}
                        {categories.length > 4 && (
                            <Text style={styles.moreText}>+{categories.length - 4} more</Text>
                        )}
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.sourceBadge}>
                    <Text style={styles.sourceBadgeText}>{sourceLabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </View>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    body: {
        marginBottom: 10,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 13,
        color: '#64748b',
        flex: 1,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        alignItems: 'center',
    },
    chip: {
        backgroundColor: '#D6EAF8',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    chipText: {
        fontSize: 11,
        color: '#1B4F72',
        fontWeight: '500',
    },
    moreText: {
        fontSize: 11,
        color: '#94a3b8',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sourceBadge: {
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    sourceBadgeText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '600',
    },
});

export default FilterCard;
