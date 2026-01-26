import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface Medicine {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    total_stock: string | number;
    image?: string;
    description?: string;
}

export const useSearchMedicines = (query: string) => {
    return useQuery<Medicine[]>({
        queryKey: ["medicines-search", query],
        queryFn: async () => {
            if (!query || query.length < 3) return [];
            const { data } = await axiosInstance.get(`/farmasi/search?q=${query}`);
            return data;
        },
        enabled: query.length >= 3,
    });
};
