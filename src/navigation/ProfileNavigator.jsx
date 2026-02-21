import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/profile/ProfileScreen.jsx";
import SettingsScreen from "../screens/profile/SettingsScreen.jsx";
import AboutScreen from "../screens/profile/AboutScreen.jsx";

export default function ProfileNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About PaperFlow' }} />
        </Stack.Navigator>
    );
}
