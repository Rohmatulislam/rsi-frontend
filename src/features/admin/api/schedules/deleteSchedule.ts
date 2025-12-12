import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export const deleteSchedule = async (id: string) => {
    const response = await axiosInstance.delete(`/doctors/schedules/${id}`);
    return response.data;
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
        },
        onError: (error) => {
            alert("Failed to delete schedule: " + error.message);
        }
    });
};
