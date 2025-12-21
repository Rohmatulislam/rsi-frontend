"use client";

import { useState } from "react";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    Zap,
    BadgeCheck,
    Clock,
    FileSearch,
    Activity,
    Shield
} from "lucide-react";

import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { RadioCatalog } from "../components/RadioCatalog";
import { CatalogPageSkeleton } from "~/components/shared/PageSkeletons";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";

export const RadiologiPage = () => {
    const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'radiologi' });

    if (isLoading) {
        return <CatalogPageSkeleton />;
    }

    const benefits = [
        {
            icon: Zap,
            title: "Teknologi Digital",
            description: "Hasil citra tajam dengan radiasi rendah",
        },
        {
            icon: Shield,
            title: "Aman & Nyaman",
            description: "Prosedur diawasi oleh tenaga medis profesional",
        },
        {
            icon: Activity,
            title: "Diagnosa Akurat",
            description: "Interpretasi hasil oleh Dokter Spesialis Radiologi",
        },
        {
            icon: Clock,
            title: "Pelayanan 24 Jam",
            description: "Siap melayani untuk kebutuhan darurat (IGD)",
        },
    ];

    const preparations = [
        "Pemeriksaan USG abdomen memerlukan puasa 6-8 jam",
        "Pemeriksaan dengan kontras memerlukan cek fungsi ginjal (Ureum/Kreatinin)",
        "Gunakan pakaian yang nyaman dan mudah dilepas",
        "Lepaskan benda logam (perhiasan, jam tangan) sebelum pemeriksaan",
        "Informasikan jika Anda kemungkinan hamil atau menggunakan alat pacu jantung",
    ];

    return (
        <div className="min-h-screen">
            <BreadcrumbContainer
                items={[
                    { label: "Layanan", href: "/layanan" },
                    { label: "Radiologi" }
                ]}
                className="bg-muted/30 border-b"
            />
            <ServiceHero
                badge="LAYANAN RADIOLOGI"
                title={service?.title || service?.name || "Radiologi"}
                highlightText={service?.subtitle || "Diagnostik Terpercaya"}
                subtitle={service?.description || "Layanan radiologi lengkap dengan peralatan canggih untuk hasil diagnostik yang cepat dan tepat"}
            />

            {/* Benefits Section */}
            <ServiceSection
                title="Keunggulan Radiologi Kami"
                subtitle="Fasilitas diagnostik modern untuk akurasi medis yang lebih baik"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color="cyan"
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Services Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 font-outfit">Katalog Pemeriksaan</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Gunakan pencarian untuk menemukan jenis pemeriksaan radiologi yang Anda butuhkan.
                        </p>
                    </div>

                    <RadioCatalog
                        selectedTests={selectedTestIds}
                        onSelect={setSelectedTestIds}
                    />
                </div>
            </section>

            {/* Preparation Section */}
            <ServiceSection
                title="Persiapan & Prosedur"
                subtitle="Hal-hal penting yang perlu Anda ketahui sebelum menjalani pemeriksaan radiologi"
            >
                <div className="max-w-3xl mx-auto bg-card border rounded-2xl p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-primary">
                                <FileSearch className="h-5 w-5" /> Instruksi Umum
                            </h4>
                            <ul className="space-y-4">
                                {preparations.slice(0, 3).map((prep, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span className="text-muted-foreground">{prep}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-primary">
                                <BadgeCheck className="h-5 w-5" /> Keamanan Pasien
                            </h4>
                            <ul className="space-y-4">
                                {preparations.slice(3).map((prep, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span className="text-muted-foreground">{prep}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Ingin Mengetahui Jadwal Dokter Radiologi?"
                subtitle="Hasil pemeriksaan Anda akan dibaca oleh dokter spesialis radiologi yang berpengalaman"
                primaryAction={{
                    label: "Lihat Jadwal Dokter",
                    href: "/dokter?spesialis=Radiologi",
                }}
                secondaryAction={{
                    label: "Hubungi Layanan Informasi",
                    href: "https://wa.me/6281234567890",
                }}
            />
        </div>
    );
};
