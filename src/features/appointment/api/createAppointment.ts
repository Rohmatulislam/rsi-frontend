import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export type CreateAppointmentDto = {
  doctorId: string;
  bookingDate: string;
  patientType: "new" | "old";
  mrNumber?: string;
  nik?: string;
  fullName?: string;
  phone?: string;
  paymentType: "umum" | "bpjs";
  bpjsNumber?: string;
};

export const createAppointment = async (data: CreateAppointmentDto) => {
  const response = await axiosInstance.post("/appointments", data);
  return response.data;
};

export const useCreateAppointment = () => {
    return useMutation({
        mutationFn: createAppointment,
    });
};
