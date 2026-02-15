"use client";

import { useGetDiagnosticOrders } from "~/features/admin/api/getDiagnosticOrders";
import { DiagnosticOrderTable } from "~/features/admin/components/DiagnosticOrderTable";
import {
    ShoppingBag,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export default function AdminDiagnosticPage() {
    const { data: orders, isLoading } = useGetDiagnosticOrders();

    // Calculate quick stats
    const stats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'PENDING').length || 0,
        completed: orders?.filter(o => o.status === 'COMPLETED').length || 0,
        unpaid: orders?.filter(o => o.paymentStatus === 'UNPAID').length || 0,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                        Manajemen Pesanan Diagnostik
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Monitoring riwayat transaksi MCU, Laboratorium, dan Radiologi secara terpadu.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    label="Total Pesanan"
                    value={stats.total}
                    icon={TrendingUp}
                    color="blue"
                    isLoading={isLoading}
                />
                <StatsCard
                    label="Menunggu Verifikasi"
                    value={stats.pending}
                    icon={Clock}
                    color="amber"
                    isLoading={isLoading}
                />
                <StatsCard
                    label="Selesai / Terproses"
                    value={stats.completed}
                    icon={CheckCircle2}
                    color="emerald"
                    isLoading={isLoading}
                />
                <StatsCard
                    label="Belum Dibayar"
                    value={stats.unpaid}
                    icon={AlertCircle}
                    color="rose"
                    isLoading={isLoading}
                />
            </div>

            {/* Table Section */}
            <DiagnosticOrderTable orders={orders} isLoading={isLoading} />
        </div>
    );
}

interface StatsCardProps {
    label: string;
    value: number;
    icon: any;
    color: "blue" | "amber" | "emerald" | "rose";
    isLoading: boolean;
}

function StatsCard({ label, value, icon: Icon, color, isLoading }: StatsCardProps) {
    const colorMap = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
    };

    return (
        <Card className={`border shadow-sm ${colorMap[color].split(' ')[2]}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                        {isLoading ? (
                            <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg" />
                        ) : (
                            <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                        )}
                    </div>
                    <div className={`p-3 rounded-2xl ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
