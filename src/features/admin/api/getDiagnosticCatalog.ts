import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DiagnosticCatalogItem {
    id: string;
    name: string;
    price: number | null;
    category?: string;
    description: string;
    preparation: string[];
    estimatedTime: string;
    isPopular: boolean;
    imageUrl: string | null;
    type: 'LAB' | 'RADIOLOGY';
}

const fetchCatalog = async (type: 'lab' | 'radiology'): Promise<DiagnosticCatalogItem[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";
    // We fetch tests from the existing public endpoints but they are now enriched with metadata
    const response = await axios.get(`${baseUrl}/${type}/tests`);
    return response.data.map((item: any) => ({
        ...item,
        type: type.toUpperCase()
    }));
};

export const useGetDiagnosticCatalog = (type: 'lab' | 'radiology') => {
    return useQuery({
        queryKey: ["diagnostic-catalog", type],
        queryFn: () => fetchCatalog(type),
    });
};
