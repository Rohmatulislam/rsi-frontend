import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface MyPatient {
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    appointmentsCount: number;
    lastAppointment: string;
    appointments: {
        id: string;
        appointmentDate: string;
        status: string;
        doctor: {
            name: string;
            specialization: string;
            imageUrl: string;
        };
        notes: string;
    }[];
}

export interface MyPatientsResponse {
    totalPatients: number;
    totalAppointments: number;
    patients: MyPatient[];
}

export const getMyPatients = async (userId: string): Promise<MyPatientsResponse> => {
    const response = await axiosInstance.get(`/appointments/my-patients/${userId}`);
    return response.data;
};

export const useMyPatients = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["myPatients", userId],
        queryFn: () => getMyPatients(userId!),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId, // Only run query if userId exists
    });
};
