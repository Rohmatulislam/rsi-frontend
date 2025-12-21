import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { SubmitPrescriptionParams } from "../services/farmasiService";

export const submitPrescription = async (data: SubmitPrescriptionParams) => {
    const response = await axiosInstance.post(`/farmasi/prescription/submit`, data);
    return response.data;
};

type UseSubmitPrescriptionOptions = {
    mutationConfig?: MutationConfig<typeof submitPrescription>;
};

export const useSubmitPrescription = ({
    mutationConfig,
}: UseSubmitPrescriptionOptions = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
            mutationConfig?.onSuccess?.(...args);
        },
        ...mutationConfig,
        mutationFn: submitPrescription,
    });
};
