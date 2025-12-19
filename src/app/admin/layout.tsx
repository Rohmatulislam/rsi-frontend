"use client";

import { AdminSidebar } from "~/features/admin/components/AdminSidebar";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR", "NURSE", "STAFF"]}>
            <div className="flex bg-background min-h-screen">
                <AdminSidebar />
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
