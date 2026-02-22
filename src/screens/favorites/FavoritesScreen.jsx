import { View, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaperCard from '../../components/PaperCard';
import EmptyState from '../../components/EmptyState';
import { useFavorites } from '../../contexts/papers/useFavorites.js';

export default function FavoritesScreen({ navigation }) {
    const { favorites, isLoading, removeFavorite } = useFavorites();

    const handlePress = (fav) => {
        navigation.navigate('PaperDetails', {
            paperId: fav.paperId, source: fav.source,
            paper: { id: fav.paperId, source: fav.source, title: fav.title, authors: fav.authors || [],
                abstract: fav.abstract || '', categories: fav.categories || [], primaryCategory: fav.categories?.[0] || '',
                publishedDate: fav.publishedDate || '', pdfUrl: fav.pdfUrl || '',
                abstractUrl: fav.source === 'arxiv' ? `http://arxiv.org/abs/${fav.paperId}` : fav.pdfUrl || '' },
        });
    };

    const handleRemove = (fav) => {
        Alert.alert('Remove Favorite', `Remove "${fav.title}" from favorites?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(fav.id) },
        ]);
    };

    const handleClearAll = () => {
        if (favorites.length === 0) return;
        Alert.alert('Clear All Favorites', `Remove all ${favorites.length} saved papers?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear All', style: 'destructive', onPress: async () => {
                for (const fav of favorites) { await removeFavorite(fav.id); }
            }},
        ]);
    };

    if (isLoading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#1B4F72" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites} keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <PaperCard title={item.title} authors={item.authors} primaryCategory={item.categories?.[0] || ''}
                        publishedDate={item.publishedDate} source={item.source}
                        onPress={() => handlePress(item)} onBookmark={() => handleRemove(item)} isBookmarked={true} />
                )}
                contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.list}
                ListHeaderComponent={favorites.length > 0 ? (
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{favorites.length} saved paper{favorites.length !== 1 ? 's' : ''}</Text>
                        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                            <Text style={styles.clearText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                ListEmptyComponent={
                    <EmptyState icon="heart-outline" title="No saved papers yet"
                        message="Tap the heart icon on any paper to save it here for later reading." />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    list: { paddingVertical: 8 },
    emptyList: { flexGrow: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
    headerText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
    clearButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    clearText: { fontSize: 13, color: '#ef4444', fontWeight: '600' },
});
