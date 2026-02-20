import { createContext, useState, useEffect } from "react";
import { authService, api } from "../../api/index.js";
import * as firebaseAuthService from "../../api/firebaseAuthService.js";
import { usePersistedState } from "../../hooks/usePersistedState.js";
import { AUTH_MODE } from "../../config.js";

export const AuthContext = createContext({
    isLoading: false,
    isAuthenticated: false,
    error: null,
    user: null,
    auth: null,
    authMode: 'json-server',
    login: async () => {},
    register: async () => {},
    clearError: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [auth, setAuth] = usePersistedState("auth", {
        accessToken: null,
        user: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log(`Auth mode: ${AUTH_MODE}`);

    // Set Authorization header whenever token changes (for json-server CRUD)
    useEffect(() => {
        if (auth.accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [auth.accessToken]);

    /*Login*/
    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            let result;

            if (AUTH_MODE === 'firebase') {
                // Firebase Auth
                result = await firebaseAuthService.login(email, password);
            } else {
                // json-server-auth (default)
                result = await authService.login(email, password);
            }

            const { user, accessToken } = result;
            setAuth({ user, accessToken });
        } catch (err) {
            console.error('Login error:', err);
            let message = 'Invalid email or password';

            if (AUTH_MODE === 'firebase') {
                // Firebase error codes
                const code = err.code;
                if (code === 'auth/user-not-found') message = 'No account found with this email';
                else if (code === 'auth/wrong-password') message = 'Incorrect password';
                else if (code === 'auth/invalid-email') message = 'Invalid email format';
                else if (code === 'auth/too-many-requests') message = 'Too many attempts. Try again later';
                else if (code === 'auth/invalid-credential') message = 'Invalid email or password';
            } else {
                const data = err.response?.data;
                message = typeof data === 'string' ? data : 'Invalid email or password';
            }

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    /* Register */
    const register = async (email, password, displayName) => {
        try {
            setIsLoading(true);
            setError(null);

            let result;

            if (AUTH_MODE === 'firebase') {
                result = await firebaseAuthService.register(email, password, displayName);
            } else {
                result = await authService.register(email, password, displayName);
            }

            const { user, accessToken } = result;
            setAuth({ user, accessToken });
        } catch (err) {
            console.error('Register error:', err);
            let message = 'Registration failed';

            if (AUTH_MODE === 'firebase') {
                const code = err.code;
                if (code === 'auth/email-already-in-use') message = 'An account with this email already exists';
                else if (code === 'auth/weak-password') message = 'Password must be at least 6 characters';
                else if (code === 'auth/invalid-email') message = 'Invalid email format';
            } else {
                const data = err.response?.data;
                message = typeof data === 'string' ? data : 'Registration failed';
            }

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    /* Logout */
    const logout = async () => {
        if (AUTH_MODE === 'firebase') {
            try {
                await firebaseAuthService.logout();
            } catch (err) {
                console.error('Firebase logout error:', err);
            }
        }

        setAuth({ accessToken: null, user: null });
    };

    const contextValue = {
        isAuthenticated: !!auth.user,
        isLoading,
        error,
        user: auth.user,
        auth,
        authMode: AUTH_MODE,
        clearError: () => setError(null),
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
