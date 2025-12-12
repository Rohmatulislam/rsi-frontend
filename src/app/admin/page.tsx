"use client";

import { useAdminStats } from "~/features/admin/api/getAdminStats";
import { StatsCard } from "~/features/admin/components/StatsCard";
import { CalendarCheck, CalendarDays, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminStats();

    if (isLoading) {
        return <div>Loading...</div>; // Skeleton loader would be better
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back, Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Appointments"
                    value={stats?.totalAppointments || 0}
                    icon={CalendarDays}
                    color="blue"
                />
                <StatsCard
                    title="Scheduled"
                    value={stats?.scheduledAppointments || 0}
                    icon={CalendarCheck}
                    color="orange"
                />
                <StatsCard
                    title="Completed"
                    value={stats?.completedAppointments || 0}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="Cancelled"
                    value={stats?.cancelledAppointments || 0}
                    icon={XCircle}
                    color="red"
                />
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="font-bold text-lg mb-4">Recent Bookings</h2>
                <div className="text-center py-12 text-slate-500">
                    Chart or Table Placeholder
                </div>
            </div>
        </div>
    );
}
