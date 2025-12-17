import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '~/lib/axios';

export interface BookingTrend {
    date: string;
    count: number;
    scheduled: number;
    completed: number;
    cancelled: number;
}

type TrendPeriod = 'day' | 'week' | 'month' | 'year';

export const getBookingTrends = async (period: TrendPeriod = 'week'): Promise<BookingTrend[]> => {
    const response = await axiosInstance.get<BookingTrend[]>(`/admin/dashboard/booking-trends?period=${period}`);
    return response.data;
};

export const getBookingTrendsQueryKey = (period: TrendPeriod) => ['admin-booking-trends', period];

export const useGetBookingTrends = (period: TrendPeriod = 'week') => {
    return useQuery({
        queryKey: getBookingTrendsQueryKey(period),
        queryFn: () => getBookingTrends(period),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
