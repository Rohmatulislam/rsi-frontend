import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { ArticleDto } from "~/features/article/services/articleService";
import { UpdateArticleDto } from "~/features/admin/types/article";

export const updateArticle = async ({ slug, data }: { slug: string; data: UpdateArticleDto }) => {
    if (!slug || slug === 'undefined' || slug === 'null') {
        throw new Error(`Invalid article slug for update: ${slug}`);
    }
    const url = `articles/${slug}`;
    return axiosInstance.patch<ArticleDto>(url, data).then((res) => res.data);
};

export const useUpdateArticle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateArticle,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["articles-list"] });
            queryClient.invalidateQueries({ queryKey: ["article-detail", variables.slug] });
        },
    });
};
