import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { CreatePartnerPayload, Partner } from "../services/partnerService";
import { partnerKeys } from "./getPartners";
import { toast } from "sonner";

export const createPartner = async (payload: CreatePartnerPayload): Promise<Partner> => {
    const { data } = await axiosInstance.post("/partners", payload);
    return data;
};

export const useCreatePartner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: partnerKeys.all });
            toast.success("Partner berhasil ditambahkan");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal menambahkan partner");
        },
    });
};
