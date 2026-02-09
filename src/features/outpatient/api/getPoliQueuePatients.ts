import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

interface QueuePatient {
    no_reg: string;
    nm_pasien: string;
    stts: string;
    jam_reg: string;
    is_waiting: boolean;
}

interface QueuePatientsResponse {
    patients: QueuePatient[];
}

export const useGetPoliQueuePatients = (id: string) => {
    return useQuery({
        queryKey: ['poli-queue-patients', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get<QueuePatientsResponse>(`/services/items/${id}/queue/patients`);
            return data;
        },
        // Refetch every 30 seconds for "Live" feel
        refetchInterval: 30000,
        retry: false,
    });
};
