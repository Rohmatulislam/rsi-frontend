import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { CreateDoctorScheduleExceptionDto, DoctorScheduleException } from "../types/doctor";

export const useGetDoctorExceptions = (doctorId: string) => {
    return useQuery({
        queryKey: ["doctor-exceptions", doctorId],
        queryFn: async () => {
            const response = await axiosInstance.get<DoctorScheduleException[]>(`/doctors/exceptions/${doctorId}`);
            return response.data;
        },
        enabled: !!doctorId,
    });
};

export const useCreateDoctorException = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateDoctorScheduleExceptionDto) => {
            const response = await axiosInstance.post("/doctors/exceptions", data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["doctor-exceptions", variables.doctorId] });
        }
    });
};

export const useDeleteDoctorException = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/doctors/exceptions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-exceptions"] });
        }
    });
};
