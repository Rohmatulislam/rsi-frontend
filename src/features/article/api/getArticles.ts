import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { ArticleDto } from "../services/articleService";

export const getArticles = async (search?: string) => {
    const response = await axiosInstance.get<ArticleDto[]>("articles", {
        params: { search }
    });
    return response.data;
};

export const getArticlesQueryOptions = (search?: string) => {
    return queryOptions({
        queryKey: ["articles-list", { search }] as const,
        queryFn: () => getArticles(search),
    });
};

type UseGetArticlesParams = {
    search?: string;
    queryConfig?: QueryConfig<typeof getArticles>;
};

export const useGetArticles = ({ search, queryConfig }: UseGetArticlesParams = {}) => {
    return useQuery({
        ...getArticlesQueryOptions(search),
        ...queryConfig,
    });
};
