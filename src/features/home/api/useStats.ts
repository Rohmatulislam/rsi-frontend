import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface SiteStats {
    visitorCount: number;
    lastUpdated: string;
}

export const useGetStats = () => {
    return useQuery<SiteStats>({
        queryKey: ["site-stats"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/stats");
            return data;
        },
        // Don't refetch too often
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useTrackVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.post("/stats/track-visit");
            return data;
        },
        onSuccess: (data) => {
            // Update the local stats cache with the new value
            queryClient.setQueryData(["site-stats"], (old: SiteStats | undefined) => {
                if (!old) return { visitorCount: data.visitorCount, lastUpdated: new Date().toISOString() };
                return { ...old, visitorCount: data.visitorCount };
            });
        },
    });
};
