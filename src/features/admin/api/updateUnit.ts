import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";
import { getUnitsQueryKey } from "~/features/inpatient/api/getUnits";
import { UpdateUnitDto } from "../types/unit";

export const updateUnit = async (id: string, data: UpdateUnitDto) => {
    const response = await axiosInstance.patch(`/inpatient/buildings/${id}`, data);
    return response.data;
};

export const useUpdateUnit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUnitDto }) => updateUnit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getUnitsQueryKey() });
            toast.success("Unit berhasil diperbarui");
        },
        onError: (error) => {
            toast.error("Gagal memperbarui unit");
            console.error("Update unit error:", error);
        },
    });
};
