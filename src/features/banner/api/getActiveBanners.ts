import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Banner } from "../services/bannerService";
import { bannerKeys } from "./getBanners";

export const getActiveBanners = async (): Promise<Banner[]> => {
    const { data } = await axiosInstance.get("/banners/active");
    return data;
};

export const useGetActiveBanners = () => {
    return useQuery({
        queryKey: bannerKeys.active(),
        queryFn: getActiveBanners,
    });
};
