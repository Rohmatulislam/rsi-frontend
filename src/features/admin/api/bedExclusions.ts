import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";

export interface ExcludedBedDto {
    id: string; // kd_kamar
    reason?: string;
    createdAt: string;
}

export const getExcludedBeds = async (): Promise<ExcludedBedDto[]> => {
    const response = await axiosInstance.get<ExcludedBedDto[]>("/inpatient/beds/exclude");
    return response.data;
};

export const useExcludedBeds = () => {
    return useQuery({
        queryKey: ["excluded-beds"],
        queryFn: getExcludedBeds,
    });
};

export const useExcludeBed = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { id: string; reason?: string }) =>
            axiosInstance.post("/inpatient/beds/exclude", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["excluded-beds"] });
            queryClient.invalidateQueries({ queryKey: ["inpatient-rooms"] });
            queryClient.invalidateQueries({ queryKey: ["bed-availability"] });
            toast.success("Bed berhasil disembunyikan dari publik");
        },
        onError: () => {
            toast.error("Gagal menyembunyikan bed");
        }
    });
};

export const useUnexcludeBed = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            axiosInstance.delete(`/inpatient/beds/exclude/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["excluded-beds"] });
            queryClient.invalidateQueries({ queryKey: ["inpatient-rooms"] });
            queryClient.invalidateQueries({ queryKey: ["bed-availability"] });
            toast.success("Bed kembali ditampilkan ke publik");
        },
        onError: () => {
            toast.error("Gagal menampilkan kembali bed");
        }
    });
};
