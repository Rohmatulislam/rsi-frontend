import { axiosInstance } from "~/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateArticleDto {
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    category?: string;
    tags?: string[];
    published?: boolean;
}

export const createArticle = async (data: CreateArticleDto) => {
    const response = await axiosInstance.post("/articles", data);
    return response.data;
};

export const useCreateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
    });
};
