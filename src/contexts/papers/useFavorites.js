import { useContext } from "react";
import { FavoritesContext } from "./FavoritesProvider.jsx";

export function useFavorites() {
    const context = useContext(FavoritesContext);

    return context;
}
