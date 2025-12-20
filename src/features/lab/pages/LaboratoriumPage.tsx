"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    Droplets,
    TestTube,
    Microscope,
    Syringe,
    Clock,
    ShieldCheck,
    Zap,
    FileCheck
} from "lucide-react";

import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { LabCatalog } from "../components/LabCatalog";
import { CatalogPageSkeleton } from "~/components/shared/PageSkeletons";

export const LaboratoriumPage = () => {
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'laboratorium' });

    if (isLoading) {
        return <CatalogPageSkeleton />;
    }

    const benefits = [
        {
            icon: Zap,
            title: "Hasil Cepat",
            description: "Sebagian besar hasil tersedia dalam 1-2 jam",
        },
        {
            icon: ShieldCheck,
            title: "Akurat & Terpercaya",
            description: "Menggunakan peralatan modern dengan kalibrasi rutin",
        },
        {
            icon: Clock,
            title: "Jam Operasional Luas",
            description: "Buka setiap hari dengan jam pelayanan yang fleksibel",
        },
        {
            icon: FileCheck,
            title: "Hasil Digital",
            description: "Hasil dapat diakses secara online dan dicetak",
        },
    ];

    const preparations = [
        "Puasa 10-12 jam untuk pemeriksaan gula darah puasa dan profil lipid",
        "Hindari konsumsi vitamin C berlebihan 24 jam sebelum tes",
        "Informasikan obat-obatan yang sedang dikonsumsi",
        "Bawa surat pengantar dokter jika ada",
        "Datang pagi hari untuk hasil yang optimal",
    ];

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN LABORATORIUM"
                title={service?.title || service?.name || "Laboratorium"}
                highlightText={service?.subtitle || "Hasil Cepat & Akurat"}
                subtitle={service?.description || "Pemeriksaan laboratorium lengkap dengan teknologi modern dan hasil yang akurat"}
            />

            {/* Benefits Section */}
            <ServiceSection
                title="Keunggulan Laboratorium Kami"
                subtitle="Layanan laboratorium terpercaya dengan standar kualitas tinggi"
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
                            Cari dan pilih jenis pemeriksaan laboratorium sesuai kebutuhan Anda. Anda dapat memilih lebih dari satu tes sekaligus.
                        </p>
                    </div>

                    <LabCatalog />
                </div>
            </section>

            {/* Preparation Section */}
            <ServiceSection
                title="Persiapan Pemeriksaan"
                subtitle="Beberapa hal yang perlu diperhatikan sebelum melakukan pemeriksaan laboratorium"
            >
                <div className="max-w-2xl mx-auto bg-card border rounded-xl p-6">
                    <ul className="space-y-3">
                        {preparations.map((prep, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </span>
                                <span className="text-muted-foreground">{prep}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </ServiceSection>

            {/* Operating Hours */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto bg-card border rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-center">Jam Operasional</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="font-semibold">Senin - Sabtu</p>
                                <p className="text-muted-foreground">07.00 - 21.00 WITA</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="font-semibold">Minggu & Hari Libur</p>
                                <p className="text-muted-foreground">08.00 - 14.00 WITA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Butuh Pemeriksaan Laboratorium?"
                subtitle="Hubungi kami untuk informasi lebih lanjut atau kunjungi langsung rumah sakit"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang pemeriksaan laboratorium di RSI Siti Hajar`,
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Lihat Paket MCU",
                    href: "/layanan/mcu",
                }}
            />
        </div>
    );
};
