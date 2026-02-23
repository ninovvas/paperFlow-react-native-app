import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { useSettings } from '../../contexts/settings/SettingsProvider.jsx';
import { useFavorites } from '../../contexts/papers/useFavorites.js';
import { useFilters } from '../../contexts/filters/useFilters.js';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { settings, updateSetting } = useSettings();
    const { favorites, removeFavorite } = useFavorites();
    const { filters, deleteFilter } = useFilters();

    const bg = settings.darkMode ? '#0f172a' : '#f8fafc';
    const cardBg = settings.darkMode ? '#1e293b' : '#fff';
    const textColor = settings.darkMode ? '#e2e8f0' : '#1e293b';
    const hintColor = settings.darkMode ? '#64748b' : '#94a3b8';
    const sectionColor = settings.darkMode ? '#64748b' : '#94a3b8';

    const handleClearFavorites = () => {
        if (favorites.length === 0) {
            Alert.alert('No Favorites', 'You have no saved papers to clear.');
            return;
        }
        Alert.alert(
            'Clear All Favorites',
            `Remove all ${favorites.length} saved papers? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        for (const fav of favorites) {
                            await removeFavorite(fav.id);
                        }
                        Alert.alert('Done', 'All favorites have been cleared.');
                    },
                },
            ]
        );
    };

    const handleClearFilters = () => {
        if (filters.length === 0) {
            Alert.alert('No Filters', 'You have no filters to clear.');
            return;
        }
        Alert.alert(
            'Delete All Filters',
            `Delete all ${filters.length} filters? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        for (const f of filters) {
                            await deleteFilter(f.id);
                        }
                        Alert.alert('Done', 'All filters have been deleted.');
                    },
                },
            ]
        );
    };

   

    return (
        <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: sectionColor }]}>Appearance</Text>
                <View style={[styles.settingsGroup, { backgroundColor: cardBg }]}>
                    <View style={styles.settingRow}>
                        <View>
                            <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
                            <Text style={[styles.settingHint, { color: hintColor }]}>Use dark color scheme</Text>
                        </View>
                        <Switch
                            value={settings.darkMode}
                            onValueChange={(val) => updateSetting('darkMode', val)}
                            trackColor={{ false: '#e2e8f0', true: '#93C5FD' }}
                            thumbColor={settings.darkMode ? '#1B4F72' : '#cbd5e1'}
                        />
                    </View>
                    <View style={styles.settingRow}>
                        <View>
                            <Text style={[styles.settingLabel, { color: textColor }]}>Compact Cards</Text>
                            <Text style={[styles.settingHint, { color: hintColor }]}>Show smaller paper cards in feed</Text>
                        </View>
                        <Switch
                            value={settings.compactCards}
                            onValueChange={(val) => updateSetting('compactCards', val)}
                            trackColor={{ false: '#e2e8f0', true: '#93C5FD' }}
                            thumbColor={settings.compactCards ? '#1B4F72' : '#cbd5e1'}
                        />
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: sectionColor }]}>Notifications</Text>
                <View style={[styles.settingsGroup, { backgroundColor: cardBg }]}>
                    <View style={styles.settingRow}>
                        <View>
                            <Text style={[styles.settingLabel, { color: textColor }]}>Push Notifications</Text>
                            <Text style={[styles.settingHint, { color: hintColor }]}>Get notified about new papers</Text>
                        </View>
                        <Switch
                            value={settings.notifications}
                            onValueChange={(val) => updateSetting('notifications', val)}
                            trackColor={{ false: '#e2e8f0', true: '#93C5FD' }}
                            thumbColor={settings.notifications ? '#1B4F72' : '#cbd5e1'}
                        />
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: sectionColor }]}>Data Management</Text>
                <View style={[styles.settingsGroup, { backgroundColor: cardBg }]}>
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.settingLabel, { color: textColor }]}>Saved Papers</Text>
                            <Text style={[styles.settingHint, { color: hintColor }]}>{favorites.length} papers saved</Text>
                        </View>
                        <Button title="Clear" variant="danger" size="small" onPress={handleClearFavorites}
                            icon={<Ionicons name="trash-outline" size={14} color="#fff" />} />
                    </View>
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.settingLabel, { color: textColor }]}>Filters</Text>
                            <Text style={[styles.settingHint, { color: hintColor }]}>{filters.length} filters created</Text>
                        </View>
                        <Button title="Clear" variant="danger" size="small" onPress={handleClearFilters}
                            icon={<Ionicons name="trash-outline" size={14} color="#fff" />} />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16, marginLeft: 4 },
    settingsGroup: { borderRadius: 16, overflow: 'hidden', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
    settingLabel: { fontSize: 15, fontWeight: '500' },
    settingHint: { fontSize: 12, marginTop: 2 },
});
