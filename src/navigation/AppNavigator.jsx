import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import AuthNavigator from "./AuthNavigator.jsx";
import TabNavigator from "./TabNavigator.jsx";
import { useAuth } from "../contexts/auth/useAuth.js";

export default function AppNavigator() {
    const Stack = createNativeStackNavigator();
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading spinner while checking auth state
    // This prevents the "flash" of Login screen on app restart
    // (especially important for Firebase mode where onAuthStateChanged is async)
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1B4F72" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated
                ? <Stack.Screen name="Main" component={TabNavigator} />
                : <Stack.Screen name="Auth" component={AuthNavigator} />
            }
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
});
