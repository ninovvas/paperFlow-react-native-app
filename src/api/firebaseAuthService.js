import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth";
import { firebaseAuth } from "../firebaseConfig.js";

/**
 * Login with Firebase Auth
 * Returns normalized user object matching json-server-auth format
 */
export async function login(email, password) {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = result.user;

    return {
        accessToken: await user.getIdToken(),
        user: {
            id: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
        },
    };
}

/**
 * Register with Firebase Auth
 */
export async function register(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = result.user;

    // Set display name
    if (displayName) {
        await updateProfile(user, { displayName });
    }

    return {
        accessToken: await user.getIdToken(),
        user: {
            id: user.uid,
            email: user.email,
            displayName: displayName || email.split('@')[0],
        },
    };
}

/**
 * Logout from Firebase
 */
export async function logout() {
    await signOut(firebaseAuth);
}
