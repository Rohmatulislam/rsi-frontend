import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface AppointmentHistory {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: Date;
  status: string;
  reason: string;
  notes: string;
  doctor: {
    name: string;
    specialization: string;
    imageUrl?: string;
  };
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    sentAt: Date;
    status: string;
  }>;
}

export const getPatientHistory = async (patientId: string): Promise<AppointmentHistory[]> => {
  const response = await axiosInstance.get(`/appointments/patient/${patientId}`);
  return response.data;
};

export const usePatientHistory = (patientId: string) => {
  return useQuery({
    queryKey: ["patientHistory", patientId],
    queryFn: () => getPatientHistory(patientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!patientId, // Only run query if patientId exists
  });
};