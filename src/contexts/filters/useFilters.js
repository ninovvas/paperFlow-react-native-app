import { useContext } from "react";
import { FilterContext } from "./FilterProvider.jsx";

export function useFilters() {
    const context = useContext(FilterContext);

     if (!context) {
        throw new Error("useFilters must be used within a FilterProvider");
    }

    return context;
}
