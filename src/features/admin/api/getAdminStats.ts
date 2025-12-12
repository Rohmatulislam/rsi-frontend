import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export type AdminDashboardStats = {
    totalAppointments: number;
    scheduledAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
};

export const getAdminStats = async () => {
    const response = await axiosInstance.get<AdminDashboardStats>("/admin/dashboard/stats");
    return response.data;
};

export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin", "stats"],
        queryFn: getAdminStats,
    });
};
