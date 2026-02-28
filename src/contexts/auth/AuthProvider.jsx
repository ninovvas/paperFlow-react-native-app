import { createContext, useState, useEffect } from "react";
import { authService, api } from "../../api/index.js";
import * as firebaseAuthService from "../../api/firebaseAuthService.js";
import { useSecureState } from "../../hooks/useSecureState.js";
import { AUTH_MODE } from "../../config.js";


// Only import firebaseAuth when in firebase mode (avoids crash if firebase not configured)
let firebaseAuth = null;
if (AUTH_MODE === 'firebase') {
    try {
        const config = require("../../firebaseConfig.js");
        firebaseAuth = config.firebaseAuth;
    } catch (e) {
        console.warn("Firebase config not found, falling back to json-server");
    }
}


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
    
    const [jsonAuth, setJsonAuth] = useSecureState("auth", {
        accessToken: null,
        user: null,
    });

    // Firebase mode uses its own state (managed by onAuthStateChanged)
    const [firebaseUser, setFirebaseUser] = useState(null);

    const [isLoading, setIsLoading] = useState(AUTH_MODE === 'firebase'); // Firebase starts loading
    const [error, setError] = useState(null);

    console.log(`Auth mode: ${AUTH_MODE}`);

    useEffect(() => {
        if (AUTH_MODE !== 'firebase' || !firebaseAuth) return;

        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                console.log("Firebase: user authenticated:", user.email);
                setFirebaseUser({
                    id: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                });
            } else {
                console.log("Firebase: user signed out");
                setFirebaseUser(null);
            }
            setIsLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Set Authorization header for json-server CRUD (both modes need this)
    useEffect(() => {
        if (jsonAuth.accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${jsonAuth.accessToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [jsonAuth.accessToken]);

    // Determine current user based on mode
    const currentUser = AUTH_MODE === 'firebase' ? firebaseUser : jsonAuth.user;
    const isAuthenticated = !!currentUser;

    // Login
    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            if (AUTH_MODE === 'firebase') {
                // Firebase: login returns user, onAuthStateChanged updates state
                const user = await firebaseAuthService.login(email, password);
                setFirebaseUser({
                    id: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                });
            } else {
                // json-server-auth
                const { user, accessToken } = await authService.login(email, password);
                setJsonAuth({ user, accessToken });
            }
        } catch (err) {
            console.error('Login error:', err);
            let message = 'Invalid email or password';

            if (AUTH_MODE === 'firebase') {
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

    // Register
    const register = async (email, password, displayName) => {
        try {
            setIsLoading(true);
            setError(null);

            if (AUTH_MODE === 'firebase') {
                const user = await firebaseAuthService.register(email, password, displayName);
                setFirebaseUser({
                    id: user.uid,
                    email: user.email,
                    displayName: user.displayName || displayName || email.split('@')[0],
                });
            } else {
                const { user, accessToken } = await authService.register(email, password, displayName);
                setJsonAuth({ user, accessToken });
            }
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

    // Logout
    const logout = async () => {
        if (AUTH_MODE === 'firebase' && firebaseAuth) {
            try {
                await signOut(firebaseAuth);
                setFirebaseUser(null);
            } catch (err) {
                console.error('Firebase logout error:', err);
                setError(err.message || 'Error during logout');
            }
        }

        // Always clear json-server auth (for CRUD token)
        setJsonAuth({ accessToken: null, user: null });
    };

    const contextValue = {
        isAuthenticated,
        isLoading,
        error,
        user: currentUser,
        auth: AUTH_MODE === 'firebase'
            ? { user: firebaseUser }
            : jsonAuth,
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
