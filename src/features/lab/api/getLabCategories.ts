import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export const getLabCategories = async (kd_pj?: string): Promise<string[]> => {
    const response = await axiosInstance.get("lab/categories", {
        params: { kd_pj }
    });
    return response.data;
};

export const getLabCategoriesQueryOptions = (kd_pj?: string) => {
    return queryOptions({
        queryKey: ["lab", "categories", kd_pj || "default"],
        queryFn: () => getLabCategories(kd_pj),
    });
};

type UseLabCategoriesOptions = {
    kd_pj?: string;
    queryConfig?: QueryConfig<typeof getLabCategories>;
};

export const useLabCategories = ({ kd_pj, queryConfig }: UseLabCategoriesOptions = {}) => {
    return useQuery({
        ...getLabCategoriesQueryOptions(kd_pj),
        ...queryConfig,
    });
};
