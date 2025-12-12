import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export const syncDoctors = async () => {
    const response = await axiosInstance.post<{ message: string }>("/doctors/sync");
    return response.data;
};

export const useSyncDoctors = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncDoctors,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
            alert("Doctors synced successfully!");
        },
        onError: (error) => {
            alert("Failed to sync doctors: " + error.message);
        }
    });
};
