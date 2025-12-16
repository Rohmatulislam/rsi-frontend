import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export interface CoreValue {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

type GetCoreValuesResponse = CoreValue[];

export const getCoreValues = async () => {
    const response = await axiosInstance.get<GetCoreValuesResponse>("/about/values");
    return response.data;
};

export const getCoreValuesQueryKey = () => ["about-core-values"];

export const getCoreValuesQueryOptions = () => {
    return queryOptions({
        queryKey: getCoreValuesQueryKey(),
        queryFn: () => getCoreValues(),
    });
}

type UseGetCoreValuesParams = {
    queryConfig?: QueryConfig<typeof getCoreValues>;
};

export const useGetCoreValues = ({ queryConfig }: UseGetCoreValuesParams = {}) => {
    return useQuery({
        ...getCoreValuesQueryOptions(),
        ...queryConfig,
    });
};
