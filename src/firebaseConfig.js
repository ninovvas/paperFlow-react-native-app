
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    // ToDo: Add the correct data
    apiKey: "MY_API_KEY",
    authDomain: "MY_PROJECT.firebaseapp.com",
    projectId: "MY_PROJECT_ID",
    storageBucket: "MY_PROJECT.firebasestorage.app",
    messagingSenderId: "MY_SENDER_ID",
    appId: "MY_APP_ID",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence (keeps user logged in)
export const firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
