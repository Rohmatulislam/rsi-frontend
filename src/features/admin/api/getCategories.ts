import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { Category } from "../types/category";

// Re-export for backwards compatibility
export type { Category };

export const getCategories = async () => {
    const response = await axiosInstance.get<Category[]>("categories");
    return response.data;
};

export const getCategoriesQueryOptions = () => {
    return queryOptions({
        queryKey: ["admin-categories"],
        queryFn: () => getCategories(),
    });
};

type UseGetCategoriesParams = {
    queryConfig?: QueryConfig<typeof getCategories>;
};

export const useGetCategories = ({ queryConfig }: UseGetCategoriesParams = {}) => {
    return useQuery({
        ...getCategoriesQueryOptions(),
        ...queryConfig,
    });
};
