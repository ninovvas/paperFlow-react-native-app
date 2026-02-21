import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/auth/AuthProvider';
import AppNavigator from './navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <StatusBar style="auto" />
                <AuthProvider>
                    <AppNavigator />
                </AuthProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}