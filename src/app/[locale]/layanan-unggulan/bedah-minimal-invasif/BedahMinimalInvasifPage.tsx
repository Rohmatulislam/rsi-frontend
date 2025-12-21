"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { Scissors, Stethoscope, Clock, Shield, Heart, Activity, Bone, Baby } from "lucide-react";

const benefits = [
    {
        icon: Scissors,
        title: "Sayatan Minimal",
        description: "Sayatan kecil 0.5-1.5 cm dibandingkan operasi konvensional",
        color: "primary" as const,
    },
    {
        icon: Clock,
        title: "Pemulihan Cepat",
        description: "Waktu rawat inap lebih singkat, kembali beraktivitas lebih cepat",
        color: "success" as const,
    },
    {
        icon: Shield,
        title: "Risiko Rendah",
        description: "Risiko infeksi dan komplikasi lebih rendah",
        color: "cyan" as const,
    },
    {
        icon: Heart,
        title: "Nyeri Minimal",
        description: "Rasa nyeri pasca operasi lebih ringan",
        color: "rose" as const,
    },
];

const procedures = [
    {
        icon: Activity,
        title: "Laparoskopi",
        description: "Operasi organ perut: usus buntu, kandung empedu, hernia, dan lainnya",
        color: "primary" as const,
    },
    {
        icon: Stethoscope,
        title: "Endoskopi",
        description: "Pemeriksaan dan tindakan pada saluran pencernaan",
        color: "success" as const,
    },
    {
        icon: Bone,
        title: "Artroskopi",
        description: "Operasi sendi: lutut, bahu, pergelangan kaki",
        color: "purple" as const,
    },
    {
        icon: Baby,
        title: "Ginekologi",
        description: "Operasi sistem reproduksi wanita dengan minim invasif",
        color: "rose" as const,
    },
];

export const BedahMinimalInvasifPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN UNGGULAN"
                title="Bedah Minimal Invasif"
                highlightText="Teknologi Modern, Pemulihan Cepat"
                subtitle="Teknik operasi modern dengan sayatan kecil, pemulihan lebih cepat, dan risiko komplikasi minimal"
            />

            {/* Benefits */}
            <ServiceSection
                title="Keunggulan Bedah Minimal Invasif"
                subtitle="Mengapa memilih teknik operasi minimal invasif?"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color={benefit.color}
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Procedures */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Jenis Prosedur</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Berbagai prosedur bedah minimal invasif yang tersedia
                        </p>
                    </div>

                    <ServiceGrid columns={4}>
                        {procedures.map((proc) => (
                            <ServiceCard
                                key={proc.title}
                                icon={proc.icon}
                                title={proc.title}
                                description={proc.description}
                                color={proc.color}
                            />
                        ))}
                    </ServiceGrid>
                </div>
            </section>

            {/* Comparison */}
            <ServiceSection title="Perbandingan dengan Operasi Konvensional">
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-green-600">✓ Bedah Minimal Invasif</h3>
                            <ul className="space-y-2 text-sm">
                                <li>• Sayatan kecil (0.5-1.5 cm)</li>
                                <li>• Rawat inap 1-2 hari</li>
                                <li>• Nyeri minimal</li>
                                <li>• Bekas luka hampir tidak terlihat</li>
                                <li>• Kembali beraktivitas 1-2 minggu</li>
                            </ul>
                        </div>
                        <div className="bg-muted/50 border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-muted-foreground">Operasi Konvensional</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Sayatan besar (10-20 cm)</li>
                                <li>• Rawat inap 5-7 hari</li>
                                <li>• Nyeri lebih besar</li>
                                <li>• Bekas luka terlihat</li>
                                <li>• Kembali beraktivitas 4-6 minggu</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Konsultasi dengan Dokter Bedah"
                subtitle="Temukan dokter bedah spesialis untuk konsultasi lebih lanjut"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin konsultasi tentang bedah minimal invasif",
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Lihat Dokter Bedah",
                    href: "/doctors?specialty=bedah",
                }}
            />
        </div>
    );
};
