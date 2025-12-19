"use client";

import { useState } from "react";
import { useGetDashboardStats } from "~/features/admin/api/getDashboardStats";
import { useGetBookingTrends } from "~/features/admin/api/getBookingTrends";
import { useGetTopDoctors } from "~/features/admin/api/getTopDoctors";
import { useGetRecentBookings } from "~/features/admin/api/getRecentBookings";
import {
    CalendarCheck,
    CalendarDays,
    CheckCircle,
    XCircle,
    TrendingUp,
    Users,
    Clock,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageSrc } from "~/lib/utils";

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    color: "blue" | "orange" | "green" | "red" | "purple";
}

const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        orange: "bg-orange-100 text-orange-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        purple: "bg-purple-100 text-purple-600",
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("week");

    const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
    const { data: trends, isLoading: trendsLoading } = useGetBookingTrends(period);
    const { data: topDoctors, isLoading: doctorsLoading } = useGetTopDoctors(10);
    const { data: recentBookings, isLoading: bookingsLoading } = useGetRecentBookings(10);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (period === "day") {
            return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        } else if (period === "week") {
            return `Minggu ${date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
        } else {
            return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        }
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            scheduled: "default",
            completed: "secondary",
            cancelled: "destructive",
        };
        return variants[status] || "outline";
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            scheduled: "Terjadwal",
            completed: "Selesai",
            cancelled: "Dibatalkan",
        };
        return labels[status] || status;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard Analytics</h1>
                <p className="text-muted-foreground mt-1">Pantau performa dan statistik booking</p>
            </div>

            {/* Stats Cards */}
            {statsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Booking"
                        value={stats?.totalBookings || 0}
                        icon={CalendarDays}
                        color="blue"
                    />
                    <StatsCard
                        title="Terjadwal"
                        value={stats?.scheduledBookings || 0}
                        icon={CalendarCheck}
                        color="orange"
                    />
                    <StatsCard
                        title="Selesai"
                        value={stats?.completedBookings || 0}
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatsCard
                        title="Dibatalkan"
                        value={stats?.cancelledBookings || 0}
                        icon={XCircle}
                        color="red"
                    />
                </div>
            )}

            {/* Booking Trends Chart */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Trend Booking
                        </CardTitle>
                        <div className="flex gap-2">
                            {(["day", "week", "month", "year"] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${period === p
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {p === "day" ? "Hari" : p === "week" ? "Minggu" : p === "month" ? "Bulan" : "Tahun"}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {trendsLoading ? (
                        <Skeleton className="h-80 w-full" />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={formatDate} />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={formatDate}
                                    formatter={(value: number | undefined, name: string | undefined) => {
                                        const labels: Record<string, string> = {
                                            count: "Total",
                                            scheduled: "Terjadwal",
                                            completed: "Selesai",
                                            cancelled: "Dibatalkan",
                                        };
                                        return [value ?? 0, (labels[name ?? ""] || (name ?? ""))];
                                    }}
                                />
                                <Legend
                                    formatter={(value: string) => {
                                        const labels: Record<string, string> = {
                                            count: "Total",
                                            scheduled: "Terjadwal",
                                            completed: "Selesai",
                                            cancelled: "Dibatalkan",
                                        };
                                        return labels[value] || value;
                                    }}
                                />
                                <Line type="monotone" dataKey="count" stroke="var(--chart-4)" strokeWidth={2} name="count" />
                                <Line type="monotone" dataKey="completed" stroke="var(--chart-1)" strokeWidth={2} name="completed" />
                                <Line type="monotone" dataKey="cancelled" stroke="var(--chart-3)" strokeWidth={2} name="cancelled" />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Doctors Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Dokter Terpopuler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {doctorsLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topDoctors?.map((doctor, index) => (
                                    <div
                                        key={doctor.doctorId}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                            {index + 1}
                                        </div>
                                        {doctor.imageUrl && (
                                            <img
                                                src={getImageSrc(doctor.imageUrl)}
                                                alt={doctor.doctorName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{doctor.doctorName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{doctor.specialty}</p>
                                        </div>
                                        <Badge variant="secondary">{doctor.bookingCount} booking</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Booking Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bookingsLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentBookings?.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{booking.patientName}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {booking.doctorName} • {booking.specialty}
                                                </p>
                                            </div>
                                            <Badge variant={getStatusBadge(booking.status)} className="ml-2">
                                                {getStatusLabel(booking.status)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(booking.appointmentDate).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
