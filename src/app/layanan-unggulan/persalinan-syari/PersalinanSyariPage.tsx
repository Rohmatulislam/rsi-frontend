"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { Heart, Shield, Users, Star, Baby, Stethoscope, Home, Gift } from "lucide-react";
import { Badge } from "~/components/ui/badge";

const features = [
    {
        icon: Shield,
        title: "Privasi Terjaga",
        description: "Ruang persalinan privat dengan akses terbatas untuk menjaga kehormatan ibu",
        color: "rose" as const,
    },
    {
        icon: Users,
        title: "Tenaga Medis Muslimah",
        description: "Tim bidan dan perawat wanita yang profesional dan memahami nilai Islami",
        color: "purple" as const,
    },
    {
        icon: Heart,
        title: "Pendampingan Suami",
        description: "Suami dapat mendampingi proses persalinan sesuai kaidah syar'i",
        color: "primary" as const,
    },
    {
        icon: Star,
        title: "Adzan Pertama",
        description: "Fasilitas untuk mengumandangkan adzan di telinga bayi yang baru lahir",
        color: "accent" as const,
    },
];

const services = [
    { icon: Baby, text: "Persalinan normal" },
    { icon: Stethoscope, text: "Operasi caesar (jika diperlukan)" },
    { icon: Home, text: "Ruang rawat inap nyaman" },
    { icon: Gift, text: "Paket persalinan lengkap" },
];

const packages = [
    {
        name: "Paket Normal",
        price: "Rp 8.500.000",
        includes: ["Persalinan normal", "Rawat inap 2 hari", "Perawatan bayi", "Adzan & Iqomah"],
    },
    {
        name: "Paket Caesar",
        price: "Rp 18.500.000",
        includes: ["Operasi caesar", "Rawat inap 3 hari", "Perawatan bayi", "Adzan & Iqomah", "Obat-obatan lengkap"],
    },
    {
        name: "Paket VIP",
        price: "Rp 25.000.000",
        includes: ["Normal/Caesar", "Kamar VIP", "Rawat inap 4 hari", "Semua fasilitas premium"],
    },
];

export const PersalinanSyariPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN UNGGULAN"
                title="Persalinan Syar'i"
                highlightText="Berkah dalam Kebahagiaan"
                subtitle="Proses persalinan yang mengutamakan privasi dan nilai-nilai Islami bagi ibu dan keluarga"
            />

            {/* Features */}
            <ServiceSection
                title="Keistimewaan Persalinan Syar'i"
                subtitle="Pengalaman persalinan yang sesuai dengan nilai-nilai Islam"
            >
                <ServiceGrid columns={4}>
                    {features.map((feature) => (
                        <ServiceCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Services List */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Layanan Tersedia</h2>
                        <p className="text-muted-foreground">Berbagai layanan untuk kebutuhan persalinan Anda</p>
                    </div>
                    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service, index) => (
                            <div key={index} className="flex items-center gap-4 bg-card border rounded-xl p-5">
                                <div className="p-3 rounded-full bg-rose-500/10">
                                    <service.icon className="h-5 w-5 text-rose-600" />
                                </div>
                                <span className="font-medium">{service.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <ServiceSection
                title="Paket Persalinan"
                subtitle="Pilih paket yang sesuai dengan kebutuhan Anda"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.name}
                            className={`bg-card border rounded-2xl p-6 ${index === 1 ? "border-primary shadow-lg md:scale-105" : ""}`}
                        >
                            {index === 1 && (
                                <Badge className="mb-3 bg-primary">Populer</Badge>
                            )}
                            <h3 className="text-lg font-bold mb-2">{pkg.name}</h3>
                            <p className="text-2xl font-black text-primary mb-4">{pkg.price}</p>
                            <ul className="space-y-2">
                                {pkg.includes.map((item, i) => (
                                    <li key={i} className="text-sm flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Konsultasi Persalinan Syar'i"
                subtitle="Hubungi kami untuk informasi lebih lanjut atau booking konsultasi"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang persalinan syar'i",
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Lihat Dokter Kandungan",
                    href: "/doctors?specialty=kandungan",
                }}
            />
        </div>
    );
};
