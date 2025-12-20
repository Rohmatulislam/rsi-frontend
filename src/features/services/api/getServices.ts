import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { ServiceDto } from "../types";

export const getServices = async () => {
    const response = await axiosInstance.get<ServiceDto[]>("/services");
    return response.data;
};

export const getServicesQueryOptions = () => {
    return queryOptions({
        queryKey: ["services-list"],
        queryFn: () => getServices(),
    });
};

type UseGetServicesParams = {
    queryConfig?: QueryConfig<typeof getServices>;
};

export const useGetServices = ({ queryConfig }: UseGetServicesParams = {}) => {
    return useQuery({
        ...getServicesQueryOptions(),
        ...queryConfig,
    });
};
