"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { Check, Clock, FileCheck, Heart, Shield, Star } from "lucide-react";
import { Badge } from "~/components/ui/badge";

const mcuPackages = [
    {
        name: "Paket Basic",
        price: "Rp 350.000",
        description: "Pemeriksaan dasar untuk kesehatan umum",
        features: [
            "Pemeriksaan Fisik Lengkap",
            "Tekanan Darah",
            "Gula Darah Puasa",
            "Kolesterol Total",
            "Urine Lengkap",
        ],
        color: "primary" as const,
        popular: false,
    },
    {
        name: "Paket Standard",
        price: "Rp 750.000",
        description: "Pemeriksaan menengah untuk deteksi lebih detail",
        features: [
            "Semua Paket Basic",
            "Profil Lipid Lengkap",
            "Fungsi Hati (SGOT/SGPT)",
            "Fungsi Ginjal (Ureum/Kreatinin)",
            "Asam Urat",
            "EKG",
            "Rontgen Dada",
        ],
        color: "accent" as const,
        popular: true,
    },
    {
        name: "Paket Executive",
        price: "Rp 1.500.000",
        description: "Pemeriksaan komprehensif untuk kesehatan optimal",
        features: [
            "Semua Paket Standard",
            "USG Abdomen",
            "Hepatitis B (HBsAg)",
            "Tumor Marker (PSA/CA-125)",
            "Treadmill Test",
            "Konsultasi Dokter Spesialis",
            "Laporan Kesehatan Komprehensif",
        ],
        color: "purple" as const,
        popular: false,
    },
];

const benefits = [
    {
        icon: Shield,
        title: "Deteksi Dini",
        description: "Menemukan masalah kesehatan sebelum menjadi serius",
    },
    {
        icon: Heart,
        title: "Kesehatan Optimal",
        description: "Memastikan tubuh dalam kondisi terbaik",
    },
    {
        icon: FileCheck,
        title: "Rekam Medis",
        description: "Dokumentasi kesehatan yang lengkap dan terorganisir",
    },
    {
        icon: Clock,
        title: "Hemat Waktu",
        description: "Pemeriksaan lengkap dalam satu kunjungan",
    },
];

export const MCUPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN MCU"
                title="Medical Check Up"
                highlightText="Paket Lengkap & Terjangkau"
                subtitle="Investasi terbaik untuk kesehatan Anda dengan pemeriksaan menyeluruh dan akurat"
            />

            {/* Benefits Section */}
            <ServiceSection
                title="Mengapa Medical Check Up?"
                subtitle="Pemeriksaan kesehatan rutin adalah investasi terbaik untuk masa depan Anda"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color="primary"
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Packages Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Pilihan Paket MCU</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Pilih paket yang sesuai dengan kebutuhan kesehatan Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {mcuPackages.map((pkg) => (
                            <div
                                key={pkg.name}
                                className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${pkg.popular ? "border-primary shadow-lg scale-105" : "border-border"
                                    }`}
                            >
                                {pkg.popular && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                                        <Star className="h-3 w-3 mr-1" />
                                        Terpopuler
                                    </Badge>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-3xl font-black text-primary mb-2">{pkg.price}</p>
                                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                </div>
                                <ul className="space-y-3">
                                    {pkg.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Operating Hours */}
            <ServiceSection title="Informasi Layanan">
                <div className="max-w-2xl mx-auto bg-card border rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">Jam Operasional</h4>
                            <p className="text-muted-foreground text-sm">Senin - Sabtu: 07.00 - 14.00 WITA</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Persiapan</h4>
                            <p className="text-muted-foreground text-sm">Puasa 10-12 jam sebelum pemeriksaan</p>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Siap Untuk Pemeriksaan?"
                subtitle="Hubungi kami untuk reservasi atau informasi lebih lanjut"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin reservasi Medical Check Up",
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
