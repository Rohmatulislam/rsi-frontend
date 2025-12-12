import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export type CreateAppointmentDto = {
  doctorId: string;
  bookingDate: string;
  patientType: "new" | "old";
  mrNumber?: string;
  nik?: string;
  patientName: string; // Changed from fullName to match backend
  patientPhone: string; // Changed from phone to match backend
  patientEmail?: string; // New field
  patientAddress?: string; // New field
  birthDate?: string; // New field - required for new patients
  gender?: "L" | "P"; // New field - required for new patients
  paymentType: "umum" | "bpjs";
  bpjsNumber?: string;
  keluhan?: string; // New field - complaint/reason
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
