import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '~/lib/axios';

interface DashboardStats {
    totalBookings: number;
    scheduledBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    todayBookings: number;
    weekBookings: number;
    monthBookings: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>('/admin/dashboard/stats');
    return response.data;
};

export const getDashboardStatsQueryKey = () => ['admin-dashboard-stats'];

export const useGetDashboardStats = () => {
    return useQuery({
        queryKey: getDashboardStatsQueryKey(),
        queryFn: getDashboardStats,
        refetchInterval: 10000, // Sync every 10 seconds
    });
};
