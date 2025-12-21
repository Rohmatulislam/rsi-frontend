import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { UpdateBannerDto, Banner } from "../services/bannerService";
import { bannerKeys } from "./getBanners";
import { toast } from "sonner";

export const updateBanner = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateBannerDto;
}): Promise<Banner> => {
    const response = await axiosInstance.patch(`/banners/${id}`, data);
    return response.data;
};

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
            toast.success("Banner berhasil diupdate!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal mengupdate banner");
        },
    });
};
