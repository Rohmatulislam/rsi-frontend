import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { UpdatePartnerPayload, Partner } from "../services/partnerService";
import { partnerKeys } from "./getPartners";
import { toast } from "sonner";

export const updatePartner = async ({ id, ...payload }: UpdatePartnerPayload): Promise<Partner> => {
    const { data } = await axiosInstance.patch(`/partners/${id}`, payload);
    return data;
};

export const useUpdatePartner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: partnerKeys.all });
            toast.success("Partner berhasil diperbarui");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal memperbarui partner");
        },
    });
};
