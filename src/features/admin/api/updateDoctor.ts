import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { DoctorDto } from "~/features/home/api/getDoctors";

export const updateDoctor = async ({ id, data }: { id: string; data: Partial<DoctorDto> }) => {
    const response = await axiosInstance.patch<DoctorDto>(`/doctors/${id}`, data);
    return response.data;
};

export const useUpdateDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors-list"] });
            // alert("Doctor updated successfully!");
        },
        onError: (error) => {
            alert("Failed to update doctor: " + error.message);
        }
    });
};
