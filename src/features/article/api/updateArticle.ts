import { axiosInstance } from "~/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateArticleDto {
    title?: string;
    content?: string;
    excerpt?: string;
    image?: string;
    category?: string;
    tags?: string[];
    published?: boolean;
}

export const updateArticle = async ({ slug, data }: { slug: string; data: UpdateArticleDto }) => {
    const response = await axiosInstance.patch(`/articles/${slug}`, data);
    return response.data;
};

export const useUpdateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
    });
};
