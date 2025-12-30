import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
    image: string | null;
    profile?: {
        phone?: string;
        address?: string;
        nik?: string;
    };
}

export const adminUserKeys = {
    all: ["admin-users"] as const,
    lists: () => [...adminUserKeys.all, "list"] as const,
};

// GET all users
export const getAdminUsers = async (): Promise<AdminUser[]> => {
    const { data } = await axiosInstance.get("/admin/users");
    return data;
};

export const useGetAdminUsers = () => {
    return useQuery({
        queryKey: adminUserKeys.lists(),
        queryFn: getAdminUsers,
    });
};

// PATCH update user role
export const updateAdminUserRole = async ({ id, role }: { id: string; role: string }): Promise<AdminUser> => {
    const { data } = await axiosInstance.patch(`/admin/users/${id}/role`, { role });
    return data;
};

export const useUpdateAdminUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminUserRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
            toast.success("Role user berhasil diperbarui");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal memperbarui role user");
        },
    });
};

// DELETE user
export const deleteAdminUser = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/users/${id}`);
};

export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
            toast.success("User berhasil dihapus");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal menghapus user");
        },
    });
};
