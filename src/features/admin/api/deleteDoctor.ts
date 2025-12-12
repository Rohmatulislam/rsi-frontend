import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export const deleteDoctor = async (id: string) => {
    const response = await axiosInstance.delete(`/doctors/${id}`);
    return response.data;
};

export const useDeleteDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
        },
        onError: (error) => {
            alert("Failed to delete doctor: " + error.message);
        }
    });
};
