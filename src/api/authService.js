import { api } from "./api.js";

export async function login(email, password) {
    const result = await api.post('/login', { email, password });

    // json-server-auth returns { accessToken, user: { email, id, ... } }
    return result.data;
}

export async function register(email, password, displayName) {
    const result = await api.post('/register', { email, password, displayName });

    // json-server-auth returns { accessToken, user: { email, id, ... } }
    return result.data;
}

export async function updateProfile(userId, userData) {
    const result = await api.patch(`/users/${userId}`, userData);

    return result.data;
}
