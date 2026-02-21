import { useState, useCallback } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {

    const [query, setQuery] = useState('');
    const [papers, setPapers] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const executeSearch = useCallback(async (searchQuery) => {});
    
    const handleSearch = useCallback(() => { executeSearch(query); }, [query, executeSearch]);

    return (
         <KeyboardAvoidingView style={styles.container}>
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
    searchButton: { backgroundColor: '#1B4F72', borderRadius: 12, padding: 12 }
});
