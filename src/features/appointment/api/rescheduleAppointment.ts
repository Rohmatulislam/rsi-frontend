import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface RescheduleAppointmentDto {
    newDate: string; // YYYY-MM-DD
    newTime?: string; // HH:MM
}

export const rescheduleAppointment = async (
    appointmentId: string,
    data: RescheduleAppointmentDto
) => {
    const response = await axiosInstance.patch(`/appointments/${appointmentId}/reschedule`, data);
    return response.data;
};

export const useRescheduleAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ appointmentId, data }: { appointmentId: string; data: RescheduleAppointmentDto }) =>
            rescheduleAppointment(appointmentId, data),
        onSuccess: () => {
            // Invalidate queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ["myPatients"] });
            queryClient.invalidateQueries({ queryKey: ["patientHistory"] });
        },
    });
};
