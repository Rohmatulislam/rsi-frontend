import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '~/lib/axios';

export interface RecentBooking {
    id: string;
    patientName: string;
    doctorName: string;
    specialty: string;
    appointmentDate: Date;
    status: string;
    createdAt: Date;
}

export const getRecentBookings = async (limit: number = 20): Promise<RecentBooking[]> => {
    const response = await axiosInstance.get<RecentBooking[]>(`/admin/dashboard/recent-bookings?limit=${limit}`);
    return response.data;
};

export const getRecentBookingsQueryKey = (limit: number) => ['admin-recent-bookings', limit];

export const useGetRecentBookings = (limit: number = 20) => {
    return useQuery({
        queryKey: getRecentBookingsQueryKey(limit),
        queryFn: () => getRecentBookings(limit),
        staleTime: 1000 * 60, // 1 minute (more frequent for recent bookings)
    });
};
