"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    Loader2, Check, Clock, FileCheck, Heart, Shield, Star,
    Database, Activity, ClipboardCheck, Zap, ArrowRight,
    Search, Info, CheckCircle2, FlaskConical
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { Button } from "~/components/ui/button";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useGetMcuPackages, McuBookingModal } from "~/features/mcu";
import Link from "next/link";
import { MCUPageSkeleton } from "~/components/shared/PageSkeletons";

export const MCUPage = () => {
    const { data: service, isLoading: serviceLoading } = useGetServiceBySlug({ slug: 'mcu' });
    const { data: khanzaPackages, isLoading: khanzaLoading } = useGetMcuPackages();

    const isLoading = serviceLoading;

    if (isLoading) {
        return <MCUPageSkeleton />;
    }

    const benefits = [
        {
            icon: Shield,
            title: "Deteksi Dini",
            description: "Mengidentifikasi faktor risiko kesehatan sebelum berkembang menjadi penyakit serius.",
            color: "primary" as const,
        },
        {
            icon: Heart,
            title: "Kesehatan Optimal",
            description: "Memastikan seluruh fungsi organ vital Anda bekerja dengan performa terbaik.",
            color: "rose" as const,
        },
        {
            icon: FileCheck,
            title: "Rekam Medis",
            description: "Memiliki riwayat kesehatan yang terperinci sebagai referensi medis masa depan.",
            color: "success" as const,
        },
        {
            icon: Clock,
            title: "Efisiensi Waktu",
            description: "Seluruh rangkaian pemeriksaan dilakukan dalam satu lokasi dan waktu yang terjadwal.",
            color: "accent" as const,
        },
    ];

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="bg-card border border-border/60 rounded-3xl p-8 hover:shadow-xl transition-all group hover:-translate-y-1">
                            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <benefit.icon className="h-6 w-6" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
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
                            ).slice(0, 6).map((pkg, idx) => {
                                const isPopular = idx === 1;

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`group relative bg-card border rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl overflow-hidden flex flex-col ${isPopular ? "border-primary shadow-xl md:scale-105 z-10" : "border-border/60 hover:border-primary/30"
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg">
                                                Terpopuler
                                            </div>
                                        )}
                                        <div className="mb-8">
                                            <Badge variant="outline" className="mb-4 border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                                <Database className="h-3 w-3 mr-1.5" /> Synchronized
                                            </Badge>
                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{pkg.name}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">Paket pemeriksaan kesehatan terstandarisasi SIMRS RSI Siti Hajar.</p>
                                        </div>

                                        <div className="mb-10 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1 opacity-60">Estimasi Biaya</p>
                                            <p className="text-4xl font-black text-primary">
                                                {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                                            </p>
                                        </div>

                                        <McuBookingModal
                                            package={pkg}
                                            trigger={
                                                <Button
                                                    className={`w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all ${isPopular ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-slate-900 hover:bg-primary shadow-slate-200"}`}
                                                >
                                                    Pilih Paket Ini
                                                </Button>
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Fallback to local service items if no Khanza packages */}
                    {!khanzaLoading && (!khanzaPackages || khanzaPackages.length === 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {service?.items?.filter(item => item.isActive).map((pkg, idx) => {
                                const features = pkg.features ? pkg.features.split(',') : [];
                                const isPopular = idx === 1;

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`group relative bg-card border rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl overflow-hidden flex flex-col ${isPopular ? "border-primary shadow-xl md:scale-105 z-10" : "border-border/60 hover:border-primary/30"
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg">
                                                PILIHAN UTAMA
                                            </div>
                                        )}
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{pkg.name}</h3>
                                            <p className="text-3xl font-black text-primary mb-3">
                                                {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                                        </div>

                                        <div className="space-y-4 mb-10 flex-grow">
                                            {features.slice(0, 5).map((feature, fIdx) => (
                                                <div key={fIdx} className="flex items-start gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{feature.trim()}</span>
                                                </div>
                                            ))}
                                            {features.length > 5 && (
                                                <p className="text-xs text-primary font-bold pl-8">+{features.length - 5} Pemeriksaan Lainnya</p>
                                            )}
                                        </div>

                                        <AppointmentBookingModal
                                            serviceItem={{ id: pkg.id, name: pkg.name }}
                                            initialPoliId="mcu"
                                            trigger={
                                                <Button className={`w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all ${isPopular ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-slate-900 hover:bg-primary shadow-slate-200"}`}>
                                                    Booking Sekarang
                                                </Button>
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>


            {/* Informational FAQ-style section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Informasi Pemeriksaan</h2>
                            <div className="space-y-6">
                                <div className="flex gap-6 p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all">
                                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                                        <Info className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Persiapan Puasa</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Pasien diharapkan berpuasa selama 10-12 jam sebelum pengambilan darah (hanya diperbolehkan minum air putih).</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all">
                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Jam Kedatangan</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Layanan MCU tersedia setiap Senin - Sabtu mulai pukul 07.30 - 12.00 WITA untuk pendaftaran.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary/5 rounded-[3rem] p-10 md:p-14 border border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10" />
                            <h3 className="text-2xl font-bold mb-6">Paket Perusahaan?</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">Dapatkan penawaran khusus untuk pemeriksaan kesehatan karyawan (Annual Medical Checkup) dengan fasilitas Mobile Lab atau pemeriksaan On-Site.</p>
                            <Button className="rounded-xl h-14 px-8 font-bold" variant="default" asChild>
                                <a href="https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang paket MCU Corporate">
                                    Hubungi Tim Corporate <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

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
