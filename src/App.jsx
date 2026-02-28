import { StatusBar } from 'expo-status-bar';

import AppNavigator from './navigation/AppNavigator.jsx';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthProvider } from './contexts/auth/AuthProvider.jsx';
import { FilterProvider } from './contexts/filters/FilterProvider.jsx';
import { FavoritesProvider } from './contexts/papers/FavoritesProvider.jsx';
import { SettingsProvider, useSettings} from './contexts/settings/SettingsProvider.jsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const PaperFlowLight = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#1B4F72',
        background: '#f8fafc',
        card: '#ffffff',
        text: '#1e293b',
        border: '#e2e8f0',
    },
};

const PaperFlowDark = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#93C5FD',
        background: '#0f172a',
        card: '#1e293b',
        text: '#e2e8f0',
        border: '#334155',
    },
};

function AppContent() {
    const { settings } = useSettings();
    const theme = settings.darkMode ? PaperFlowDark : PaperFlowLight;

    return (
        <NavigationContainer theme={theme}>
            <StatusBar style={settings.darkMode ? 'light' : 'auto'} />
            <FilterProvider>
                <FavoritesProvider>
                    <AppNavigator />
                </FavoritesProvider>
            </FilterProvider>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <SettingsProvider>
                    <AppContent />
                </SettingsProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}