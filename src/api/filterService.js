import { api } from "./api.js";

export async function getAll(userId) {
    const result = await api.get(`/filters?userId=${userId}`);

    return result.data;
}

export async function getById(filterId) {
    const result = await api.get(`/filters/${filterId}`);

    return result.data;
}

export async function create(filterData) {
    const result = await api.post('/filters', {
        ...filterData,
        createdAt: new Date().toISOString(),
    });

    return result.data;
}

export async function update(filterId, filterData) {
    const result = await api.patch(`/filters/${filterId}`, {
        ...filterData,
        updatedAt: new Date().toISOString(),
    });

    return result.data;
}

export async function remove(filterId) {
    const result = await api.delete(`/filters/${filterId}`);

    return result.data;
}
