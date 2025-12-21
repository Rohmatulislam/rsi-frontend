"use client";

import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY } from "../constants/localStorage";

// User roles matching Prisma enum
export type UserRole = "ADMIN" | "DOCTOR" | "NURSE" | "STAFF" | "PATIENT";

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
    ADMIN: 100,
    DOCTOR: 80,
    NURSE: 60,
    STAFF: 40,
    PATIENT: 20,
};

/**
 * Custom hook untuk akses authentication state dengan mudah
 * Wrapper dari Better-Auth useSession dengan tambahan utility functions dan RBAC
 */
export const useAuth = () => {
    const router = useRouter();
    const { data: session, isPending, error } = authClient.useSession();

    const isAuthenticated = !!session?.user;
    const user = session?.user ?? null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (((user as any)?.role as string)?.toUpperCase() as UserRole) ?? "PATIENT";

    // Role check helpers
    const isAdmin = userRole === "ADMIN";
    const isDoctor = userRole === "DOCTOR";
    const isNurse = userRole === "NURSE";
    const isStaff = userRole === "STAFF";
    const isPatient = userRole === "PATIENT";

    /**
     * Check if user has one of the allowed roles
     */
    const hasRole = useCallback(
        (allowedRoles: UserRole[]): boolean => {
            if (!isAuthenticated) return false;
            return allowedRoles.includes(userRole);
        },
        [isAuthenticated, userRole]
    );

    /**
     * Check if user has at least the minimum role level
     */
    const hasMinRole = useCallback(
        (minRole: UserRole): boolean => {
            if (!isAuthenticated) return false;
            return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
        },
        [isAuthenticated, userRole]
    );

    /**
     * Check if user can access admin features
     */
    const canAccessAdmin = isAdmin || isDoctor || isNurse || isStaff;

    const logout = useCallback(async () => {
        try {
            await authClient.signOut();
            localStorage.removeItem(LOCAL_STORAGE_BETTER_AUTH_TOKEN_KEY);
            toast.success("Berhasil logout");
            router.push("/login");
        } catch (error) {
            toast.error("Gagal logout");
            console.error("Logout error:", error);
        }
    }, [router]);

    const redirectToLogin = useCallback(
        (returnUrl?: string) => {
            const url = returnUrl
                ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
                : "/login";
            router.push(url);
        },
        [router]
    );

    return {
        user,
        session,
        isAuthenticated,
        isLoading: isPending,
        error,
        // Role info
        role: userRole,
        isAdmin,
        isDoctor,
        isNurse,
        isStaff,
        isPatient,
        canAccessAdmin,
        // Role utilities
        hasRole,
        hasMinRole,
        // Actions
        logout,
        redirectToLogin,
    };
};
