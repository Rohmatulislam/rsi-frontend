import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";
import { getDoctorBySlugQueryKey } from "./getDoctorBySlug";

export type CreateRatingDto = {
    doctorId: string;
    rating: number;
    comment?: string;
};

export const createRating = ({ data }: { data: CreateRatingDto }) => {
    return axiosInstance.post("/ratings", data);
};

type UseCreateRatingOptions = {
    mutationConfig?: MutationConfig<typeof createRating>;
    doctorSlug?: string;
};

export const useCreateRating = ({ mutationConfig, doctorSlug }: UseCreateRatingOptions = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
            if (doctorSlug) {
                queryClient.invalidateQueries({ queryKey: getDoctorBySlugQueryKey(doctorSlug) });
            }
            queryClient.invalidateQueries({ queryKey: ["ratings"] });
        },
        ...mutationConfig,
        mutationFn: createRating,
    });
};
