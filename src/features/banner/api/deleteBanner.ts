import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { bannerKeys } from "./getBanners";
import { toast } from "sonner";

export const deleteBanner = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/banners/${id}`);
};

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
            toast.success("Banner berhasil dihapus!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal menghapus banner");
        },
    });
};
