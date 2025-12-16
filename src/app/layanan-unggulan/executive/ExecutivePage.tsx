"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Crown, UserCheck, Clock, Sparkles, Coffee, Car, ArrowRight } from "lucide-react";

import { getExecutivePoliklinik } from "~/features/services/data/poliklinik-data";

const executiveFeatures = [
    {
        icon: Crown,
        title: "Fasilitas Premium",
        description: "Ruang tunggu eksklusif dengan kenyamanan maksimal",
        color: "accent" as const,
    },
    {
        icon: UserCheck,
        title: "Dokter Senior",
        description: "Ditangani oleh dokter-dokter senior berpengalaman",
        color: "purple" as const,
    },
    {
        icon: Clock,
        title: "Prioritas Layanan",
        description: "Waktu tunggu minimal dengan layanan prioritas",
        color: "primary" as const,
    },
    {
        icon: Sparkles,
        title: "Pelayanan Personal",
        description: "Tim medis khusus yang melayani dengan penuh perhatian",
        color: "rose" as const,
    },
];

const facilities = [
    { icon: Coffee, text: "Ruang tunggu dengan refreshment" },
    { icon: Car, text: "Akses parkir prioritas" },
    { icon: Crown, text: "Ruang konsultasi privat" },
    { icon: UserCheck, text: "Pendampingan perawat khusus" },
];

export const ExecutivePage = () => {
    const executivePolis = getExecutivePoliklinik();

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN EXECUTIVE"
                title="Poli Executive"
                highlightText="Pelayanan Premium untuk Anda"
                subtitle="Pengalaman berobat eksklusif dengan fasilitas terbaik dan tenaga medis profesional"
            />

            {/* Features */}
            <ServiceSection
                title="Keunggulan Layanan Executive"
                subtitle="Pengalaman berobat premium dengan standar tertinggi"
            >
                <ServiceGrid columns={4}>
                    {executiveFeatures.map((feature) => (
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

            {/* Poli List */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Poliklinik Executive</h2>
                        <p className="text-muted-foreground">Layanan spesialis dengan fasilitas premium</p>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {executivePolis.map((poli) => {
                            const Icon = poli.icon;
                            return (
                                <Link
                                    key={poli.slug}
                                    href={`/layanan/poli/${poli.slug}`}
                                    className="group block"
                                >
                                    <div className="flex items-center gap-4 bg-card border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-amber-500/50">
                                        <div className="p-3 rounded-lg bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                            <Icon className="h-6 w-6 text-amber-600 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold block group-hover:text-amber-600 transition-colors">{poli.name}</span>
                                            <span className="text-xs text-muted-foreground mt-1 block">Lihat Dokter & Jadwal</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform group-hover:text-amber-600" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <ServiceSection title="Fasilitas Eksklusif">
                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-4 bg-card border rounded-xl p-5">
                            <div className="p-3 rounded-full bg-amber-500/10">
                                <facility.icon className="h-5 w-5 text-amber-600" />
                            </div>
                            <span>{facility.text}</span>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            {/* CTA */}
            <section className="py-12 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Temukan Dokter Executive</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Lihat jadwal dan booking konsultasi dengan dokter executive
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/doctors?executive=true">
                            Lihat Dokter Executive
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            <ServiceCTA
                title="Tertarik dengan Layanan Executive?"
                subtitle="Hubungi kami untuk informasi lebih lanjut atau booking jadwal"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang layanan executive",
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};
