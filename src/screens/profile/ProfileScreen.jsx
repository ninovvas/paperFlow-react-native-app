import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/auth/useAuth.js';
import { useFilters } from '../../contexts/filters/useFilters.js';
import { useFavorites } from '../../contexts/papers/useFavorites.js';
import { api } from '../../api/api.js';
import { useTheme } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
    const { user, auth, logout } = useAuth();
    const { filters } = useFilters();
    const { favorites } = useFavorites();
    const [profileImage, setProfileImage] = useState(null);
    const { colors } = useTheme();

    const handlePickImage = () => {
        Alert.alert('Profile Photo', 'Choose an option', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Take Photo', onPress: takePhoto },
            { text: 'Choose from Library', onPress: pickFromLibrary },
        ]);
    };

    const takePhoto = async () => {
        const { status } = await requestCameraPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission Required', 'Camera access is needed.'); return; }
        const result = await launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
        if (!result.canceled && result.assets?.[0]) setProfileImage(result.assets[0].uri);
    };

    const pickFromLibrary = async () => {
        const { status } = await requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission Required', 'Gallery access is needed.'); return; }
        const result = await launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
        if (!result.canceled && result.assets?.[0]) setProfileImage(result.assets[0].uri);
    };

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all associated data (filters, favorites). This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Account',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/users/${auth.user?.id}`);
                            Alert.alert('Account Deleted', 'Your account has been deleted.');
                            logout();
                        } catch (err) {
                            console.error('Delete account error:', err);
                            Alert.alert('Error', 'Failed to delete account. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.profileHeader}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} activeOpacity={0.7}>
                        {profileImage
                            ? <Image source={{ uri: profileImage }} style={styles.avatar} />
                            : <Ionicons name="person" size={48} color="#1B4F72" />}
                        <View style={styles.cameraOverlay}><Ionicons name="camera" size={16} color="#fff" /></View>
                    </TouchableOpacity>
                    <Text style={styles.displayName}>{user?.displayName || 'PaperFlow User'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="filter" size={24} color="#1B4F72" />
                        <Text style={styles.statNumber}>{filters.length}</Text>
                        <Text style={styles.statLabel}>Filters</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="heart" size={24} color="#ef4444" />
                        <Text style={styles.statNumber}>{favorites.length}</Text>
                        <Text style={styles.statLabel}>Favorites</Text>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                        <View style={styles.menuLeft}><Ionicons name="settings-outline" size={22} color="#475569" /><Text style={styles.menuText}>Settings</Text></View>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
                        <View style={styles.menuLeft}><Ionicons name="information-circle-outline" size={22} color="#475569" /><Text style={styles.menuText}>About PaperFlow</Text></View>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                <Button title="Sign Out" variant="ghost" onPress={handleLogout}
                    icon={<Ionicons name="log-out-outline" size={20} color="#1B4F72" />} style={styles.signOutButton} />

                <Button title="Delete Account" variant="danger" onPress={handleDeleteAccount}
                    icon={<Ionicons name="trash-outline" size={20} color="#fff" />} style={styles.deleteButton} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { paddingHorizontal: 24, paddingVertical: 32 },
    profileHeader: { alignItems: 'center', marginBottom: 32 },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D6EAF8', justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    cameraOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1B4F72', borderRadius: 14, width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f8fafc' },
    displayName: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
    email: { fontSize: 14, color: '#64748b' },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    statNumber: { fontSize: 28, fontWeight: '700', color: '#1e293b', marginTop: 6 },
    statLabel: { fontSize: 13, color: '#64748b', marginTop: 2 },
    menuSection: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuText: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
    signOutButton: { marginTop: 8 },
    deleteButton: { marginTop: 12 },
});
