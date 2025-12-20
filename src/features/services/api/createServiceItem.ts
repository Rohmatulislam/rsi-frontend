import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { ServiceItemDto } from "../types";
import { toast } from "sonner";

export type CreateServiceItemInput = Omit<ServiceItemDto, 'id' | 'createdAt' | 'updatedAt'>;

export const createServiceItem = async ({ data }: { data: CreateServiceItemInput }) => {
    const response = await axiosInstance.post<ServiceItemDto>('/services/items', data);
    return response.data;
};

type UseCreateServiceItemParams = {
    mutationConfig?: MutationConfig<typeof createServiceItem>;
};

export const useCreateServiceItem = ({ mutationConfig }: UseCreateServiceItemParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["services-list"] });
            queryClient.invalidateQueries({ queryKey: ["service-detail"] });
            toast.success("Item layanan berhasil ditambahkan");
        },
        onError: (error) => {
            toast.error("Gagal menambahkan item layanan");
        },
        ...mutationConfig,
        mutationFn: createServiceItem,
    });
};
