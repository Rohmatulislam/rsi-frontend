import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { UpdateCategoryDto } from "../types/category";

const updateCategory = async ({ id, data }: { id: string; data: UpdateCategoryDto }) => {
    const response = await axiosInstance.patch(`/categories/${id}`, data);
    return response.data;
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
    });
};
