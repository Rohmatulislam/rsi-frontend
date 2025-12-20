import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { ServiceItemDto } from "../types";
import { toast } from "sonner";

export type UpdateServiceItemInput = Partial<Omit<ServiceItemDto, 'id' | 'createdAt' | 'updatedAt'>>;

export const updateServiceItem = async ({ id, data }: { id: string; data: UpdateServiceItemInput }) => {
    const response = await axiosInstance.patch<ServiceItemDto>(`/services/items/${id}`, data);
    return response.data;
};

type UseUpdateServiceItemParams = {
    mutationConfig?: MutationConfig<typeof updateServiceItem>;
};

export const useUpdateServiceItem = ({ mutationConfig }: UseUpdateServiceItemParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["services-list"] });
            queryClient.invalidateQueries({ queryKey: ["service-detail"] });
            toast.success("Item layanan berhasil diperbarui");
        },
        onError: (error) => {
            toast.error("Gagal memperbarui item layanan");
        },
        ...mutationConfig,
        mutationFn: updateServiceItem,
    });
};
