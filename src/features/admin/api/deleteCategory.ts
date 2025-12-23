import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

const deleteCategory = async (id: string) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
    });
};
