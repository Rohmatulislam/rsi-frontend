"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, UserRole } from "../hook/useAuth";
import { Loader2, ShieldX } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    fallbackUrl?: string;
}

/**
 * Component untuk melindungi halaman yang memerlukan authentication
 * Redirect ke login jika user belum authenticated
 * Tampilkan access denied jika user tidak memiliki role yang sesuai
 */
export const ProtectedRoute = ({
    children,
    allowedRoles,
    fallbackUrl = "/login",
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, hasRole, role } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirect ke login dengan return URL
            const returnUrl = encodeURIComponent(pathname);
            router.push(`${fallbackUrl}?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, isLoading, router, pathname, fallbackUrl]);

    // Tampilkan loading saat mengecek authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    <p className="text-slate-600">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    // Jika tidak authenticated, jangan render children (akan redirect)
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    <p className="text-slate-600">Mengalihkan ke halaman login...</p>
                </div>
            </div>
        );
    }

    // Check role-based access if allowedRoles is specified
    if (allowedRoles && !hasRole(allowedRoles)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg max-w-md text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <ShieldX className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Akses Ditolak</h1>
                    <p className="text-slate-600">
                        Anda tidak memiliki izin untuk mengakses halaman ini.
                        Role Anda saat ini: <span className="font-semibold">{role}</span>
                    </p>
                    <p className="text-sm text-slate-500">
                        Role yang diizinkan: {allowedRoles.join(", ")}
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
