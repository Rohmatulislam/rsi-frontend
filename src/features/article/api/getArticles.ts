import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { ArticleDto } from "../types";

export const getArticles = async () => {
    const response = await axiosInstance.get<ArticleDto[]>("/articles");
    return response.data;
};

export const getArticlesQueryOptions = () => {
    return queryOptions({
        queryKey: ["articles-list"],
        queryFn: () => getArticles(),
    });
};

type UseGetArticlesParams = {
    queryConfig?: QueryConfig<typeof getArticles>;
};

export const useGetArticles = ({ queryConfig }: UseGetArticlesParams = {}) => {
    return useQuery({
        ...getArticlesQueryOptions(),
        ...queryConfig,
    });
};
