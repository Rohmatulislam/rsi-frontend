"use client";

import { useGetServiceItemById } from "~/features/services/api/getServiceItemById";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { ServiceHero, ServiceSection } from "~/features/services";
import { DoctorCard, DoctorCardSkeleton } from "~/components/shared/DoctorCard";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Stethoscope, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ServiceCTA } from "~/features/services/components/ServiceCTA";
import { ServicePageSkeleton } from "~/components/shared/ServicePageSkeleton";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";

interface PoliDetailPageProps {
    id: string;
}

export const PoliDetailPage = ({ id }: PoliDetailPageProps) => {
    const { data: item, isLoading: itemLoading, error } = useGetServiceItemById(id);
    const { data: allDoctors, isLoading: doctorsLoading } = useGetDoctorsList({
        input: { limit: 1000 } as any,
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
                        <div className="bg-card border rounded-2xl p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Informasi</h4>
                                <p className="text-sm text-muted-foreground">
                                    (0370) 671 358<br />
                                    Ext. Poliklinik
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
