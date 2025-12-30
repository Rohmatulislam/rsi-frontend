import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    details: string;
    ipAddress: string | null;
    createdAt: string;
}

export const adminAuditKeys = {
    all: ["admin-audit"] as const,
    lists: () => [...adminAuditKeys.all, "list"] as const,
};

export const getAdminAuditLogs = async (limit: number = 100): Promise<AuditLog[]> => {
    const { data } = await axiosInstance.get(`/admin/logs?limit=${limit}`);
    return data;
};

export const useGetAdminAuditLogs = (limit: number = 100) => {
    return useQuery({
        queryKey: [...adminAuditKeys.lists(), limit],
        queryFn: () => getAdminAuditLogs(limit),
    });
};
