import { queryOptions, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { QueryConfig } from "~/lib/react-query";

export type QueueStatusDto = {
    doctorCode: string;
    poliCode: string;
    date: string;
    currentNumber: number;
    totalQueue: number;
    totalWaiting: number;
    status: 'Aktif' | 'Selesai' | 'Error';
    lastUpdated: string;
    message?: string;
};

export const getQueueStatus = async ({
    doctorCode,
    poliCode,
    date
}: {
    doctorCode: string;
    poliCode: string;
    date: string;
}) => {
    const response = await axiosInstance.get<QueueStatusDto>(
        `/appointments/queue-status/${doctorCode}/${poliCode}/${date}`
    );
    return response.data;
};

export const getQueueStatusQueryKey = (doctorCode: string, poliCode: string, date: string) => [
    "queue-status",
    doctorCode,
    poliCode,
    date
];

export const getQueueStatusQueryOptions = (doctorCode: string, poliCode: string, date: string) => {
    return queryOptions({
        queryKey: getQueueStatusQueryKey(doctorCode, poliCode, date),
        queryFn: () => getQueueStatus({ doctorCode, poliCode, date }),
        // Refresh every 30 seconds for real-time-ish data
        refetchInterval: 30000,
    });
};

type UseGetQueueStatusParams = {
    doctorCode: string;
    poliCode: string;
    date: string;
    queryConfig?: QueryConfig<typeof getQueueStatus>;
};

export const useGetQueueStatus = ({
    doctorCode,
    poliCode,
    date,
    queryConfig
}: UseGetQueueStatusParams) => {
    return useQuery({
        ...getQueueStatusQueryOptions(doctorCode, poliCode, date),
        ...queryConfig,
        enabled: !!doctorCode && !!poliCode && !!date,
    });
};
