"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    Calendar,
    Clock,
    User,
    ChevronDown,
    ChevronUp,
    FileText,
    Loader2,
    Users,
    XCircle,
    CalendarClock,
    Stethoscope,
    Phone,
    Mail,
    MapPin,
    Activity,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    ArrowRight
} from "lucide-react";
import { useMyPatients, MyPatient } from "../api/getMyPatients";
import { useCancelAppointment } from "../api/cancelAppointment";
import { useAuth } from "~/features/auth/hook/useAuth";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "~/components/ui/dialog";
import Link from "next/link";
import { RescheduleModal } from "./RescheduleModal";

export const MyPatientsComponent = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { data, isLoading, error, refetch } = useMyPatients(user?.id);
    const cancelMutation = useCancelAppointment();
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [rescheduleData, setRescheduleData] = useState<{
        appointmentId: string;
        doctorName: string;
        currentDate: string;
    } | null>(null);

    const handleCancelBooking = async (appointmentId: string, doctorName: string) => {
        setCancellingId(appointmentId);
        try {
            await cancelMutation.mutateAsync(appointmentId);
            toast.success("Booking berhasil dibatalkan", {
                description: `Janji temu dengan ${doctorName} telah dibatalkan.`
            });
            refetch();
        } catch (error: any) {
            toast.error("Gagal membatalkan booking", {
                description: error?.message || "Silakan coba lagi nanti."
            });
        } finally {
            setCancellingId(null);
        }
    };

    const canCancel = (appointmentDate: string, status: string) => {
        const date = new Date(appointmentDate);
        const now = new Date();
        const isFuture = date > now;
        const isScheduled = status === 'scheduled' || status === 'CONFIRMED';
        return isFuture && isScheduled;
    };

    const getStatusConfig = (status: string) => {
        const statusMap: Record<string, { label: string; icon: any; bgClass: string; textClass: string; borderClass: string }> = {
            scheduled: {
                label: "Terjadwal",
                icon: CalendarDays,
                bgClass: "bg-emerald-50",
                textClass: "text-emerald-700",
                borderClass: "border-emerald-200"
            },
            CONFIRMED: {
                label: "Terjadwal",
                icon: CalendarDays,
                bgClass: "bg-emerald-50",
                textClass: "text-emerald-700",
                borderClass: "border-emerald-200"
            },
            completed: {
                label: "Selesai",
                icon: CheckCircle2,
                bgClass: "bg-blue-50",
                textClass: "text-blue-700",
                borderClass: "border-blue-200"
            },
            cancelled: {
                label: "Dibatalkan",
                icon: XCircle,
                bgClass: "bg-red-50",
                textClass: "text-red-700",
                borderClass: "border-red-200"
            },
            CANCELLED: {
                label: "Dibatalkan",
                icon: XCircle,
                bgClass: "bg-red-50",
                textClass: "text-red-700",
                borderClass: "border-red-200"
            },
        };
        return statusMap[status] || {
            label: status,
            icon: AlertCircle,
            bgClass: "bg-gray-50",
            textClass: "text-gray-700",
            borderClass: "border-gray-200"
        };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString('id-ID', { weekday: 'long' }),
            date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            relative: getRelativeTime(date)
        };
    };

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return "Sudah lewat";
        if (days === 0) return "Hari ini";
        if (days === 1) return "Besok";
        if (days <= 7) return `${days} hari lagi`;
        return `${Math.ceil(days / 7)} minggu lagi`;
    };

    // Loading State
    if (authLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 animate-pulse" />
                    <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-white" />
                </div>
                <p className="mt-4 text-lg font-medium text-slate-600">Memuat riwayat booking...</p>
                <p className="text-sm text-slate-400">Mohon tunggu sebentar</p>
            </div>
        );
    }

    // Not Authenticated
    if (!isAuthenticated) {
        return (
            <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <User className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Silakan Login</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Untuk melihat riwayat booking dan pasien yang telah Anda daftarkan, silakan login terlebih dahulu.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
                    <Link href="/login" className="gap-2">
                        Login Sekarang
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
                <p className="text-slate-500 mb-6">Terjadi kesalahan saat memuat riwayat booking Anda.</p>
                <Button variant="outline" onClick={() => refetch()} className="gap-2">
                    <Activity className="h-4 w-4" />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    // Empty State
    if (!data || data.patients.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Belum Ada Riwayat</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Anda belum memiliki riwayat booking. Mulai dengan mencari dokter dan membuat janji temu.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
                    <Link href="/dokters" className="gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Cari Dokter
                    </Link>
                </Button>
            </div>
        );
    }

    // Active upcoming appointments count
    const upcomingAppointments = data.patients.reduce((count, patient) => {
        return count + patient.appointments.filter(a =>
            new Date(a.appointmentDate) > new Date() &&
            (a.status === 'scheduled' || a.status === 'CONFIRMED')
        ).length;
    }, 0);

    return (
        <div className="space-y-8">
            {/* Dashboard Stats - Modern Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Patients */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 p-5 text-white shadow-lg shadow-cyan-500/25">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-16 w-16 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-cyan-100 text-sm font-medium">Total Pasien</p>
                                <p className="text-3xl font-bold mt-1">{data.totalPatients}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/20">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-cyan-100 text-xs mt-2">Pasien yang Anda daftarkan</p>
                    </div>
                </div>

                {/* Total Bookings */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-5 text-white shadow-lg shadow-teal-500/25">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-16 w-16 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-teal-100 text-sm font-medium">Total Booking</p>
                                <p className="text-3xl font-bold mt-1">{data.totalAppointments}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/20">
                                <Calendar className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-teal-100 text-xs mt-2">Semua janji temu</p>
                    </div>
                </div>

                {/* Upcoming */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-lg shadow-amber-500/25">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-16 w-16 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">Akan Datang</p>
                                <p className="text-3xl font-bold mt-1">{upcomingAppointments}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/20">
                                <CalendarClock className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-amber-100 text-xs mt-2">Jadwal yang belum berlangsung</p>
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Daftar Pasien</h2>
                    <p className="text-sm text-slate-500">Klik untuk melihat detail janji temu</p>
                </div>
            </div>

            {/* Patient List - Modern Design */}
            <div className="space-y-4">
                {data.patients.map((patient) => (
                    <div
                        key={patient.patientId}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {/* Patient Header */}
                        <div
                            className="p-5 cursor-pointer hover:bg-slate-50/80 transition-colors"
                            onClick={() => setExpandedPatient(
                                expandedPatient === patient.patientId ? null : patient.patientId
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/25">
                                        {patient.patientName.charAt(0).toUpperCase()}
                                    </div>
                                    {/* Info */}
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{patient.patientName}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                                                <FileText className="h-3.5 w-3.5" />
                                                No. RM: {patient.patientId}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium">
                                                {patient.appointmentsCount} booking
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Expand Icon */}
                                <div className={`p-2 rounded-full transition-all duration-200 ${expandedPatient === patient.patientId ? 'bg-cyan-100 rotate-180' : 'bg-slate-100'}`}>
                                    <ChevronDown className={`h-5 w-5 ${expandedPatient === patient.patientId ? 'text-cyan-600' : 'text-slate-400'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Expanded Appointments */}
                        {expandedPatient === patient.patientId && (
                            <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                                <div className="space-y-4">
                                    {patient.appointments.map((appointment) => {
                                        const statusConfig = getStatusConfig(appointment.status);
                                        const dateInfo = formatDate(appointment.appointmentDate);
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <div
                                                key={appointment.id}
                                                className={`rounded-xl bg-white border ${statusConfig.borderClass} p-4 shadow-sm`}
                                            >
                                                {/* Appointment Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                                            <Stethoscope className="h-6 w-6 text-slate-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-800">{appointment.doctor.name}</h4>
                                                            <p className="text-sm text-slate-500">{appointment.doctor.specialization || 'Dokter Umum'}</p>
                                                        </div>
                                                    </div>
                                                    {/* Status Badge */}
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bgClass} ${statusConfig.textClass} text-sm font-medium`}>
                                                        <StatusIcon className="h-4 w-4" />
                                                        {statusConfig.label}
                                                    </div>
                                                </div>

                                                {/* Date & Time Info */}
                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                                                        <Calendar className="h-5 w-5 text-cyan-600" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">Tanggal</p>
                                                            <p className="font-medium text-slate-800">{dateInfo.date}</p>
                                                            <p className="text-xs text-slate-400">{dateInfo.day}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                                                        <Clock className="h-5 w-5 text-teal-600" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">Waktu</p>
                                                            <p className="font-medium text-slate-800">{dateInfo.time} WIB</p>
                                                            <p className="text-xs text-amber-600 font-medium">{dateInfo.relative}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                {canCancel(appointment.appointmentDate, appointment.status) && (
                                                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                                                        {/* Reschedule Button */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-cyan-700 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300"
                                                            onClick={() => setRescheduleData({
                                                                appointmentId: appointment.id,
                                                                doctorName: appointment.doctor.name,
                                                                currentDate: `${dateInfo.day}, ${dateInfo.date} pukul ${dateInfo.time}`
                                                            })}
                                                        >
                                                            <CalendarClock className="h-4 w-4 mr-2" />
                                                            Ubah Jadwal
                                                        </Button>

                                                        {/* Cancel Button */}
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                                    disabled={cancellingId === appointment.id}
                                                                >
                                                                    {cancellingId === appointment.id ? (
                                                                        <>
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                            Membatalkan...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <XCircle className="h-4 w-4 mr-2" />
                                                                            Batalkan
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle className="flex items-center gap-2 text-red-600">
                                                                        <AlertCircle className="h-5 w-5" />
                                                                        Batalkan Booking?
                                                                    </DialogTitle>
                                                                    <DialogDescription className="pt-2">
                                                                        Apakah Anda yakin ingin membatalkan janji temu dengan <strong>{appointment.doctor.name}</strong> pada <strong>{dateInfo.date}</strong>?
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter className="gap-2 sm:gap-0">
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Kembali</Button>
                                                                    </DialogClose>
                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            onClick={() => handleCancelBooking(appointment.id, appointment.doctor.name)}
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            Ya, Batalkan
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Reschedule Modal */}
            {rescheduleData && (
                <RescheduleModal
                    isOpen={!!rescheduleData}
                    onClose={() => setRescheduleData(null)}
                    appointmentId={rescheduleData.appointmentId}
                    doctorName={rescheduleData.doctorName}
                    currentDate={rescheduleData.currentDate}
                    onSuccess={() => refetch()}
                />
            )}
        </div>
    );
};
