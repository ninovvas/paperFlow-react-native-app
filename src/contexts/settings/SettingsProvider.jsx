import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = '@paperflow_settings';

const defaultSettings = {
    darkMode: false,
    compactCards: false,
    notifications: true,
};

const SettingsContext = createContext({
    settings: defaultSettings,
    updateSetting(key, value) { },
});

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                setSettings({ ...defaultSettings, ...JSON.parse(stored) });
            }
        } catch (err) {
            console.error('Error loading settings:', err);
        }
    };

    const updateSetting = async (key, value) => {
        try {
            const newSettings = { ...settings, [key]: value };
            setSettings(newSettings);
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
