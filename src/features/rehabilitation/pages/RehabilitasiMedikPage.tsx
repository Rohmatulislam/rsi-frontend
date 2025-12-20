"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    HeartPulse, Brain, Baby, Bone, Dumbbell, MessageSquare,
    ChevronRight, ArrowRight, Activity, Zap, CheckCircle2,
    Users, Clock, ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

const therapyServices = [
    {
        icon: Dumbbell,
        title: "Fisioterapi",
        description: "Terapi pemulihan fungsi gerak, kekuatan otot, dan manajemen nyeri sendi.",
    },
    {
        icon: MessageSquare,
        title: "Terapi Wicara",
        description: "Penanganan gangguan bicara, bahasa, serta gangguan menelan pada anak & dewasa.",
    },
    {
        icon: Brain,
        title: "Terapi Okupasi",
        description: "Melatih kemandirian dalam aktivitas sehari-hari melalui latihan fungsional khusus.",
    },
    {
        icon: Baby,
        title: "Pediatrik Rehab",
        description: "Stimulasi tumbuh kembang anak untuk mencapai potensi optimal pertumbuhannya.",
    },
];

const conditions = [
    "Stroke dan Pasca Gangguan Otak",
    "Cedera Olahraga & Trauma Muskulo",
    "Saraf Terjepit (HNP) & Nyeri Punggung",
    "Pasca Operasi Tulang & Bedah Saraf",
    "Keterlambatan Bicara (Speech Delay)",
    "Gangguan Perkembangan Sensorik Anak",
];

export const RehabilitasiMedikPage = () => {
    return (
        <div className="min-h-screen pb-24">
            <ServiceHero
                badge="REHABILITASI MEDIK"
                title="Rehabilitasi Medik"
                highlightText="Pulihkan Fungsi & Kualitas Hidup"
                subtitle="Dukungan terapi komprehensif oleh tim dokter Spesialis Kedokteran Fisik dan Rehabilitasi (Sp.KFR) untuk membantu Anda kembali aktif."
            />

            {/* Premium Highlight Card */}
            <div className="container mx-auto px-4 -mt-10 relative z-10 mb-20">
                <div className="bg-card border rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden border-primary/20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-bl-full -mr-20 -mt-20 blur-3xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">Comprehensive Rehab</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Pendekatan Holistik Untuk Pemulihan</h2>
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                Kami mengintegrasikan teknologi terapi terbaru dengan pendampingan personal untuk memastikan setiap pasien mencapai kemajuan sesuai target rehabilitasi yang ditetapkan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <AppointmentBookingModal
                                    initialPoliId="rehab-medik"
                                    trigger={
                                        <Button size="lg" className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-lg font-bold gap-3 shadow-xl shadow-primary/20">
                                            Booking Konsultasi <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    }
                                />
                                <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 border-primary/20 text-primary font-bold text-lg" asChild>
                                    <Link href="/doctors?specialty=rehabilitasi">
                                        Eksplor Dokter Spesialis
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Activity, label: "Modern Equipment", val: "Alat Terapi Canggih" },
                                { icon: Users, label: "Professional Team", val: "Terapis Berlisensi" },
                                { icon: Zap, label: "Tailored Plan", val: "Program Terpersonalisasi" },
                                { icon: ClipboardList, label: "Progress Tracking", val: "Evaluasi Rutin" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary mb-4">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{item.label}</p>
                                    <p className="font-bold text-sm">{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Grid */}
            <ServiceSection
                title="Layanan Terapi Unggulan"
                subtitle="Metode terapi beragam untuk menangani berbagai keterbatasan fungsi tubuh."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {therapyServices.map((service) => (
                        <div key={service.title} className="bg-card border border-border/60 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all group hover:-translate-y-2">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <service.icon className="h-8 w-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            {/* Conditions Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-border/40">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Kondisi Medis Yang Kami Tangani</h2>
                            <p className="text-muted-foreground text-lg mb-12">
                                Rehabilitasi medik berperan penting dalam mengembalikan kualitas hidup pada berbagai kondisi penyakit saraf, otot, dan tulang.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {conditions.map((condition, index) => (
                                    <div key={index} className="flex items-center gap-4 p-5 bg-card border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />
                                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{condition}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-card border rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
                            <h3 className="text-2xl font-bold mb-8">Informasi Kedatangan</h3>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Jam Layanan</h4>
                                        <p className="text-sm text-muted-foreground">Senin - Jumat: 08.00 - 16.00 WITA</p>
                                        <p className="text-sm text-muted-foreground">Sabtu: 08.00 - 12.00 WITA</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                                        <ClipboardList className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Pendaftaran Terapi</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed pr-4">Pasien disarankan membawa surat rujukan dari dokter Spesialis (Neurologi/Ortopedi) atau melakukan konsultasi langsung dengan dokter Sp.KFR kami.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Mulai Perjalanan Pemulihan Anda"
                subtitle="Setiap langkah kecil adalah progres besar untuk kemandirian Anda. Konsultasikan jadwal terapi Anda sekarang."
                primaryAction={{
                    label: "Reservasi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang layanan rehabilitasi medik",
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};
