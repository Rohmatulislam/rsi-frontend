"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { Pill, Clock, ShieldCheck, MessageCircle, Truck, CreditCard } from "lucide-react";

const farmasiServices = [
    {
        icon: Pill,
        title: "Obat Resep",
        description: "Penebusan resep dokter dengan obat berkualitas",
        color: "accent" as const,
    },
    {
        icon: ShieldCheck,
        title: "Obat Bebas",
        description: "Obat bebas dan suplemen kesehatan",
        color: "success" as const,
    },
    {
        icon: MessageCircle,
        title: "Konsultasi Apoteker",
        description: "Konsultasi penggunaan obat dengan apoteker profesional",
        color: "primary" as const,
    },
    {
        icon: Truck,
        title: "Pengiriman Obat",
        description: "Layanan antar obat ke rumah Anda",
        color: "purple" as const,
    },
];

const features = [
    {
        icon: Clock,
        title: "Buka 24 Jam",
        description: "Melayani kebutuhan obat Anda kapan saja, 7 hari seminggu",
    },
    {
        icon: ShieldCheck,
        title: "Obat Asli & Berkualitas",
        description: "Semua obat dijamin keaslian dan kualitasnya",
    },
    {
        icon: CreditCard,
        title: "Pembayaran Mudah",
        description: "Terima berbagai metode pembayaran termasuk BPJS",
    },
];

export const FarmasiPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="FARMASI 24 JAM"
                title="Farmasi"
                highlightText="Buka 24 Jam Non-Stop"
                subtitle="Layanan farmasi lengkap dengan obat berkualitas tersedia 24 jam setiap hari"
            />

            {/* Features */}
            <ServiceSection
                title="Keunggulan Farmasi Kami"
                subtitle="Layanan apotek terpercaya untuk kebutuhan kesehatan Anda"
            >
                <ServiceGrid columns={3}>
                    {features.map((feature) => (
                        <ServiceCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color="accent"
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Services */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Layanan Kami</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Berbagai layanan farmasi untuk memenuhi kebutuhan kesehatan Anda
                        </p>
                    </div>

                    <ServiceGrid columns={4}>
                        {farmasiServices.map((service) => (
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

            {/* Contact Info */}
            <ServiceSection title="Informasi Kontak">
                <div className="max-w-xl mx-auto bg-card border rounded-xl p-6 text-center">
                    <div className="text-5xl mb-4">🏥</div>
                    <h3 className="text-xl font-bold mb-2">Apotek RSI Siti Hajar</h3>
                    <p className="text-muted-foreground mb-4">
                        Lantai 1, Gedung Utama<br />
                        Buka 24 Jam, 7 Hari Seminggu
                    </p>
                    <p className="text-lg font-semibold text-primary">
                        📞 (0370) 123-4567
                    </p>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Butuh Obat atau Konsultasi?"
                subtitle="Hubungi kami untuk informasi stok obat atau konsultasi dengan apoteker"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang obat di apotek",
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};
