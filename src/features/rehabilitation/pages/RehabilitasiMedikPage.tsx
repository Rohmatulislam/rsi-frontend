"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    HeartPulse, Brain, Baby, Bone, Dumbbell, MessageSquare,
    ChevronRight, ArrowRight, Activity, Zap, CheckCircle2,
    Users, Clock, ClipboardList, Stethoscope, UserCheck,
    Home, BarChart3
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

import { useState } from "react";
import { useGetRehabProgress } from "~/features/rehabilitation/api/getRehabProgress";

const therapyServices = [
    {
        icon: Dumbbell,
        title: "Fisioterapi",
        description: "Pemulihan gerak dan kekuatan otot menggunakan manual therapy & modalitas alat.",
    },
    {
        icon: MessageSquare,
        title: "Terapi Wicara",
        description: "Penanganan gangguan bicara, bahasa, suara, dan gangguan menelan.",
    },
    {
        icon: Brain,
        title: "Terapi Okupasi",
        description: "Pelatihan aktivitas mandiri pasca cedera untuk kembali ke produktivitas normal.",
    },
    {
        icon: Baby,
        title: "Pediatrik Rehab",
        description: "Layanan stimulasi tumbuh kembang anak khusus (ABK) dan speech delay.",
    },
];

const journeySteps = [
    {
        icon: Stethoscope,
        title: "Konsultasi Dokter Sp.KFR",
        desc: "Asesmen medis awal untuk menentukan diagnosis fungsional."
    },
    {
        icon: ClipboardList,
        title: "Program Terapi khusus",
        desc: "Penyusunan rencana terapi (Exercise, Modalitas, atau Alat bantu)."
    },
    {
        icon: UserCheck,
        title: "Pelaksanaan Terapi",
        desc: "Sesi terapi rutin oleh Fisioterapis/Okupasi Terapis handal."
    },
    {
        icon: BarChart3,
        title: "Evaluasi Progres",
        desc: "Peninjauan berkala untuk memastikan target pemulihan tercapai."
    }
];

const specialties = [
    { title: "Neuro Rehabilitasi", desc: "Pasca Stroke, Parkinson, Cedera Saraf.", icon: Activity },
    { title: "Muskuloskeletal", desc: "Nyeri Punggung (HNP), Osteoartritis, Cedera Otot.", icon: Bone },
    { title: "Rehabilitasi Anak", desc: "Cerebral Palsy, Down Syndrome, Keterlambatan Gerak.", icon: Baby },
    { title: "Home-Care Service", desc: "Layanan kunjungan terapis langsung ke rumah pasien.", icon: Home },
];

