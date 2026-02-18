import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";

export interface TreatmentMetadata {
    id: string;
    treatmentId: string;
    type: string;
    description: string | null;
    preparation: string | null;
    estimatedTime: string | null;
    isPopular: boolean;
    updatedAt: string;
}

export const useAiSettings = () => {
    return useQuery({
        queryKey: ["ai", "settings"],
        queryFn: async () => {
            const res = await axiosInstance.get("/ai-admin/settings");
            return res.data;
        }
    });
};

export const useUpdateAiPrompt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (value: string) => {
            const res = await axiosInstance.patch("/ai-admin/prompt", { value });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai", "settings"] });
            toast.success("AI Prompt updated successfully");
        },
        onError: () => toast.error("Failed to update AI Prompt")
    });
};

export const useUploadMcuCsv = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axiosInstance.post("/ai-admin/upload-mcu", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai", "settings"] });
            toast.success("MCU Data updated successfully");
        },
        onError: () => toast.error("Failed to upload MCU Data")
    });
};

export const useGetAiTreatments = () => {
    return useQuery({
        queryKey: ["ai", "treatments"],
        queryFn: async () => {
            const res = await axiosInstance.get("/ai-admin/treatments");
            return res.data as TreatmentMetadata[];
        }
    });
};

export const useCreateAiTreatment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await axiosInstance.post("/ai-admin/treatments", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai", "treatments"] });
            toast.success("New treatment knowledge added");
        },
        onError: () => toast.error("Failed to add treatment knowledge")
    });
};

export const useUpdateAiTreatment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const res = await axiosInstance.patch(`/ai-admin/treatments/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai", "treatments"] });
            toast.success("Treatment info updated");
        }
    });
};

export const useDeleteAiTreatment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await axiosInstance.delete(`/ai-admin/treatments/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai", "treatments"] });
            toast.success("Treatment knowledge removed");
        },
        onError: () => toast.error("Failed to delete treatment")
    });
};

export const useSearchAiServices = (query: string) => {
    return useQuery({
        queryKey: ["ai", "search-services", query],
        queryFn: async () => {
            const res = await axiosInstance.get(`/ai-admin/search-services?q=${query}`);
            return res.data as { id: string, name: string, type: string }[];
        },
        enabled: query.length >= 2,
    });
};

export const useGetAiLogs = () => {
    return useQuery({
        queryKey: ["ai", "logs"],
        queryFn: async () => {
            const res = await axiosInstance.get("/ai-admin/logs");
            return res.data;
        }
    });
};

export const useGetAiSession = (sessionId: string | null) => {
    return useQuery({
        queryKey: ["ai", "session", sessionId],
        queryFn: async () => {
            if (!sessionId) return null;
            const res = await axiosInstance.get(`/ai-admin/session/${sessionId}`);
            return res.data;
        },
        enabled: !!sessionId
    });
};

export const useTestAiPrompt = () => {
    return useMutation({
        mutationFn: async ({ prompt, message }: { prompt: string, message: string }) => {
            const res = await axiosInstance.post("/ai-admin/test", { prompt, message });
            return res.data.response;
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Test failed";
            toast.error(msg);
        }
    });
};

export const useAiAnalytics = () => {
    return useQuery({
        queryKey: ['ai-analytics'],
        queryFn: async () => {
            const res = await axiosInstance.get('/ai-admin/analytics');
            return res.data;
        }
    });
};
