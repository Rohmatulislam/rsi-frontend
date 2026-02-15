import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export interface UpdateMetadataPayload {
    treatmentId: string;
    type: string;
    description?: string;
    preparation?: string;
    estimatedTime?: string;
    isPopular?: boolean;
    imageUrl?: string;
}

const updateMetadata = async (payload: UpdateMetadataPayload) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";
    const response = await axios.post(`${baseUrl}/treatment-metadata`, payload);
    return response.data;
};

export const useUpdateDiagnosticMetadata = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMetadata,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["diagnostic-catalog"] });
            toast.success("Metadata berhasil diperbarui");
        },
        onError: (error: any) => {
            toast.error("Gagal memperbarui metadata", {
                description: error.response?.data?.message || error.message
            });
        }
    });
};
