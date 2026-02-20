import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator.jsx";
import TabNavigator from "./TabNavigator.jsx";
import { useAuth } from "../contexts/auth/useAuth.js";

export default function AppNavigator() {
    const Stack = createNativeStackNavigator();
    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated
                ? <Stack.Screen name="Main" component={TabNavigator} />
                : <Stack.Screen name="Auth" component={AuthNavigator} />
            }
        </Stack.Navigator>
    );
}
