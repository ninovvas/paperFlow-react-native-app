import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/auth/useAuth.js';
import { AUTH_MODE } from '../../config.js';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login, isLoading, error, clearError } = useAuth();

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        clearError();
        if (!validate()) return;

        await login(email, password);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="newspaper" size={48} color="#1B4F72" />
                        </View>
                        <Text style={styles.title}>PaperFlow</Text>
                        <Text style={styles.subtitle}>Sign in to your account</Text>
                        <View style={{ backgroundColor: AUTH_MODE === 'firebase' ? '#FEF3C7' : '#D6EAF8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: AUTH_MODE === 'firebase' ? '#92400E' : '#1B4F72' }}>
                                {AUTH_MODE === 'firebase' ? '🔥 Firebase Auth' : '🗄️ json-server Auth'}
                            </Text>
                        </View>
                    </View>

                    {error && (
                        <View style={styles.errorBanner}>
                            <Ionicons name="alert-circle" size={20} color="#ef4444" />
                            <Text style={styles.errorBannerText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            placeholder="Enter your password"
                            secureTextEntry
                            error={errors.password}
                        />

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.demoInfo}>
                        <Text style={styles.demoTitle}>Demo Account:</Text>
                        <Text style={styles.demoText}>demo@paperflow.com / Demo123</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D6EAF8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1B4F72',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fef2f2',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
    },
    errorBannerText: {
        flex: 1,
        color: '#ef4444',
        fontSize: 14,
    },
    form: {
        marginBottom: 24,
    },
    loginButton: {
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
    linkText: {
        fontSize: 14,
        color: '#1B4F72',
        fontWeight: '600',
    },
    demoInfo: {
        marginTop: 40,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        alignItems: 'center',
    },
    demoTitle: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    demoText: {
        fontSize: 13,
        color: '#94a3b8',
    },
});

export default LoginScreen;
