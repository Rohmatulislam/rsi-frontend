import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { CreateBannerDto, Banner } from "../services/bannerService";
import { bannerKeys } from "./getBanners";
import { toast } from "sonner";

export const createBanner = async (data: CreateBannerDto): Promise<Banner> => {
    const response = await axiosInstance.post("/banners", data);
    return response.data;
};

export const useCreateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
            toast.success("Banner berhasil dibuat!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal membuat banner");
        },
    });
};
