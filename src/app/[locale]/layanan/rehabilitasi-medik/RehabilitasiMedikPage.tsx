"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { HeartPulse, Brain, Baby, Bone, Dumbbell, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

const therapyServices = [
    {
        icon: Dumbbell,
        title: "Fisioterapi",
        description: "Terapi untuk pemulihan fungsi gerak dan mengurangi nyeri",
        color: "rose" as const,
    },
    {
        icon: MessageSquare,
        title: "Terapi Wicara",
        description: "Terapi untuk gangguan bicara, bahasa, dan menelan",
        color: "cyan" as const,
    },
    {
        icon: Brain,
        title: "Terapi Okupasi",
        description: "Terapi untuk kemandirian aktivitas sehari-hari",
        color: "purple" as const,
    },
    {
        icon: Baby,
        title: "Tumbuh Kembang Anak",
        description: "Stimulasi dan terapi untuk optimalisasi perkembangan anak",
        color: "accent" as const,
    },
];

const conditions = [
    "Stroke dan gangguan neurologis",
    "Cedera olahraga dan trauma",
    "Nyeri punggung dan leher",
    "Pasca operasi tulang dan sendi",
    "Kelumpuhan dan kelemahan otot",
    "Gangguan keseimbangan",
    "Keterlambatan perkembangan anak",
    "Gangguan bicara dan menelan",
];

export const RehabilitasiMedikPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="REHABILITASI MEDIK"
                title="Rehabilitasi Medik"
                highlightText="Terapi Profesional & Komprehensif"
                subtitle="Layanan rehabilitasi profesional untuk pemulihan fungsi tubuh yang optimal"
            />

            {/* Services */}
            <ServiceSection
                title="Layanan Terapi"
                subtitle="Berbagai jenis terapi untuk pemulihan fungsi tubuh Anda"
            >
                <ServiceGrid columns={4}>
                    {therapyServices.map((service) => (
                        <ServiceCard
                            key={service.title}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            color={service.color}
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Conditions Treated */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Kondisi yang Ditangani</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Kami menangani berbagai kondisi yang memerlukan rehabilitasi
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                        {conditions.map((condition, index) => (
                            <div key={index} className="flex items-center gap-3 bg-card border rounded-lg p-4">
                                <HeartPulse className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>{condition}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Operating Hours */}
            <ServiceSection title="Jam Operasional">
                <div className="max-w-xl mx-auto bg-card border rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="font-semibold">Senin - Jumat</p>
                            <p className="text-muted-foreground text-sm">08.00 - 16.00 WITA</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="font-semibold">Sabtu</p>
                            <p className="text-muted-foreground text-sm">08.00 - 12.00 WITA</p>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            {/* CTA - Find Doctor */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Temukan Dokter Sp.KFR</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Konsultasikan kondisi Anda dengan dokter spesialis rehabilitasi medik
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/doctors?specialty=rehabilitasi">
                            Lihat Dokter Spesialis
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            <ServiceCTA
                title="Butuh Konsultasi?"
                subtitle="Hubungi kami untuk informasi lebih lanjut atau booking jadwal terapi"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang rehabilitasi medik",
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};
