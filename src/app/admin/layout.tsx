"use client";

import { AdminSidebar } from "~/features/admin/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
