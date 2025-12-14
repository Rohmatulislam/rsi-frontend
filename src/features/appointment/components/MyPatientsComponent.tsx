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
    XCircle
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

export const MyPatientsComponent = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { data, isLoading, error, refetch } = useMyPatients(user?.id);
    const cancelMutation = useCancelAppointment();
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

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

    // Check if appointment can be cancelled
    const canCancel = (appointmentDate: string, status: string) => {
        const date = new Date(appointmentDate);
        const now = new Date();
        const isFuture = date > now;
        const isScheduled = status === 'scheduled' || status === 'CONFIRMED';
        return isFuture && isScheduled;
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            scheduled: { label: "Terjadwal", className: "bg-green-100 text-green-800" },
            CONFIRMED: { label: "Terjadwal", className: "bg-green-100 text-green-800" },
            completed: { label: "Selesai", className: "bg-blue-100 text-blue-800" },
            cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-800" },
            CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-800" },
        };
        const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
        return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Memuat data...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Silakan Login</h3>
                <p className="text-muted-foreground mb-4">
                    Anda perlu login terlebih dahulu untuk melihat daftar pasien yang telah Anda daftarkan.
                </p>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">Gagal memuat data pasien</p>
                <Button variant="outline" onClick={() => refetch()}>
                    Coba Lagi
                </Button>
            </div>
        );
    }

    if (!data || data.patients.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Belum Ada Data Pasien</h3>
                <p className="text-muted-foreground mb-4">
                    Anda belum mendaftarkan pasien apapun. Mulai dengan membuat janji temu baru.
                </p>
                <Button asChild>
                    <Link href="/dokters">Cari Dokter</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-2xl font-bold">{data.totalPatients}</p>
                                <p className="text-sm text-muted-foreground">Total Pasien</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">{data.totalAppointments}</p>
                                <p className="text-sm text-muted-foreground">Total Booking</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Patient List */}
            <div className="space-y-4">
                {data.patients.map((patient) => (
                    <Card key={patient.patientId} className="overflow-hidden">
                        <CardHeader
                            className="cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setExpandedPatient(
                                expandedPatient === patient.patientId ? null : patient.patientId
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{patient.patientName}</CardTitle>
                                        <p className="text-sm text-muted-foreground">No. RM: {patient.patientId}</p>
                                        <p className="text-sm text-muted-foreground">{patient.appointmentsCount} booking</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {expandedPatient === patient.patientId ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {/* Expanded Appointments */}
                        {expandedPatient === patient.patientId && (
                            <CardContent className="border-t bg-slate-50/50">
                                <div className="space-y-4 pt-4">
                                    {patient.appointments.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="bg-white rounded-lg p-4 border shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-semibold">{appointment.doctor.name}</p>
                                                    <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
                                                </div>
                                                {getStatusBadge(appointment.status)}
                                            </div>
                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {new Date(appointment.appointmentDate).toLocaleDateString('id-ID', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {new Date(appointment.appointmentDate).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })} WIB
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Cancel Button */}
                                            {canCancel(appointment.appointmentDate, appointment.status) && (
                                                <div className="mt-4 pt-3 border-t">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 border-red-200 hover:bg-red-50"
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
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Batalkan Booking?</DialogTitle>
                                                                <DialogDescription>
                                                                    Apakah Anda yakin ingin membatalkan janji temu dengan <strong>{appointment.doctor.name}</strong>?
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Batal</Button>
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
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
