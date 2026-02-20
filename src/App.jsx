import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { useAuth } from './contexts/auth/useAuth';
import Button from './components/Button';

function AuthTest() {
    const { isAuthenticated, user, login, logout, isLoading, error } = useAuth();
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.title}>PaperFlow</Text>
            <Text style={styles.status}>
                {isAuthenticated ? `Logged in as ${user?.email}` : 'Not logged in'}
            </Text>
            {error && <Text style={styles.error}>{error}</Text>}
            {isAuthenticated
                ? <Button title="Logout" variant="danger" onPress={logout} style={{ marginTop: 16 }} />
                : <Button title="Test Login (start server first)" loading={isLoading}
                    onPress={() => login('demo@paperflow.com', 'Demo123')} style={{ marginTop: 16 }} />
            }
        </View>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AuthTest />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: 24 },
    title: { fontSize: 28, fontWeight: '800', color: '#1B4F72' },
    subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 24 },
    status: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
    error: { fontSize: 14, color: '#ef4444', marginTop: 8 },
});
