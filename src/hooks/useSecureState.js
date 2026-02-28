import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';


export function useSecureState(key, initialValue) {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        async function loadState() {
            try {
                const storedValue = await SecureStore.getItemAsync(key);

                if (!storedValue) {
                    return;
                }

                setState(JSON.parse(storedValue));
            } catch (error) {
                console.error('Failed to load secure state', error);
            }
        }

        loadState();
    }, [key]);

    const setSecureState = async (value) => {
        try {
            const valueToStore = value instanceof Function ? value(state) : value;

            setState(valueToStore);

            if (valueToStore === null || valueToStore === undefined) {
                await SecureStore.deleteItemAsync(key);
            } else {
                await SecureStore.setItemAsync(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error('Failed to save secure state', error);
        }
    };

    return [state, setSecureState];
}
