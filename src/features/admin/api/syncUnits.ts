import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";
import { getUnitsQueryKey } from "~/features/inpatient/api/getUnits";
import { SyncUnitsResponse } from "../types/unit";

export const syncUnits = async (): Promise<SyncUnitsResponse> => {
    const response = await axiosInstance.post<SyncUnitsResponse>("/inpatient/buildings/sync");
    return response.data;
};

export const useSyncUnits = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncUnits,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getUnitsQueryKey() });
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error("Gagal sinkronisasi unit dari SIMRS");
            console.error("Sync units error:", error);
        },
    });
};
