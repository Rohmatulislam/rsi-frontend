"use client";

import { useGetServiceItemById } from "~/features/services/api/getServiceItemById";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { useGetPoliQueue } from "~/features/outpatient/api/getPoliQueue";
import { ServiceHero, ServiceSection } from "~/features/services";
import { DoctorCard, DoctorCardSkeleton } from "~/components/shared/DoctorCard";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Stethoscope, Clock, MapPin, Phone, Users } from "lucide-react";
import Link from "next/link";
import { ServiceCTA } from "~/features/services/components/ServiceCTA";
import { ServicePageSkeleton } from "~/components/shared/ServicePageSkeleton";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";

interface PoliDetailPageProps {
    id: string;
}

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const PoliDetailPage = ({ id }: PoliDetailPageProps) => {
    const { data: item, isLoading: itemLoading, error } = useGetServiceItemById(id);
    // Fetch doctors filtered by this poli code (id)
    const { data: allDoctors, isLoading: doctorsLoading } = useGetDoctorsList({
        input: { limit: 1000, poliCode: id } as any,
    });

    if (itemLoading) {
        return <ServicePageSkeleton variant="detail" />;
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Stethoscope className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Poliklinik Tidak Ditemukan</h1>
                <p className="text-muted-foreground">Data poliklinik yang Anda cari tidak tersedia.</p>
                <Button asChild>
                    <Link href="/layanan/rawat-jalan">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Rawat Jalan
                    </Link>
                </Button>
            </div>
        );
    }

    // Check if this is executive based on service slug or item name
    const isExecutive = item.service?.slug === 'poli-executive' ||
        item.name.toLowerCase().includes('eksekutif') ||
        item.name.toLowerCase().includes('executive');

    // Extract base specialty from item name (remove "Eksekutif", "Ekskutif", etc.)
    const baseSpecialty = item.name
        .replace(/eksekutif|ekskutif|executive/gi, '')
        .replace(/umum\/pks/gi, '')
        .trim();

    // Filter doctors by matching specialization
    const filteredDoctors = allDoctors?.filter(doc => {
        const docSpec = doc.specialization?.toLowerCase() || '';
        const specToMatch = baseSpecialty.toLowerCase();

        // Direct match or partial match
        if (docSpec.includes(specToMatch) || specToMatch.includes(docSpec)) {
            // If executive, only show executive doctors
            if (isExecutive) {
                return doc.is_executive === true;
            }
            return true;
        }
        return false;
    }) || [];

    const operatingHours = [
        { day: "Senin - Jumat", hours: "08.00 - 20.00 WITA" },
        { day: "Sabtu", hours: "08.00 - 14.00 WITA" },
        { day: "Minggu & Libur", hours: "Tutup" },
    ];

    // Build breadcrumb items
    const breadcrumbItems = isExecutive
        ? [
            { label: "Layanan Unggulan", href: "/layanan-unggulan" },
            { label: "Poli Eksekutif", href: "/layanan-unggulan/executive" },
            { label: item.name }
        ]
        : [
            { label: "Layanan", href: "/layanan" },
            { label: "Rawat Jalan", href: "/layanan/rawat-jalan" },
            { label: item.name }
        ];

    return (
        <div className="min-h-screen">
            {/* Breadcrumb Navigation */}
            <BreadcrumbContainer items={breadcrumbItems} className="bg-muted/30 border-b" />

            <ServiceHero
                badge={isExecutive ? "POLI EKSEKUTIF" : "POLIKLINIK SPESIALIS"}
                title={item.name}
                highlightText={isExecutive ? "Layanan Premium" : "Layanan Dokter Spesialis"}
                subtitle={item.description || `Layanan konsultasi dan pemeriksaan ${item.name} dengan dokter spesialis berpengalaman.`}
            />

            {/* Info Section */}
            <section className="py-12 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card border rounded-2xl p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Jam Operasional</h4>
                                {operatingHours.map((h, idx) => (
                                    <p key={idx} className="text-sm text-muted-foreground">
                                        {h.day}: {h.hours}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Lokasi</h4>
                                <p className="text-sm text-muted-foreground">
                                    Gedung Rawat Jalan<br />
                                    RSI Siti Hajar Mataram
                                </p>
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 flex items-start gap-4 h-full">
                            <QueueInfoCard poliId={id} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section (if available) - Temporary default video added */}
            {(item.videoUrl || "https://www.youtube.com/watch?v=FlI7shjrsqA") && (
                <section className="py-8 bg-black/5 dark:bg-black/20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white dark:ring-slate-800">
                            <div className="relative aspect-video bg-black">
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeId(item.videoUrl || "https://www.youtube.com/watch?v=FlI7shjrsqA")}`}
                                    title={`Video ${item.name}`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Doctors Section */}
            <ServiceSection
                title={`Dokter ${baseSpecialty}`}
                subtitle={`Tim dokter spesialis yang siap melayani Anda`}
            >
                <div className="mb-8">
                    <Button variant="outline" asChild>
                        <Link href={isExecutive ? "/layanan-unggulan/executive" : "/layanan/rawat-jalan"}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke {isExecutive ? "Eksekutif" : "Rawat Jalan"}
                        </Link>
                    </Button>
                </div>

                {doctorsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <DoctorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                        <div className="p-4 rounded-full bg-muted inline-flex mb-4">
                            <Stethoscope className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada dokter terdaftar</h3>
                        <p className="text-muted-foreground mb-4">
                            Saat ini belum ada data dokter untuk {item.name}.
                        </p>
                        <Button asChild>
                            <Link href="/doctors">Lihat Semua Dokter</Link>
                        </Button>
                    </div>
                )}
            </ServiceSection>

            <ServiceCTA
                title={`Butuh Layanan ${baseSpecialty}?`}
                subtitle="Hubungi kami untuk informasi jadwal dan pendaftaran"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin daftar di ${item.name}`,
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};

const QueueInfoCard = ({ poliId }: { poliId: string }) => {
    const { data: queue, isLoading, error } = useGetPoliQueue(poliId);

    if (isLoading) return (
        <>
            <div className="h-12 w-12 rounded-xl bg-muted/50 animate-pulse" />
            <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted/50 animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted/50 animate-pulse rounded" />
            </div>
        </>
    );

    if (error || !queue) return (
        <>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
            </div>
            <div>
                <h4 className="font-bold mb-2">Antrian Langsung</h4>
                <p className="text-sm text-muted-foreground">
                    Data antrian belum tersedia
                </p>
            </div>
        </>
    );

    return (
        <>
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 relative">
                <Users className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            </div>
            <div className="flex-1">
                <h4 className="font-bold mb-1 flex items-center gap-2">
                    Antrian Saat Ini
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Live
                    </span>
                </h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">
                        {queue.current}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        / {queue.total} Pasien
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {queue.remaining} orang menunggu giliran
                </p>
            </div>
        </>
    );
}
