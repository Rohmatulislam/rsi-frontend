import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export const getRadioCategories = async (kd_pj?: string): Promise<string[]> => {
    const response = await axiosInstance.get("/radiologi/categories", {
        params: { kd_pj }
    });
    return response.data;
};

export const getRadioCategoriesQueryOptions = (kd_pj?: string) => {
    return queryOptions({
        queryKey: ["radiology", "categories", kd_pj || "default"],
        queryFn: () => getRadioCategories(kd_pj),
    });
};

type UseRadioCategoriesOptions = {
    kd_pj?: string;
    queryConfig?: QueryConfig<typeof getRadioCategories>;
};

export const useRadioCategories = ({ kd_pj, queryConfig }: UseRadioCategoriesOptions = {}) => {
    return useQuery({
        ...getRadioCategoriesQueryOptions(kd_pj),
        ...queryConfig,
    });
};
