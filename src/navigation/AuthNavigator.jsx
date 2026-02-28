import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen.jsx";
import LoginScreen from "../screens/auth/LoginScreen.jsx";
import RegisterScreen from "../screens/auth/RegisterScreen.jsx";

export default function AuthNavigator() {
    const Stack = createNativeStackNavigator();

     return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Sign In' }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Create Account' }}
            />
        </Stack.Navigator>
    );
}
