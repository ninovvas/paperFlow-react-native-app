import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';

import EmptyState from '../../components/EmptyState';

import { useAuth } from '../../contexts/auth/useAuth.js';


export default function FeedScreen({ navigation }) {
    const { auth } = useAuth();
    

    return (
        <View style={styles.container}>
            <FlatList
                ListEmptyComponent={
                    <EmptyState icon="newspaper-outline" title="No papers yet"
                        message="Create your first filter to start receiving personalized paper recommendations from arXiv and Crossref."
                        actionTitle="Create Filter"
                        onAction={() => navigation.navigate('FiltersTab', { screen: 'CreateFilter' })} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 32 },
    loadingText: { marginTop: 12, fontSize: 16, color: '#64748b' },
});
