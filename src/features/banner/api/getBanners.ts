import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Banner } from "../services/bannerService";

export const bannerKeys = {
    all: ["banners"] as const,
    lists: () => [...bannerKeys.all, "list"] as const,
    list: (filters: string) => [...bannerKeys.lists(), { filters }] as const,
    details: () => [...bannerKeys.all, "detail"] as const,
    detail: (id: string) => [...bannerKeys.details(), id] as const,
    active: () => [...bannerKeys.all, "active"] as const,
};

export const getBanners = async (): Promise<Banner[]> => {
    const { data } = await axiosInstance.get("banners");
    return data;
};

export const useGetBanners = () => {
    return useQuery({
        queryKey: bannerKeys.lists(),
        queryFn: getBanners,
    });
};
