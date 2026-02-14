import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { ArticleDto } from "../services/articleService";

export const getRelatedArticles = async (slug: string) => {
    const response = await axiosInstance.get<ArticleDto[]>(`articles/${slug}/related`);
    return response.data;
};

export const useGetRelatedArticles = (slug: string) => {
    return useQuery({
        queryKey: ["articles", "related", slug],
        queryFn: () => getRelatedArticles(slug),
        enabled: !!slug,
    });
};
