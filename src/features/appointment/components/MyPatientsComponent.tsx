"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Calendar,
    Clock,
    User,
    ChevronDown,
    FileText,
    Loader2,
    Users,
    XCircle,
    CalendarClock,
    Stethoscope,
    Activity,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    ArrowRight,
    History as HistoryIcon,
    MessageCircle,
    FlaskConical,
    Star
} from "lucide-react";
import { useMyPatients } from "../api/getMyPatients";
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
import { QRCodeSVG } from 'qrcode.react';
import { RescheduleModal } from "./RescheduleModal";
import { RatingFeedbackModal } from "./RatingFeedbackModal";

export const MyPatientsComponent = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { data, isLoading, error, refetch } = useMyPatients(user?.id);
    const cancelMutation = useCancelAppointment();
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [rescheduleData, setRescheduleData] = useState<{
        appointmentId: string;
        doctorName: string;
        currentDate: string;
    } | null>(null);
    const [feedbackData, setFeedbackData] = useState<{
        appointmentId: string;
        doctorName: string;
    } | null>(null);

    const handleShareWhatsApp = (appointment: any, patientName: string) => {
        const date = new Date(appointment.appointmentDate);
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const message = `*Konfirmasi Booking RSI Siti Hajar*\n\n` +
            `Halo, ini detail booking Rumah Sakit saya:\n\n` +
            `*Kode Booking:* ${appointment.bookingCode || '-'}\n` +
            `*Pasien:* ${patientName}\n` +
            `*Dokter:* ${appointment.doctor.name}\n` +
            `*Poliklinik:* ${appointment.poliName || appointment.doctor.specialization || '-'}\n` +
            `*Jadwal:* ${dateStr} | ${timeStr} WIB\n\n` +
            `_Tunjukkan pesan ini di loket pendaftaran. Terimakasih._`;

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

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
                bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
                textClass: "text-emerald-700 dark:text-emerald-300",
                borderClass: "border-emerald-300 dark:border-emerald-700"
            },
            CONFIRMED: {
                label: "Terjadwal",
                icon: CalendarDays,
                bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
                textClass: "text-emerald-700 dark:text-emerald-300",
                borderClass: "border-emerald-300 dark:border-emerald-700"
            },
            completed: {
                label: "Selesai",
                icon: CheckCircle2,
                bgClass: "bg-blue-100 dark:bg-blue-900/30",
                textClass: "text-blue-700 dark:text-blue-300",
                borderClass: "border-blue-300 dark:border-blue-700"
            },
            in_progress: {
                label: "Sedang Dilayani",
                icon: Activity,
                bgClass: "bg-amber-100 dark:bg-amber-900/30",
                textClass: "text-amber-700 dark:text-amber-300",
                borderClass: "border-amber-300 dark:border-amber-700"
            },
            cancelled: {
                label: "Dibatalkan",
                icon: XCircle,
                bgClass: "bg-red-100 dark:bg-red-900/30",
                textClass: "text-red-700 dark:text-red-300",
                borderClass: "border-red-300 dark:border-red-700"
            },
            CANCELLED: {
                label: "Dibatalkan",
                icon: XCircle,
                bgClass: "bg-red-100 dark:bg-red-900/30",
                textClass: "text-red-700 dark:text-red-300",
                borderClass: "border-red-300 dark:border-red-700"
            },
        };
        return statusMap[status] || {
            label: status,
            icon: AlertCircle,
            bgClass: "bg-muted",
            textClass: "text-muted-foreground",
            borderClass: "border-border"
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
                    <div className="w-16 h-16 rounded-full bg-primary animate-pulse" />
                    <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary-foreground" />
                </div>
                <p className="mt-4 text-lg font-medium text-foreground">Memuat riwayat booking...</p>
                <p className="text-sm text-muted-foreground">Mohon tunggu sebentar</p>
            </div>
        );
    }

    // Not Authenticated
    if (!isAuthenticated) {
        return (
            <div className="text-center py-16 px-4 bg-card rounded-2xl border border-border shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Silakan Login</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Untuk melihat riwayat booking dan pasien yang telah Anda daftarkan, silakan login terlebih dahulu.
                </p>
                <Button asChild size="lg">
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
            <div className="text-center py-16 px-4 bg-card rounded-2xl border border-border shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Gagal Memuat Data</h3>
                <p className="text-muted-foreground mb-6">Terjadi kesalahan saat memuat riwayat booking Anda.</p>
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
            <div className="text-center py-16 px-4 bg-card rounded-2xl border border-border shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Belum Ada Riwayat</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Anda belum memiliki riwayat booking. Mulai dengan mencari dokter dan membuat janji temu.
                </p>
                <Button asChild size="lg">
                    <Link href="/doctors" className="gap-2">
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
        <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* ... existing stats ... */}
                <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Total Pasien</p>
                            <p className="text-3xl font-bold text-foreground mt-1">{data.totalPatients}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Total Booking</p>
                            <p className="text-3xl font-bold text-foreground mt-1">{data.totalAppointments}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Akan Datang</p>
                            <p className="text-3xl font-bold text-foreground mt-1">{upcomingAppointments}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-accent/20">
                            <CalendarClock className="h-6 w-6 text-accent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-muted rounded-2xl border border-border">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'upcoming'
                        ? 'bg-background text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <CalendarClock className="h-4 w-4" />
                    Akan Datang ({upcomingAppointments})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'past'
                        ? 'bg-background text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <HistoryIcon className="h-4 w-4" />
                    Riwayat Selesai
                </button>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        {activeTab === 'upcoming' ? 'Janji Temu Aktif' : 'Riwayat Pemeriksaan'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {activeTab === 'upcoming'
                            ? 'Daftar janji temu yang akan berlangsung'
                            : 'Daftar rekam medis dan janji temu yang sudah berlalu'}
                    </p>
                </div>
            </div>

            {/* Patient List */}
            <div className="space-y-4">
                {data.patients.map((patient) => {
                    // Filter appointments based on active tab
                    const filteredAppointments = patient.appointments.filter(a => {
                        const isUpcoming = new Date(a.appointmentDate) > new Date() && (a.status === 'scheduled' || a.status === 'CONFIRMED');
                        return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
                    });

                    if (filteredAppointments.length === 0) return null;

                    return (
                        <div
                            key={patient.patientId}
                            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
                        >
                            {/* Patient Header */}
                            <div
                                className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setExpandedPatient(
                                    expandedPatient === patient.patientId ? null : patient.patientId
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            {patient.patientName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">{patient.patientName}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    No. RM: {patient.patientId}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    {filteredAppointments.length} janji temu
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full transition-all duration-200 ${expandedPatient === patient.patientId ? 'bg-primary/10 rotate-180' : 'bg-muted'}`}>
                                        <ChevronDown className={`h-5 w-5 ${expandedPatient === patient.patientId ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Appointments */}
                            {expandedPatient === patient.patientId && (
                                <div className="border-t border-border bg-muted/30 p-5">
                                    <div className="space-y-4">
                                        {[...filteredAppointments].sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()).map((appointment) => {
                                            const statusConfig = getStatusConfig(appointment.status);
                                            const dateInfo = formatDate(appointment.appointmentDate);
                                            const StatusIcon = statusConfig.icon;
                                            const isUpcoming = new Date(appointment.appointmentDate) > new Date();

                                            return (
                                                <div
                                                    key={appointment.id}
                                                    className={`relative group rounded-xl bg-card border-2 ${statusConfig.borderClass} p-4 shadow-sm transition-all hover:shadow-md`}
                                                >
                                                    {/* Next Up Badge */}
                                                    {isUpcoming && activeTab === 'upcoming' && (
                                                        <div className="absolute -top-3 -right-2 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg transform rotate-2">
                                                            SEGERA
                                                        </div>
                                                    )}

                                                    {/* Appointment Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                                                <Stethoscope className="h-6 w-6 text-foreground" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-foreground">{appointment.doctor.name}</h4>
                                                                <p className="text-sm text-muted-foreground">{appointment.doctor.specialization || 'Dokter Umum'}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bgClass} ${statusConfig.textClass} text-sm font-semibold`}>
                                                            <StatusIcon className="h-4 w-4" />
                                                            {statusConfig.label}
                                                        </div>
                                                    </div>

                                                    {/* Booking Code Display */}
                                                    <div className="flex items-center justify-between p-2.5 mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Kode Booking</span>
                                                        <span className="text-sm font-bold font-mono text-primary flex items-center gap-2">
                                                            {appointment.bookingCode || 'REG-XXXX'}
                                                        </span>
                                                    </div>

                                                    {/* Doctor Warning UI ... */}
                                                    {(appointment.doctor.isOnLeave || appointment.doctor.isStudying) && (
                                                        <div className="mb-4 p-4 rounded-xl bg-orange-50 border-2 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/30 flex items-start gap-3 shadow-sm">
                                                            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-bold text-orange-800 dark:text-orange-300 text-sm">Dokter Berhalangan</p>
                                                                <p className="text-[12px] text-orange-700 dark:text-orange-400 mt-1">Harap hubungi CS untuk penyesuaian jadwal.</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Date & Waktu ... */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                                                            <Calendar className="h-4 w-4 text-primary" />
                                                            <div>
                                                                <p className="text-[10px] text-muted-foreground font-medium uppercase">Tanggal</p>
                                                                <p className="text-xs font-bold">{dateInfo.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                                                            <Clock className="h-4 w-4 text-emerald-600" />
                                                            <div>
                                                                <p className="text-[10px] text-muted-foreground font-medium uppercase">Jam</p>
                                                                <p className="text-xs font-bold">{dateInfo.time} WIB ({dateInfo.relative})</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                                                        {activeTab === 'upcoming' && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 h-9 px-3"
                                                                    onClick={() => handleShareWhatsApp(appointment, patient.patientName)}
                                                                >
                                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                                    WA
                                                                </Button>
                                                                {canCancel(appointment.appointmentDate, appointment.status) && (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-9 px-3"
                                                                            onClick={() => setRescheduleData({
                                                                                appointmentId: appointment.id,
                                                                                doctorName: appointment.doctor.name,
                                                                                currentDate: `${dateInfo.day}, ${dateInfo.date} pukul ${dateInfo.time}`
                                                                            })}
                                                                        >
                                                                            Ubah
                                                                        </Button>
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button variant="outline" size="sm" className="h-9 px-3 text-destructive border-destructive/30">
                                                                                    Batal
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="sm:max-w-md">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Batalkan Booking?</DialogTitle>
                                                                                    <DialogDescription>Yakin ingin membatalkan?</DialogDescription>
                                                                                </DialogHeader>
                                                                                <DialogFooter>
                                                                                    <DialogClose asChild><Button variant="outline">Tidak</Button></DialogClose>
                                                                                    <DialogClose asChild><Button variant="destructive" onClick={() => handleCancelBooking(appointment.id, appointment.doctor.name)}>Ya, Batalkan</Button></DialogClose>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                        {activeTab === 'past' && (
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" className="h-9 px-3" asChild>
                                                                    <Link href={`/doctors/${appointment.doctor.id || ''}`}>
                                                                        Booking Ulang
                                                                    </Link>
                                                                </Button>
                                                                {appointment.status === 'completed' && (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-9 px-3 border-primary text-primary hover:bg-primary/5"
                                                                            asChild
                                                                        >
                                                                            <Link href="/profile?tab=health-history&sub=lab">
                                                                                <FlaskConical className="h-4 w-4 mr-2" />
                                                                                Lihat Hasil Lab
                                                                            </Link>
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-9 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                                            onClick={() => setFeedbackData({
                                                                                appointmentId: appointment.id,
                                                                                doctorName: appointment.doctor.name
                                                                            })}
                                                                        >
                                                                            <Star className="h-4 w-4 mr-1.5" />
                                                                            Beri Feedback
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
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

            {/* Feedback Modal */}
            {feedbackData && (
                <RatingFeedbackModal
                    isOpen={!!feedbackData}
                    onClose={() => setFeedbackData(null)}
                    appointmentId={feedbackData.appointmentId}
                    doctorName={feedbackData.doctorName}
                    onSuccess={() => {
                        // Optional: refetch to update UI if rating is tracked
                        refetch();
                    }}
                />
            )}
        </div>
    );
};
