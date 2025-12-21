import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";
import { ArticleDto } from "../services/articleService";

export const getArticleBySlug = async (slug: string) => {
    const response = await axiosInstance.get<ArticleDto>(`/articles/${slug}`);
    return response.data;
};

export const getArticleBySlugQueryOptions = (slug: string) => {
    return queryOptions({
        queryKey: ["article-detail", slug],
        queryFn: () => getArticleBySlug(slug),
        enabled: !!slug,
    });
};

type UseGetArticleParams = {
    slug: string;
    queryConfig?: QueryConfig<typeof getArticleBySlug>;
};

export const useGetArticleBySlug = ({ slug, queryConfig }: UseGetArticleParams) => {
    return useQuery({
        ...getArticleBySlugQueryOptions(slug),
        ...queryConfig,
    });
};
