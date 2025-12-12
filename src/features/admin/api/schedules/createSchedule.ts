import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export type CreateScheduleDto = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export const createSchedule = async ({ doctorId, data }: { doctorId: string; data: CreateScheduleDto }) => {
    const response = await axiosInstance.post(`/doctors/${doctorId}/schedules`, data);
    return response.data;
};

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
            // queryClient.invalidateQueries({ queryKey: ["schedules-list"] });
        },
        onError: (error) => {
            alert("Failed to create schedule: " + error.message);
        }
    });
};
