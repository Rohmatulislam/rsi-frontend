import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { partnerKeys } from "./getPartners";
import { toast } from "sonner";

export const deletePartner = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/partners/${id}`);
};

export const useDeletePartner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: partnerKeys.all });
            toast.success("Partner berhasil dihapus");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal menghapus partner");
        },
    });
};
