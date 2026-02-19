import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner"; // Assuming sonner is used, or fallback to alert

export const broadcastReminders = async () => {
    const response = await axiosInstance.post<{ success: boolean; message: string }>("/reminders/broadcast");
    return response.data;
};

export const useBroadcastReminders = () => {
    return useMutation({
        mutationFn: broadcastReminders,
        onSuccess: (data) => {
            alert(data.message); // Simple alert for now as seen in other files
        },
        onError: (error: any) => {
            console.error(error);
            alert("Failed to send reminders: " + (error.response?.data?.message || error.message));
        }
    });
};
