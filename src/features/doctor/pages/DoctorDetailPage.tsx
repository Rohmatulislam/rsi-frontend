"use client";

import { useGetDoctorBySlug } from "../api/getDoctorBySlug";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock, Stethoscope, GraduationCap, Award, CalendarDays, ArrowLeft } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { DoctorScheduleByPoli } from "~/components/shared/DoctorScheduleByPoli";
import { Breadcrumb } from "~/components/shared/Breadcrumb";
import { DoctorDetailSkeleton } from "~/components/shared/PageSkeletons";
import { QueueStatusCard } from "~/features/appointment/components/QueueStatusCard";

const DoctorDetailPage = () => {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: doctor, isLoading, error } = useGetDoctorBySlug({ slug });

    if (isLoading) {
        return <DoctorDetailSkeleton />;
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Dokter tidak ditemukan</h2>
                <Button asChild variant="outline">
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/30 pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">

                {/* Breadcrumb Navigation */}
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Dokter", href: "/doctors" },
                            { label: doctor.name }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Main Content Area (Left - 2cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Profile Section */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* Image */}
                            <div className="w-full md:w-1/3 shrink-0">
                                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    {doctor.imageUrl ? (
                                        <Image
                                            src={doctor.imageUrl}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover"
                                            priority
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                                            <Stethoscope className="h-20 w-20 opacity-30" />
                                        </div>
                                    )}

                                    {/* Floating Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {doctor.is_executive && (
                                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg backdrop-blur-md">
                                                <span className="mr-1">👑</span> Executive
                                            </Badge>
                                        )}
                                        {doctor.bpjs && (
                                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-none shadow-lg backdrop-blur-md">
                                                BPJS
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="w-full md:w-2/3 space-y-4">
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {doctor.categories?.map((cat: any, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                                                {cat.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                        {doctor.name}
                                    </h1>
                                    <p className="text-lg font-medium text-primary mt-1 flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5" />
                                        {doctor.specialization || "Dokter Umum"}
                                    </p>
                                </div>

                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {(() => {
                                            const bioData = doctor.description || doctor.bio;
                                            if (!bioData) return "Dokter spesialis yang berdedikasi tinggi dengan pengalaman luas dalam menangani berbagai kasus medis. Beliau dikenal ramah dan komunikatif dalam melayani pasien.";

                                            try {
                                                // Handle potential stringified JSON array from legacy data
                                                if (typeof bioData === 'string' && bioData.startsWith('[')) {
                                                    const parsed = JSON.parse(bioData);
                                                    if (Array.isArray(parsed)) return parsed.join(' ');
                                                }
                                            } catch (e) {
                                                // Fallback to raw string if parsing fails
                                            }

                                            return bioData;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Schedules Section Based on Polyclinic */}
                        <DoctorScheduleByPoli doctor={doctor} />
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Queue Status Integration */}
                            {doctor.kd_dokter && doctor.scheduleDetails && doctor.scheduleDetails.length > 0 && (
                                <QueueStatusCard
                                    doctorCode={doctor.kd_dokter}
                                    poliCode={doctor.scheduleDetails[0].kd_poli}
                                    poliName={doctor.scheduleDetails[0].nm_poli}
                                    className="mb-6"
                                />
                            )}

                            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Ringkasan Layanan</h3>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-bold">Lokasi</p>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {doctor.department || `Poli ${doctor.specialization || 'Umum'}`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">RSI Sitihajar Mataram</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-bold">Biaya Konsultasi</p>
                                                    <div className="text-xl font-black text-primary mt-1">
                                                        {(() => {
                                                            const fees = doctor.scheduleDetails
                                                                ? Array.from(new Set(doctor.scheduleDetails.map((s: any) => s.consultation_fee).filter((f: any) => f !== undefined && f > 0)))
                                                                : [];

                                                            if (fees.length === 0) {
                                                                return doctor.consultation_fee ? formatCurrency(doctor.consultation_fee) : "Hubungi Kami";
                                                            }

                                                            if (fees.length === 1) {
                                                                return formatCurrency(fees[0] as number);
                                                            }

                                                            const minFee = Math.min(...(fees as number[]));
                                                            const maxFee = Math.max(...(fees as number[]));

                                                            if (minFee === maxFee) {
                                                                return formatCurrency(minFee);
                                                            }

                                                            return `Mulai ${formatCurrency(minFee)}`;
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {doctor.isStudying || (doctor as any).isOnLeave ? (
                                            <Button
                                                className="w-full rounded-xl py-6 font-bold text-lg opacity-50 cursor-not-allowed"
                                                size="lg"
                                                disabled
                                            >
                                                {doctor.isStudying ? "Sedang Pendidikan" : "Sedang Cuti"}
                                            </Button>
                                        ) : (
                                            <AppointmentBookingModal
                                                doctor={doctor}
                                                trigger={
                                                    <Button className="w-full rounded-xl py-6 font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" size="lg">
                                                        Buat Janji Temu
                                                    </Button>
                                                }
                                            />
                                        )}
                                        <p className="text-xs text-center text-muted-foreground mt-3">
                                            Dijamin aman & terpercaya
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Help Card */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex items-center gap-4 border border-blue-100 dark:border-blue-800">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center shrink-0">
                                    <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Butuh Bantuan?</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">Hubungi CS kami di 1500- RSI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorDetailPage;
