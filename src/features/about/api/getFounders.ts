import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export interface Founder {
    id: string;
    name: string;
    role: string;
    description?: string;
    image?: string;
    badge?: string;
    order: number;
}

type GetFoundersResponse = Founder[];

export const getFounders = async () => {
    const response = await axiosInstance.get<GetFoundersResponse>("/about/founders");
    return response.data;
};

export const getFoundersQueryKey = () => ["about-founders"];

export const getFoundersQueryOptions = () => {
    return queryOptions({
        queryKey: getFoundersQueryKey(),
        queryFn: () => getFounders(),
    });
}

type UseGetFoundersParams = {
    queryConfig?: QueryConfig<typeof getFounders>;
};

export const useGetFounders = ({ queryConfig }: UseGetFoundersParams = {}) => {
    return useQuery({
        ...getFoundersQueryOptions(),
        ...queryConfig,
    });
};
