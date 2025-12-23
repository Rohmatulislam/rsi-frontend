import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { CreateCategoryDto } from "../types/category";

const createCategory = async (data: CreateCategoryDto) => {
    const response = await axiosInstance.post("/categories", data);
    return response.data;
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        },
    });
};
