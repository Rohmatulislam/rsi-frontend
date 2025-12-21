"use client";

import { ServiceHero, ServiceSection, ServiceCTA } from "~/features/services";
import {
    Loader2, ArrowRight,
    ClipboardCheck, Activity, FlaskConical, Zap
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useGetMcuPackages } from "~/features/mcu";
import { MCUPageSkeleton } from "~/components/shared/PageSkeletons";
import { McuBenefitsSection } from "../components/McuBenefitsSection";
import { McuPackageCard } from "../components/McuPackageCard";
import { McuInfoSection } from "../components/McuInfoSection";

export const MCUPage = () => {
    const { data: service, isLoading: serviceLoading } = useGetServiceBySlug({ slug: 'mcu' });
    const { data: khanzaPackages, isLoading: khanzaLoading } = useGetMcuPackages();

    const isLoading = serviceLoading;

    if (isLoading) {
        return <MCUPageSkeleton />;
    }

    return (
        <div className="min-h-screen pb-24">
            <ServiceHero
                badge="PREVENTIVE CARE"
                title={service?.title || service?.name || "Medical Check Up"}
                highlightText={service?.subtitle || "Investasi Masa Depan"}
                subtitle={service?.description || "Layanan pemeriksaan kesehatan komprehensif didukung laboratorium modern untuk deteksi dini dan pemantauan kondisi tubuh Anda secara mendalam."}
            />

            {/* Premium Stats / Highlights */}
            <div className="container mx-auto px-4 -mt-10 mb-24 relative z-10">
                <div className="bg-card border rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative border-primary/10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-bl-[10rem] -mr-20 -mt-20" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        {[
                            { icon: ClipboardCheck, label: "6+ Paket Pilihan", desc: "Dari Basic hingga Eksekutif" },
                            { icon: Activity, label: "Hasil Cepat", desc: "Digital report dalam 24 jam" },
                            { icon: FlaskConical, label: "Lab Mandiri", desc: "Akurasi diagnosa tinggi" },
                            { icon: Zap, label: "Tanpa Antre", desc: "Sistem booking terjadwal" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform hover:scale-110">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">{item.label}</h4>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Selection */}
            <ServiceSection
                title="Pentingnya Pemeriksaan Rutin"
                subtitle="Mencegah lebih baik daripada mengobati. Awasi kesehatan Anda dengan standar medis terbaik."
            >
                <McuBenefitsSection />
            </ServiceSection>

            {/* Packages Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-border/40">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 max-w-5xl mx-auto">
                        <div className="flex-1">
                            <Badge className="mb-4 bg-primary/10 text-primary border-none uppercase tracking-widest px-4 font-bold">Katalog Paket MCU</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Pilih Paket Sesuai Kebutuhan</h2>
                            <p className="text-muted-foreground">Tersedia berbagai kategori paket mulai dari pemeriksaan dasar hingga pemeriksaan eksekutif menyeluruh.</p>
                        </div>
                        <Button variant="outline" className="rounded-full px-8 h-12" asChild>
                            <a href="https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang rincian paket MCU">
                                Bandingkan Paket <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                    </div>

                    {/* Loading state for Khanza packages */}
                    {khanzaLoading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-muted-foreground font-medium">Sinkronisasi data SIMRS...</p>
                        </div>
                    )}

                    {/* Khanza Packages - Primary source */}
                    {!khanzaLoading && khanzaPackages && khanzaPackages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {khanzaPackages.filter(pkg =>
                                pkg.name.toLowerCase().includes('mcu') ||
                                pkg.name.toLowerCase().includes('medical check')
                            ).slice(0, 6).map((pkg, idx) => (
                                <McuPackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    isPopular={idx === 1}
                                    isFromKhanza={true}
                                />
                            ))}
                        </div>
                    )}

                    {/* Fallback to local service items if no Khanza packages */}
                    {!khanzaLoading && (!khanzaPackages || khanzaPackages.length === 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {service?.items?.filter(item => item.isActive).map((pkg, idx) => (
                                <McuPackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    isPopular={idx === 1}
                                    isFromKhanza={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Informational FAQ-style section */}
            <McuInfoSection />

            <ServiceCTA
                title="Cek Kesehatan Anda Sekarang"
                subtitle="Dapatkan hasil pemeriksaan yang akurat dan konsultasi dengan dokter kami untuk langkah pencegahan terbaik."
                primaryAction={{
                    label: "Reservasi via WhatsApp",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin reservasi Medical Check Up di RSI Siti Hajar`,
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Eksplor Dokter Kami",
                    href: "/doctors",
                }}
            />
        </div>
    );
};
