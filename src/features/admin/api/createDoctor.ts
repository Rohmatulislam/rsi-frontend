// features/admin/api/createDoctor.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { CreateDoctorDto } from "../types/doctor";

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDoctorDto) => {
      const response = await axiosInstance.post("/admin/doctors", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch doctors list
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};