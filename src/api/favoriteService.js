import { api } from "./api.js";

export async function getAll(userId) {
    const result = await api.get(`/favorites?userId=${userId}`);

    return result.data;
}

export async function add(favoriteData) {
    const result = await api.post('/favorites', {
        ...favoriteData,
        savedAt: new Date().toISOString(),
    });

    return result.data;
}

export async function remove(favoriteId) {
    const result = await api.delete(`/favorites/${favoriteId}`);

    return result.data;
}

export async function isFavorited(userId, paperId) {
    const result = await api.get(`/favorites?userId=${userId}&paperId=${paperId}`);

    return result.data.length > 0 ? result.data[0] : null;
}
