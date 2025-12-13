import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export type PoliklinikDto = {
  kd_poli: string;
  nm_poli: string;
};

type GetActivePoliResponse = PoliklinikDto[];

export const getActivePoli = async () => {
    const response = await axiosInstance.get<GetActivePoliResponse>("/doctors/active-poli");
    return response.data;
};

export const getActivePoliQueryKey = () => ["active-poli"];

export const getActivePoliQueryOptions = () => {
    return queryOptions({
        queryKey: getActivePoliQueryKey(),
        queryFn: () => getActivePoli(),
    });
};

type UseGetActivePoliParams = {
    queryConfig?: QueryConfig<typeof getActivePoli>;
};

export const useGetActivePoli = ({ queryConfig }: UseGetActivePoliParams = {}) => {
    return useQuery({
        ...getActivePoliQueryOptions(),
        ...queryConfig,
    });
};