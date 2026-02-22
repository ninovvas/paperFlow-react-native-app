import { createContext, useEffect, useState } from "react";
import { filterService } from "../../api/index.js";
import { useAuth } from "../auth/useAuth.js";

export const FilterContext = createContext({
    filters: [],
    isLoading: false,
    async createFilter(filterData) { },
    getFilterById(filterId) { },
    async updateFilter(filterId, filterData) { },
    async deleteFilter(filterId) { },
    async refreshFilters() { },
});

export function FilterProvider({ children }) {
    const { auth } = useAuth();
    const [filters, setFilters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadFilters = async () => {
        if (!auth.user?.id) return;

        try {
            setIsLoading(true);
            const data = await filterService.getAll(auth.user.id);
            setFilters(data);
        } catch (err) {
            console.error('Error fetching filters:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFilters();
    }, [auth.user?.id]);

    const createFilter = async (filterData) => {
        try {
            const newFilter = await filterService.create({
                ...filterData,
                userId: auth.user.id,
            });

            setFilters((oldFilters) => [...oldFilters, newFilter]);
            return newFilter;
        } catch (err) {
            console.error('Error creating filter:', err);
            throw err;
        }
    };

    const getFilterById = (filterId) => {
        return filters.find((f) => f.id === filterId || f.id === Number(filterId));
    };

    const updateFilter = async (filterId, filterData) => {
        try {
            const updated = await filterService.update(filterId, filterData);

            setFilters((oldFilters) =>
                oldFilters.map((f) => (f.id === filterId ? { ...f, ...updated } : f))
            );
            return updated;
        } catch (err) {
            console.error('Error updating filter:', err);
            throw err;
        }
    };

    const deleteFilter = async (filterId) => {
        try {
            await filterService.remove(filterId);
            setFilters((oldFilters) => oldFilters.filter((f) => f.id !== filterId));
        } catch (err) {
            console.error('Error deleting filter:', err);
            throw err;
        }
    };

    const contextValue = {
        filters,
        isLoading,
        createFilter,
        getFilterById,
        updateFilter,
        deleteFilter,
        refreshFilters: loadFilters,
    };

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    );
}
