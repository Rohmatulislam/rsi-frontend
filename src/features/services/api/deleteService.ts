import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { toast } from "sonner";

export const deleteService = async ({ id }: { id: string }) => {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
};

type UseDeleteServiceParams = {
    mutationConfig?: MutationConfig<typeof deleteService>;
};

export const useDeleteService = ({ mutationConfig }: UseDeleteServiceParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services-list"] });
            toast.success("Layanan berhasil dihapus");
        },
        onError: (error) => {
            toast.error("Gagal menghapus layanan");
        },
        ...mutationConfig,
        mutationFn: deleteService,
    });
};
