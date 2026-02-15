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
    if (!slug || slug === 'undefined' || slug === 'null') {
        throw new Error(`Invalid article slug for update: ${slug}`);
    }
    const url = `articles/${slug}`;
    const response = await axiosInstance.patch(url, data);
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
