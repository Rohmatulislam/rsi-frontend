"use client";

import Link from "next/link";
import {
    Building2, Stethoscope, Pill, FlaskConical, Radiation,
    Heart, ClipboardCheck, ArrowRight, Sparkles, ShoppingCart
} from "lucide-react";
import { ServiceHero, ServiceSection } from "~/features/services";
import { cn } from "~/lib/utils";

const services = [
    {
        title: "Rawat Inap",
        description: "Layanan perawatan pasien dengan fasilitas kamar lengkap dan nyaman",
        href: "/layanan/rawat-inap",
        icon: Building2,
        color: "bg-blue-500",
    },
    {
        title: "Rawat Jalan",
        description: "Konsultasi dan pemeriksaan dengan dokter spesialis",
        href: "/layanan/rawat-jalan",
        icon: Stethoscope,
        color: "bg-emerald-500",
    },
    {
        title: "Farmasi 24 Jam",
        description: "Layanan apotek yang beroperasi sepanjang waktu",
        href: "/layanan/farmasi",
        icon: Pill,
        color: "bg-amber-500",
    },
    {
        title: "Laboratorium",
        description: "Pemeriksaan laboratorium dengan hasil akurat dan cepat",
        href: "/layanan/diagnostic-hub?tab=lab",
        icon: FlaskConical,
        color: "bg-purple-500",
    },
    {
        title: "Radiologi",
        description: "Pemeriksaan X-Ray, CT Scan, USG dan lainnya",
        href: "/layanan/diagnostic-hub?tab=radio",
        icon: Radiation,
        color: "bg-rose-500",
    },
    {
        title: "Rehabilitasi Medik",
        description: "Layanan fisioterapi dan pemulihan fungsi tubuh",
        href: "/layanan/rehabilitasi-medik",
        icon: Heart,
        color: "bg-teal-500",
    },
    {
        title: "Medical Check Up",
        description: "Paket pemeriksaan kesehatan menyeluruh",
        href: "/layanan/diagnostic-hub?tab=mcu",
        icon: ClipboardCheck,
        color: "bg-indigo-500",
    },
    {
        title: "Diagnostic Hub",
        description: "Portal terpadu untuk pesan Lab, Radiologi, dan MCU sekaligus",
        href: "/layanan/diagnostic-hub",
        icon: ShoppingCart,
        color: "bg-blue-600",
    },
];

const featuredServices = [
    {
        title: "Bedah Minimal Invasif",
        href: "/layanan-unggulan/bedah-minimal-invasif",
    },
    {
        title: "ESWL",
        href: "/layanan-unggulan/eswl",
    },
    {
        title: "Persalinan Syar'i",
        href: "/layanan-unggulan/persalinan-syari",
    },
    {
        title: "Layanan Eksekutif",
        href: "/layanan-unggulan/executive",
    },
];

export const LayananIndexPage = () => {
    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="LAYANAN KESEHATAN"
                title="Daftar Layanan"
                highlightText="RSI Siti Hajar Mataram"
                subtitle="Kami menyediakan berbagai layanan kesehatan dengan standar pelayanan terbaik untuk memenuhi kebutuhan Anda."
            />

            <ServiceSection
                title="Layanan Utama"
                subtitle="Pilih layanan kesehatan yang Anda butuhkan"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Link
                                key={service.href}
                                href={service.href}
                                className="group bg-card border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform",
                                    service.color
                                )}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {service.description}
                                </p>
                                <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Lihat Detail
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </ServiceSection>

            <section className="py-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="h-6 w-6 text-amber-500" />
                        <h2 className="text-2xl font-bold">Layanan Unggulan</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredServices.map((service) => (
                            <Link
                                key={service.href}
                                href={service.href}
                                className="bg-card border rounded-xl p-5 text-center hover:shadow-lg hover:border-amber-500/30 transition-all group"
                            >
                                <span className="font-semibold group-hover:text-amber-600 transition-colors">
                                    {service.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
