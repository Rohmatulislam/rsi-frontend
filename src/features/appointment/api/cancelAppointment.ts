import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export const cancelAppointment = async (appointmentId: string) => {
    const response = await axiosInstance.delete(`/appointments/${appointmentId}`);
    return response.data;
};

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            // Invalidate patient history queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ["patientHistory"] });
            queryClient.invalidateQueries({ queryKey: ["myPatients"] });
        },
    });
};
