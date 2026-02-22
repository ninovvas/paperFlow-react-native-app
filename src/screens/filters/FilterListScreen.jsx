import { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterCard from '../../components/FilterCard';
import EmptyState from '../../components/EmptyState';
import { useFilters } from '../../contexts/filters/useFilters.js';

export default function FilterListScreen({ navigation }) {
    const { filters, isLoading, deleteFilter, updateFilter } = useFilters();

    const handleDelete = (filter) => {
        Alert.alert(
            'Delete Filter',
            `Are you sure you want to delete "${filter.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteFilter(filter.id);
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete filter.');
                        }
                    },
                },
            ]
        );
    };

    const handleToggleActive = async (filter) => {
        try {
            await updateFilter(filter.id, { isActive: !filter.isActive });
        } catch (err) {
            console.error('Toggle error:', err);
        }
    };

    const handlePress = (filter) => {
        navigation.navigate('EditFilter', { filterId: filter.id });
    };

    const renderFilter = ({ item }) => (
        <FilterCard
            name={item.name}
            keywords={item.keywords}
            categories={item.categories}
            source={item.source}
            isActive={item.isActive}
            onPress={() => handlePress(item)}
            onDelete={() => handleDelete(item)}
            onToggleActive={() => handleToggleActive(item)}
        />
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1B4F72" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filters}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderFilter}
                contentContainerStyle={filters.length === 0 ? styles.emptyList : styles.list}
                ListEmptyComponent={
                    <EmptyState
                        icon="filter-outline"
                        title="No filters yet"
                        message="Create your first filter to get personalized paper recommendations in your feed."
                        actionTitle="Create Filter"
                        onAction={() => navigation.navigate('CreateFilter')}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateFilter')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    list: {
        paddingVertical: 8,
    },
    emptyList: {
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1B4F72',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1B4F72',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
