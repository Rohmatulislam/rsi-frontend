import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Medicine {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    total_stock: string | number;
}

export const useSearchMedicines = (query: string) => {
    return useQuery<Medicine[]>({
        queryKey: ["medicines-search", query],
        queryFn: async () => {
            if (!query || query.length < 3) return [];
            const { data } = await axios.get(`/api/farmasi/search?q=${query}`);
            return data;
        },
        enabled: query.length >= 3,
    });
};
