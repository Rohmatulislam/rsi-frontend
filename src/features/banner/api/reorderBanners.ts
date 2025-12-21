import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { ReorderBannerDto } from "../services/bannerService";
import { bannerKeys } from "./getBanners";
import { toast } from "sonner";

export const reorderBanners = async (orders: ReorderBannerDto[]): Promise<void> => {
    await axiosInstance.patch("/banners/reorder/bulk", orders);
};

export const useReorderBanners = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reorderBanners,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
            toast.success("Urutan banner berhasil diupdate!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal mengupdate urutan banner");
        },
    });
};
