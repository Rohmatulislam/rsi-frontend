"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    ScanLine,
    Waves,
    MonitorCheck,
    FileImage,
    Clock,
    ShieldCheck,
    UserCheck,
    FileCheck
} from "lucide-react";

const radiologyServices = [
    {
        icon: ScanLine,
        title: "Rontgen (X-Ray)",
        description: "Pencitraan untuk tulang, dada, dan organ dalam dengan teknologi digital",
        color: "success" as const,
    },
    {
        icon: Waves,
        title: "USG (Ultrasonografi)",
        description: "Pemeriksaan organ abdomen, kehamilan, tiroid, dan pembuluh darah",
        color: "cyan" as const,
    },
    {
        icon: MonitorCheck,
        title: "CT Scan",
        description: "Pencitraan 3D detail untuk kepala, dada, abdomen, dan tulang",
        color: "purple" as const,
    },
    {
        icon: FileImage,
        title: "Fluoroskopi",
        description: "Pemeriksaan real-time untuk saluran pencernaan dan prosedur intervensional",
        color: "accent" as const,
    },
];

const benefits = [
    {
        icon: ShieldCheck,
        title: "Teknologi Modern",
        description: "Peralatan radiologi terbaru dengan dosis radiasi minimal",
    },
    {
        icon: UserCheck,
        title: "Ahli Radiologi",
        description: "Dibaca oleh dokter spesialis radiologi berpengalaman",
    },
    {
        icon: Clock,
        title: "Hasil Cepat",
        description: "Hasil pembacaan tersedia dalam waktu singkat",
    },
    {
        icon: FileCheck,
        title: "PACS Digital",
        description: "Penyimpanan dan distribusi gambar secara digital",
    },
];

const requirements = [
    { title: "Surat Pengantar", description: "Dari dokter yang merujuk (jika ada)" },
    { title: "Identitas", description: "KTP/Kartu BPJS/Asuransi" },
    { title: "Hasil Sebelumnya", description: "Jika ada pemeriksaan radiologi sebelumnya (untuk perbandingan)" },
    { title: "Informasi Kehamilan", description: "Bagi wanita usia subur, informasikan jika sedang hamil" },
];

export const RadiologiPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN RADIOLOGI"
                title="Radiologi"
                highlightText="Teknologi Pencitraan Modern"
                subtitle="Layanan pencitraan medis lengkap untuk diagnosis yang tepat dan akurat"
            />

            {/* Benefits Section */}
            <ServiceSection
                title="Keunggulan Layanan Radiologi"
                subtitle="Pencitraan medis berkualitas dengan teknologi terdepan"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color="success"
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Services Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Layanan Pencitraan</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Berbagai modalitas pencitraan untuk kebutuhan diagnosis Anda
                        </p>
                    </div>

                    <ServiceGrid columns={4}>
                        {radiologyServices.map((service) => (
                            <ServiceCard
                                key={service.title}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                color={service.color}
                            />
                        ))}
                    </ServiceGrid>
                </div>
            </section>

            {/* Requirements Section */}
            <ServiceSection
                title="Persyaratan Pemeriksaan"
                subtitle="Dokumen dan informasi yang perlu disiapkan"
            >
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requirements.map((req, index) => (
                            <div key={index} className="bg-card border rounded-xl p-5">
                                <h4 className="font-semibold mb-1">{req.title}</h4>
                                <p className="text-sm text-muted-foreground">{req.description}</p>
                            </div>
                        ))}
                    </div>
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
                                <p className="text-muted-foreground">08.00 - 20.00 WITA</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="font-semibold">Minggu & Hari Libur</p>
                                <p className="text-muted-foreground">09.00 - 14.00 WITA</p>
                            </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            * Untuk CT Scan, harap melakukan reservasi terlebih dahulu
                        </p>
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Butuh Pemeriksaan Radiologi?"
                subtitle="Hubungi kami untuk reservasi atau informasi lebih lanjut"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang pemeriksaan radiologi",
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Lihat Dokter",
                    href: "/doctors",
                }}
            />
        </div>
    );
};
