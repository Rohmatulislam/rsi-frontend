import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '~/lib/axios';

export interface TopDoctor {
    doctorId: string;
    doctorName: string;
    specialty: string;
    bookingCount: number;
    imageUrl?: string;
}

export const getTopDoctors = async (limit: number = 10): Promise<TopDoctor[]> => {
    const response = await axiosInstance.get<TopDoctor[]>(`/admin/dashboard/top-doctors?limit=${limit}`);
    return response.data;
};

export const getTopDoctorsQueryKey = (limit: number) => ['admin-top-doctors', limit];

export const useGetTopDoctors = (limit: number = 10) => {
    return useQuery({
        queryKey: getTopDoctorsQueryKey(limit),
        queryFn: () => getTopDoctors(limit),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
