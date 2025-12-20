"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    Heart, Shield, Users, Star, Baby, Stethoscope, Home, Gift,
    ChevronRight, CheckCircle2, ArrowRight, Sparkles, Moon
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

const features = [
    {
        icon: Shield,
        title: "Privasi Maksimal",
        description: "Alur masuk dan ruang persalinan terpisah untuk menjaga kehormatan ibu sepenuhnya.",
        color: "rose" as const,
    },
    {
        icon: Users,
        title: "Tim Medis Wanita",
        description: "Seluruh tim bidan dan perawat adalah wanita muslimah yang memahami etika syar'i.",
        color: "purple" as const,
    },
    {
        icon: Heart,
        title: "Dukungan Suami",
        description: "Fasilitas pendampingan suami selama proses kontraksi hingga persalinan.",
        color: "rose" as const,
    },
    {
        icon: Moon,
        title: "Nuansa Islami",
        description: "Lingkungan tenang yang mendukung pembacaan Al-Qur'an dan dzikir selama proses.",
        color: "accent" as const,
    },
];

const packages = [
    {
        name: "Paket Barokah",
        description: "Persalinan Normal Kelas 1",
        price: "Mulai 8.5 Juta",
        includes: ["Persalinan Normal", "Kamar Kelas 1 (3 Hari)", "Perawatan Bayi", "Adzan & Iqomah", "Dokumentasi Foto"],
        isPopular: false,
    },
    {
        name: "Paket Mawaddah",
        description: "Persalinan SC Executive",
        price: "Mulai 18.5 Juta",
        includes: ["Operasi SC Metode ERACS", "Kamar VIP (4 Hari)", "Perawatan Bayi Intensif", "Paket Gift Persalinan", "Konsultasi Laktasi"],
        isPopular: true,
    },
    {
        name: "Paket Rahmah",
        description: "Layanan VVIP Suite",
        price: "Mulai 25 Juta",
        includes: ["Pilihan Metode Persalinan", "Suite Room VVIP", "Layanan Catering Khusus", "Homecare Pasca Melahirkan", "Baby Spa & Massage"],
        isPopular: false,
    },
];

export const PersalinanSyariPage = () => {
    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="LAYANAN UNGGULAN"
                title="Persalinan Syar'i"
                highlightText="Sambut Buah Hati dengan Berkah"
                subtitle="Menghadirkan kenyamanan persalinan yang menjunjung tinggi nilai-nilai Islami, privasi, dan profesionalisme medis bagi Ibu dan Bayi."
            />

            {/* Premium Highlight */}
            <div className="container mx-auto px-4 -mt-10 relative z-10 mb-24">
                <div className="bg-white dark:bg-slate-900 border rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-bl-full -mr-20 -mt-20 blur-3xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <Badge className="mb-6 bg-rose-500 text-white border-none px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">Layanan Prioritas Ibu</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Keamanan Medis dengan Kenyamanan Syariah</h2>
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                Kami memahami bahwa momen kelahiran adalah ibadah. Oleh karena itu, RSI Siti Hajar berkomitmen memberikan lingkungan yang mendukung dzikir dan doa, dengan tim medis wanita pilihan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <AppointmentBookingModal
                                    initialPoliId="kandungan"
                                    trigger={
                                        <Button size="lg" className="rounded-2xl h-16 px-10 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 dark:shadow-rose-950/20 text-lg font-bold gap-3">
                                            Konsultasi Sekarang <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    }
                                />
                                <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 border-rose-200 text-rose-600 font-bold text-lg" asChild>
                                    <a href="https://wa.me/6281234567890">
                                        Tanya Admin
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="flex flex-col p-6 rounded-[2rem] bg-rose-50/30 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-rose-500 mb-6 font-bold">
                                        <f.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{f.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Packages Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-border/40">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <Sparkles className="h-10 w-10 text-rose-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilihan Paket Persalinan</h2>
                        <p className="text-muted-foreground">Rancangan biaya yang transparan dan kompetitif untuk menyambut kehadiran sang buah hati.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {packages.map((pkg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col bg-card rounded-[2.5rem] p-10 relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border ${pkg.isPopular ? "border-rose-500 shadow-xl md:scale-105 z-10" : "border-border/60"}`}
                            >
                                {pkg.isPopular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                                        Paling Diminati
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{pkg.description}</p>
                                </div>
                                <div className="mb-10">
                                    <p className="text-3xl font-black text-rose-600">{pkg.price}</p>
                                    <p className="text-xs text-muted-foreground mt-1">*Syarat & ketentuan berlaku</p>
                                </div>
                                <div className="space-y-4 mb-10 flex-grow">
                                    {pkg.includes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className={`w-full h-14 rounded-xl font-bold ${pkg.isPopular ? "bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-none" : "bg-slate-900 dark:bg-slate-800"}`}>
                                    Detail Estimasi Biaya
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Detail */}
            <ServiceSection
                title="Fasilitas Penunjang"
                subtitle="Kenyamanan maksimal untuk proses pemulihan Ibu dan Bayi"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Home, title: "Roommate In", desc: "Bayi dapat tetap berada satu ruangan bersama ibu." },
                        { icon: Stethoscope, title: "Laktasi", desc: "Pendampingan konselor menyusui bersertifikat." },
                        { icon: Gift, title: "Baby Set", desc: "Paket perlengkapan bayi untuk kepulangan." },
                        { icon: Users, title: "Penyuluhan", desc: "Edukasi perawatan bayi baru lahir bagi orang tua." },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-card border border-border/40 p-8 rounded-3xl hover:border-rose-500/30 transition-all flex flex-col items-center text-center">
                            <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
                                <item.icon className="h-7 w-7" />
                            </div>
                            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Bicarakan Persalinan Impian Anda"
                subtitle="Daftar ke Poli Kandungan untuk konsultasi awal rencana persalinan syar'i."
                primaryAction={{
                    label: "Booking Jadwal Dokter",
                    icon: "calendar",
                    href: "/doctors?specialty=kandungan"
                }}
            />
        </div>
    );
};
