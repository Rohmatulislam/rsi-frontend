"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    Scissors, Stethoscope, Clock, Shield, Heart, Activity,
    Bone, Baby, ChevronRight, CheckCircle, ArrowRight,
    Sparkles, Microscope, Layers
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

const benefits = [
    {
        icon: Scissors,
        title: "Sayatan Minimal",
        description: "Luka sayatan kecil (0.5-1.5 cm) sehingga trauma jaringan labih rendah.",
        color: "primary" as const,
    },
    {
        icon: Clock,
        title: "Pemulihan Cepat",
        description: "Masa rawat inap lebih singkat dan kembali beraktivitas jauh lebih cepat.",
        color: "success" as const,
    },
    {
        icon: Shield,
        title: "Risiko Rendah",
        description: "Risiko infeksi pasca operasi dan perdarahan jauh lebih rendah dibanding bedah terbuka.",
        color: "cyan" as const,
    },
    {
        icon: Heart,
        title: "Nyeri Minimal",
        description: "Rasa nyeri pasca operasi yang jauh lebih ringan bagi kenyamanan pasien.",
        color: "rose" as const,
    },
];

const procedures = [
    {
        icon: Activity,
        title: "Laparoskopi",
        description: "Pembedahan organ perut (Usus Buntu, Empedu, Hernia) dengan panduan kamera mini.",
    },
    {
        icon: Microscope,
        title: "Endoskopi",
        description: "Tindakan diagnostik dan terapeutik pada saluran pencernaan tanpa pembedahan.",
    },
    {
        icon: Bone,
        title: "Artroskopi",
        description: "Khusus untuk penanganan sendi (Lutut, Bahu) dengan ketepatan tinggi.",
    },
    {
        icon: Baby,
        title: "Ginekologi",
        description: "Prosedur reproduksi wanita (Kista, Mioma) dengan presisi ekstrim.",
    },
];

export const BedahMinimalInvasifPage = () => {
    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="CENTER OF EXCELLENCE"
                title="Bedah Minimal Invasif"
                highlightText="Teknologi Bedah Mutakhir"
                subtitle="Inovasi pembedahan modern yang mengutamakan keamanan pasien melalui teknik minimal sayatan untuk pemulihan yang lebih cepat dan nyaman."
            />

            {/* Quick Consultation Section */}
            <div className="container mx-auto px-4 -mt-10 relative z-10 mb-24">
                <div className="bg-card border rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border-primary/20">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Layers className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Konsultasikan Tindakan Bedah</h3>
                            <p className="text-muted-foreground text-sm">Diskusikan opsi bedah minimal invasif dengan spesialis kami.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <AppointmentBookingModal
                            initialPoliId="bedah-umum"
                            trigger={
                                <Button size="lg" className="flex-1 md:flex-none px-10 h-14 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                                    Booking Janji Temu <ArrowRight className="h-4 w-4" />
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <ServiceSection
                title="Keunggulan Utama"
                subtitle="Mengapa teknik bedah minimal invasif menjadi pilihan utama di era kedokteran modern."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="bg-card border rounded-3xl p-8 hover:shadow-xl transition-all group border-border/40">
                            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <benefit.icon className="h-6 w-6" />
                            </div>
                            <h4 className="text-lg font-bold mb-3">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            {/* Types Workflow */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-border/40">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <Sparkles className="h-12 w-12 text-primary mb-6" />
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 italic">Berbagai Jenis Pembedahan Minimal</h2>
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                Kami menghadirkan standar emas dalam layanan bedah untuk berbagai spesialisasi, memastikan Anda mendapatkan perawatan paling presisi dengan trauma minimal.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Peralatan Video High Definition (HD)",
                                    "Kamera Mikro & Serat Optik Fleksibel",
                                    "Monitor Resolusi Tinggi 4K",
                                    "Instrumen Mikro Bedah Presisi"
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 text-sm font-bold">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {procedures.map((proc, idx) => (
                                <div key={idx} className="bg-card border rounded-3xl p-8 hover:shadow-2xl transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12" />
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <proc.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3">{proc.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{proc.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <ServiceSection title="Efisiensi Pemulihan">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-card border rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        <div className="flex-1 p-10 border-b md:border-b-0 md:border-r border-border/40">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-xl text-green-600">Bedah Minimal Invasif</h3>
                            </div>
                            <ul className="space-y-5">
                                {[
                                    { l: "Sayatan", v: "Sangat Kecil (0.5 - 1.5 cm)" },
                                    { l: "Rawat Inap", v: "Singkat (1 - 2 Hari)" },
                                    { l: "Nyeri", v: "Minimal & Terkendali" },
                                    { l: "Aktivitas", v: "Kembali Normal dlm 1 Minggu" },
                                ].map((item, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{item.l}</span>
                                        <span className="font-bold text-primary">{item.v}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 p-10 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 text-white flex items-center justify-center">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-xl text-muted-foreground">Operasi Konvensional</h3>
                            </div>
                            <ul className="space-y-5 opacity-60">
                                {[
                                    { l: "Sayatan", v: "Besar (10 - 20 cm)" },
                                    { l: "Rawat Inap", v: "Lama (5 - 7 Hari)" },
                                    { l: "Nyeri", v: "Signifikan" },
                                    { l: "Aktivitas", v: "Pemulihan 4 - 6 Minggu" },
                                ].map((item, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm italic">
                                        <span className="">{item.l}</span>
                                        <span className="font-medium">{item.v}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Siapkan Rencana Operasi Anda"
                subtitle="Dapatkan informasi rincian biaya dan prosedur bersama tim konsultan medis kami."
                primaryAction={{
                    label: "Hubungi Tim Bedah",
                    icon: "whatsapp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang bedah minimal invasif"
                }}
            />
        </div>
    );
};
