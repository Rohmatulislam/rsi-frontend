import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { CreateMcuBookingDto } from "../services/mcuService";
import { mcuKeys } from "./getMcuPackages";


export const createMcuBooking = async (data: CreateMcuBookingDto) => {
    const response = await axiosInstance.post("/mcu/booking", data);
    return response.data;
};

export const useCreateMcuBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMcuBooking,
        onSuccess: () => {
            // Invalidate MCU-related queries
            queryClient.invalidateQueries({ queryKey: mcuKeys.all });
            // Also invalidate general appointment/patient history if relevant
            queryClient.invalidateQueries({ queryKey: ["myPatients"] });
        },
    });
};
