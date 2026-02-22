import { useContext } from "react";
import { FilterContext } from "./FilterProvider.jsx";

export function useFilters() {
    const context = useContext(FilterContext);

    return context;
}
