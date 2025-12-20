import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { ServiceDto } from "../types";
import { toast } from "sonner";

export type CreateServiceInput = Omit<ServiceDto, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'items' | 'faqs'>;

export const createService = async ({ data }: { data: CreateServiceInput }) => {
    const response = await axiosInstance.post<ServiceDto>('/services', data);
    return response.data;
};

type UseCreateServiceParams = {
    mutationConfig?: MutationConfig<typeof createService>;
};

export const useCreateService = ({ mutationConfig }: UseCreateServiceParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services-list"] });
            toast.success("Layanan berhasil dibuat");
        },
        onError: (error) => {
            toast.error("Gagal membuat layanan");
        },
        ...mutationConfig,
        mutationFn: createService,
    });
};
