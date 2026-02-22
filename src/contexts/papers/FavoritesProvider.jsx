import { createContext, useEffect, useState } from "react";
import { favoriteService } from "../../api/index.js";
import { useAuth } from "../auth/useAuth.js";

export const FavoritesContext = createContext({
    favorites: [],
    isLoading: false,
    async addFavorite(paperData) { },
    async removeFavorite(favoriteId) { },
    isFavorite(paperId) { },
    getFavoriteByPaperId(paperId) { },
    async refreshFavorites() { },
});

export function FavoritesProvider({ children }) {
    const { auth } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadFavorites = async () => {
        if (!auth.user?.id) return;

        try {
            setIsLoading(true);
            const data = await favoriteService.getAll(auth.user.id);
            setFavorites(data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, [auth.user?.id]);

    const addFavorite = async (paperData) => {
        try {
            const newFav = await favoriteService.add({
                ...paperData,
                userId: auth.user.id,
            });
            setFavorites((old) => [...old, newFav]);
            return newFav;
        } catch (err) {
            console.error('Error adding favorite:', err);
            throw err;
        }
    };

    const removeFavorite = async (favoriteId) => {
        try {
            await favoriteService.remove(favoriteId);
            setFavorites((old) => old.filter((f) => f.id !== favoriteId));
        } catch (err) {
            console.error('Error removing favorite:', err);
            throw err;
        }
    };

    const isFavorite = (paperId) => {
        return favorites.some((f) => f.paperId === paperId);
    };

    const getFavoriteByPaperId = (paperId) => {
        return favorites.find((f) => f.paperId === paperId);
    };

    const contextValue = {
        favorites,
        isLoading,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavoriteByPaperId,
        refreshFavorites: loadFavorites,
    };

    return (
        <FavoritesContext.Provider value={contextValue}>
            {children}
        </FavoritesContext.Provider>
    );
}
