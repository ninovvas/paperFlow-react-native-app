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
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/auth/useAuth.js';

export default function RegisterScreen({ navigation }) {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { register, isLoading, error, clearError } = useAuth();

    const validate = () => {
        const newErrors = {};

        // Display Name: required + min 2 chars
        if (!displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        } else if (displayName.trim().length < 2) {
            newErrors.displayName = 'Name must be at least 2 characters';
        }

        // Email: required + valid format
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password: COMPLEX RULE - required + min 6 + uppercase + number
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        // Confirm Password: must match
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        clearError();
        if (!validate()) return;

        await register(email, password, displayName);
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
                            <Ionicons name="person-add" size={48} color="#1B4F72" />
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join PaperFlow and discover research papers</Text>
                    </View>

                    {error && (
                        <View style={styles.errorBanner}>
                            <Ionicons name="alert-circle" size={20} color="#ef4444" />
                            <Text style={styles.errorBannerText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <Input
                            label="Display Name"
                            value={displayName}
                            onChangeText={(text) => {
                                setDisplayName(text);
                                if (errors.displayName) setErrors({ ...errors, displayName: null });
                            }}
                            placeholder="Enter your name"
                            autoCapitalize="words"
                            error={errors.displayName}
                        />

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
                            placeholder="Min 6 chars, 1 uppercase, 1 number"
                            secureTextEntry
                            error={errors.password}
                        />

                        <Input
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                            }}
                            placeholder="Confirm your password"
                            secureTextEntry
                            error={errors.confirmPassword}
                        />

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.registerButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

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
        marginBottom: 32,
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
        textAlign: 'center',
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
    registerButton: {
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
});