export const RehabilitasiMedikPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [identifier, setIdentifier] = useState("");
    const { data: progress, isLoading, isError } = useGetRehabProgress({ identifier });

    return (
        <div className="min-h-screen pb-24">
            <ServiceHero
                badge="Premium Rehabilitation Center"
                title="Rehabilitasi"
                highlightText="Kembali Beraktivitas Tanpa Batas"
                subtitle="Layanan kedokteran fisik yang berfokus pada pemulihan kemandirian pasien melalui pendekatan multidisiplin yang terukur."
            />

            {/* Patient Journey - Modern Hospital Flow */}
            <div className="container mx-auto px-4 -mt-16 relative z-10 mb-28">
                <div className="bg-white dark:bg-slate-900 border rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-full -mr-20 hidden lg:block" />

                    <div className="relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <Badge className="mb-4 bg-primary/10 text-primary border-none px-4 py-1 font-bold">Patient Journey</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Alur Layanan Kami</h2>
                            <p className="text-muted-foreground text-lg">
                                Proses rehabilitasi yang terstruktur memastikan setiap pasien mendapatkan penanganan yang tepat sasaran.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                            {/* Connector line for large screens */}
                            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />

                            {journeySteps.map((step, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                    <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 shadow-xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform bg-gradient-to-br from-white to-slate-50">
                                        <step.icon className="h-10 w-10" />
                                    </div>
                                    <h4 className="font-bold text-xl mb-3 tracking-tight">{step.title}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-center gap-8">
                            <AppointmentBookingModal
                                initialPoliId="rehab-medik"
                                trigger={
                                    <Button size="lg" className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-lg font-bold gap-3 shadow-xl shadow-primary/20">
                                        Jadwalkan Asesmen <ArrowRight className="h-5 w-5" />
                                    </Button>
                                }
                            />
                            <div className="flex items-center gap-3 font-bold text-slate-500">
                                <Clock className="h-5 w-5 text-blue-500" /> Estimasi Asesmen: 30-45 Menit
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Services Grid */}
            <ServiceSection
                title="Layanan Terapi Unggulan"
                subtitle="Dukungan alat modern dan terapis berpengalaman untuk berbagai kebutuhan rehabilitasi."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {therapyServices.map((service) => (
                        <div key={service.title} className="group bg-card border hover:border-primary/20 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all hover:-translate-y-2">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <service.icon className="h-8 w-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">{service.title}</h4>
                            <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            {/* Rehab Progress Tracking (SIMRS Integrated) */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Lacak Progres Terapi</h2>
                    <p className="text-muted-foreground">Masukkan Nomor RM atau Nomor Rawat untuk melihat riwayat program terapi Anda.</p>
                </div>
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white dark:bg-slate-900 border rounded-[2.5rem] p-8 md:p-12 shadow-xl border-primary/10">
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Nomor Rekam Medis / Nomor Rawat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 h-14 px-6 rounded-2xl border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                            />
                            <Button
                                onClick={() => setIdentifier(searchQuery)}
                                disabled={isLoading}
                                className="h-14 px-10 rounded-2xl font-bold"
                            >
                                {isLoading ? "Mencari..." : "Cek Progres"}
                            </Button>
                        </div>

                        {progress && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-primary/5 rounded-[2rem] border border-primary/20">
                                    <div className="space-y-4 text-left">
                                        <Badge className="bg-primary">{progress.status_program || 'AKTIF'}</Badge>
                                        <h3 className="text-2xl font-bold">{progress.nama_pasien}</h3>
                                        <p className="text-sm text-muted-foreground">Diagnosa: {progress.diagnosa}</p>
                                    </div>
                                    <div className="space-y-4 text-left md:border-l md:pl-8 border-primary/10">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <UserCheck className="h-4 w-4 text-primary" /> Dr. {progress.dokter}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <Clock className="h-4 w-4 text-primary" /> Update: {new Date(progress.tanggal_terakhir).toLocaleDateString('id-ID')}
                                        </div>
                                        <p className="text-sm italic text-muted-foreground mt-2">"{progress.evaluasi}"</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5 text-primary" /> Riwayat Sesi Terapi
                                    </h4>
                                    <div className="space-y-3">
                                        {progress.programs.length > 0 ? progress.programs.map((p: { program: string, keterangan: string, tanggal: string }, i: number) => (
                                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border flex justify-between items-center group hover:border-primary/30 transition-colors">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">{p.program}</p>
                                                    <p className="text-xs text-muted-foreground">{p.keterangan}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-primary">{new Date(p.tanggal).toLocaleDateString('id-ID')}</p>
                                                    <Badge variant="outline" className="text-[10px] scale-75 origin-right">Selesai</Badge>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-10 text-center text-muted-foreground bg-slate-50 rounded-2xl border-dashed border-2">
                                                Belum ada detail sesi tercatat di SIMRS.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {isError && (
                            <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                                Data rehabilitasi tidak ditemukan. Pastikan nomor yang dimasukkan benar atau silakan hubungi Customer Service.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Special Programs Section */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5">
                            <Badge className="bg-primary text-white border-none mb-6">RS Standard Modern</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Program Khusus & Berkelanjutan</h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                Kami menyediakan program rehabilitasi yang dirancang khusus sesuai dengan kebutuhan klinis pasien pasca perawatan intensif di rumah sakit.
                            </p>
                            <div className="space-y-6">
                                {[
                                    "Peralatan Terapi Robotik (Segera)",
                                    "E-Evaluasi Progres Pasien (Mobile App)",
                                    "Terapi Komunitas Pasca Stroke",
                                    "Tele-Rehab Consultation"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {specialties.map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/20 transition-colors">
                                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                                        <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                                    <p className="text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <div className="mt-12">
                <ServiceCTA
                    title="Konsultasikan Pemulihan Anda"
                    subtitle="Tanyakan jadwal dokter Sp.KFR atau koordinasikan jadwal terapi ulang via tim administrasi kami."
                    primaryAction={{
                        label: "Koordinasi via WhatsApp",
                        href: "https://wa.me/6281234567890?text=Halo, saya ingin menjadwalkan terapi rehabilitasi medik",
                        icon: "whatsapp",
                    }}
                />
            </div>
        </div>
    );
};
