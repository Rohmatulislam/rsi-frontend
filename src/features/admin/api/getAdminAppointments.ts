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
    noRawat?: string;
    noReg?: string;
    poliCode?: string;
    poliName?: string;
    payerName?: string;
    payerCode?: string;
};

export type AdminAppointmentsReport = {
    total: number;
    appointments: AdminAppointmentDto[];
    byStatus: Record<string, number>;
};

export const getAdminAppointments = async (startDate?: string, endDate?: string, search?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (search) params.append("search", search);

    const response = await axiosInstance.get<AdminAppointmentsReport>("/admin/appointments/reports", {
        params
    });
    return response.data;
};

export const useAdminAppointments = (startDate?: string, endDate?: string, search?: string) => {
    return useQuery({
        queryKey: ["admin", "appointments", startDate, endDate, search],
        queryFn: () => getAdminAppointments(startDate, endDate, search),
    });
};
