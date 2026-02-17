import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export type RatingDto = {
    id: string;
    doctorId: string;
    userId: string;
    rating: number;
    comment: string | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    user: {
        name: string;
        image: string | null;
    };
    doctor: {
        name: string;
    };
};

export type GetRatingsQuery = {
    doctorId?: string;
    status?: string;
};

export const getRatings = async (query: GetRatingsQuery): Promise<RatingDto[]> => {
    const response = await axiosInstance.get("/ratings", { params: query });
    return response.data;
};

export const getRatingsQueryKey = (query: GetRatingsQuery) => ["ratings", query];

export const useGetRatings = (query: GetRatingsQuery, queryConfig?: QueryConfig<typeof getRatings>) => {
    return useQuery({
        queryKey: getRatingsQueryKey(query),
        queryFn: () => getRatings(query),
        ...queryConfig,
    });
};
