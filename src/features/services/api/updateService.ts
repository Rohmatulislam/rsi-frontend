import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { ServiceDto } from "../types";
import { toast } from "sonner";

export type UpdateServiceInput = Partial<Omit<ServiceDto, 'id' | 'createdAt' | 'updatedAt'>>;

export const updateService = async ({ id, data }: { id: string; data: UpdateServiceInput }) => {
    const response = await axiosInstance.patch<ServiceDto>(`/services/${id}`, data);
    return response.data;
};

type UseUpdateServiceParams = {
    mutationConfig?: MutationConfig<typeof updateService>;
};

export const useUpdateService = ({ mutationConfig }: UseUpdateServiceParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["services-list"] });
            queryClient.invalidateQueries({ queryKey: ["service-detail", data.slug] });
            toast.success("Layanan berhasil diperbarui");
        },
        onError: (error) => {
            toast.error("Gagal memperbarui layanan");
        },
        ...mutationConfig,
        mutationFn: updateService,
    });
};
