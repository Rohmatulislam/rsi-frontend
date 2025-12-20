import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { McuPackage, McuPackagesResponse } from "../types";

export type { McuPackage };

// Query Key Factory
export const mcuKeys = {
    all: ["mcu"] as const,
    packages: () => [...mcuKeys.all, "packages"] as const,
    package: (id: string) => [...mcuKeys.packages(), id] as const,
};

// API Function
export const getMcuPackages = async (): Promise<McuPackage[]> => {
    const response = await axiosInstance.get<McuPackagesResponse>('/mcu/packages');
    return response.data.data || [];
};

// Query Options
export const getMcuPackagesQueryOptions = () => {
    return queryOptions({
        queryKey: mcuKeys.packages(),
        queryFn: getMcuPackages,
    });
};

// Hook Type
type UseGetMcuPackagesParams = {
    queryConfig?: QueryConfig<typeof getMcuPackages>;
};

// React Query Hook
export const useGetMcuPackages = ({ queryConfig }: UseGetMcuPackagesParams = {}) => {
    return useQuery({
        ...getMcuPackagesQueryOptions(),
        ...queryConfig,
    });
};
