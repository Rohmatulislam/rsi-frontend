import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { toast } from "sonner";

export const deleteServiceItem = async ({ id }: { id: string }) => {
    const response = await axiosInstance.delete(`/services/items/${id}`);
    return response.data;
};

type UseDeleteServiceItemParams = {
    mutationConfig?: MutationConfig<typeof deleteServiceItem>;
};

export const useDeleteServiceItem = ({ mutationConfig }: UseDeleteServiceItemParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services-list"] });
            queryClient.invalidateQueries({ queryKey: ["service-detail"] });
            toast.success("Item layanan berhasil dihapus");
        },
        onError: (error) => {
            toast.error("Gagal menghapus item layanan");
        },
        ...mutationConfig,
        mutationFn: deleteServiceItem,
    });
};
