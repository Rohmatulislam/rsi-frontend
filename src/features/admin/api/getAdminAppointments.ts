import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export type AdminAppointmentDto = {
    id: string;
    patientName: string;
    patientId: string; // RM
    doctor: {
        name: string;
        specialization: string;
    };
    appointmentDate: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes: string;
};

export type AdminAppointmentsReport = {
    total: number;
    appointments: AdminAppointmentDto[];
    byStatus: Record<string, number>;
};

export const getAdminAppointments = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axiosInstance.get<AdminAppointmentsReport>("/admin/appointments/reports", {
        params
    });
    return response.data;
};

export const useAdminAppointments = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ["admin", "appointments", startDate, endDate],
        queryFn: () => getAdminAppointments(startDate, endDate),
    });
};
