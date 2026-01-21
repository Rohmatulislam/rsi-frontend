import { useQuery, queryOptions } from '@tanstack/react-query';
import { axiosInstance } from '~/lib/axios';

export interface ServiceItem {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    price: number | null;
    features: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    isActive: boolean;
    order: number;
    serviceId: string;
    service: {
        id: string;
        name: string;
        slug: string;
        title: string | null;
        subtitle: string | null;
    };
}

export const getServiceItemByIdQueryOptions = (id: string) =>
    queryOptions({
        queryKey: ['service-item', id],
        queryFn: async (): Promise<ServiceItem> => {
            const response = await axiosInstance.get<ServiceItem>(`/services/items/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

export const useGetServiceItemById = (id: string) => {
    return useQuery(getServiceItemByIdQueryOptions(id));
};
