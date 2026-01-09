import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export const syncDoctors = async () => {
    const response = await axiosInstance.post<{ message: string; status: string }>("/doctors/sync");
    return response.data;
};

export const useSyncDoctors = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncDoctors,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
            alert(data.message);
        },
        onError: (error) => {
            alert("Failed to sync doctors: " + error.message);
        }
    });
};
