import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

interface QueueInfo {
    total: number;
    served: number;
    current: string;
    remaining: number;
}

export const useGetPoliQueue = (id: string) => {
    return useQuery({
        queryKey: ['poli-queue', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get<QueueInfo>(`/services/items/${id}/queue`);
            return data;
        },
        // Refetch every 30 seconds for "Live" feel
        refetchInterval: 30000,
        retry: false,
    });
};
