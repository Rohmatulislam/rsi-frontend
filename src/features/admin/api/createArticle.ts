import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { ArticleDto } from "~/features/article/services/articleService";
import { CreateArticleDto } from "~/features/admin/types/article";

export const createArticle = async (data: CreateArticleDto) => {
    return axiosInstance.post<ArticleDto>("/articles", data).then((res) => res.data);
};

export const useCreateArticle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles-list"] });
        },
    });
};
