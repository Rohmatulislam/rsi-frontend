import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { partnerKeys } from "./getPartners";
import { toast } from "sonner";

export const reorderPartners = async (orders: { id: string; order: number }[]): Promise<void> => {
    await axiosInstance.patch("/partners/reorder/bulk", orders);
};

export const useReorderPartners = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reorderPartners,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: partnerKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal mengatur urutan");
        },
    });
};
