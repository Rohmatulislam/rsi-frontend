import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { MutationConfig } from "~/lib/react-query";

export type UpdateRatingStatusDto = {
    status: 'APPROVED' | 'REJECTED';
};

export const updateRatingStatus = ({
    ratingId,
    data
}: {
    ratingId: string;
    data: UpdateRatingStatusDto
}) => {
    return axiosInstance.patch(`/ratings/${ratingId}/status`, data);
};

type UseUpdateRatingStatusOptions = {
    mutationConfig?: MutationConfig<typeof updateRatingStatus>;
};

export const useUpdateRatingStatus = ({ mutationConfig }: UseUpdateRatingStatusOptions = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ratings"] });
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
        },
        ...mutationConfig,
        mutationFn: updateRatingStatus,
    });
};
