import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
    const envUrl = process.env.EXPO_PUBLIC_API_URL;

    if (envUrl) {
        return envUrl;
    }

    // Default: localhost works with adb reverse tcp:3001 tcp:3001
    return 'http://localhost:3001';
};

const BASE_URL = getBaseUrl();

console.log('API Base URL:', BASE_URL);

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Debug interceptor - logs all requests
api.interceptors.request.use(
    (config) => {
        console.log(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.log('Request error:', error.message);
        return Promise.reject(error);
    }
);

// Debug interceptor - logs all responses
api.interceptors.response.use(
    (response) => {
        console.log(`${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            console.log(`Response ${error.response.status}: ${error.config?.url}`, error.response.data);
        } else if (error.request) {
            console.log('No response received (Network Error):', error.config?.baseURL + error.config?.url);
            console.log('   Make sure json-server is running: npm run server');
        } else {
            console.log('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Axios instance for arXiv API (returns XML)
export const arxivApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ARXIV_API_URL || 'http://export.arxiv.org/api',
    timeout: 15000,
});


// Axios instance for Crossref API (returns JSON)
export const crossrefApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_CROSSREF_API_URL || 'https://api.crossref.org',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});
