"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import {
    Waves, Shield, Clock, Pill, Zap, CheckCircle,
    Stethoscope, Info, AlertTriangle, ArrowRight,
    CalendarCheck, ClipboardList
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

const benefits = [
    {
        icon: Shield,
        title: "Tanpa Operasi",
        description: "Metode canggih yang menghancurkan batu tanpa memerlukan sayatan bedah sedikitpun.",
        color: "primary" as const,
    },
    {
        icon: Clock,
        title: "Efisien & Cepat",
        description: "Prosedur selesai dalam 30-60 menit dan pasien bisa langsung pulang di hari yang sama.",
        color: "success" as const,
    },
    {
        icon: Zap,
        title: "Hasil Akurat",
        description: "Tingkat keberhasilan tinggi untuk batu berukuran kecil hingga sedang (5-20 mm).",
        color: "accent" as const,
    },
    {
        icon: Pill,
        title: "Minimal Downtime",
        description: "Pasien dapat kembali beraktivitas normal biasanya dalam waktu 1-2 hari saja.",
        color: "purple" as const,
    },
];

const processSteps = [
    { step: "01", title: "Konsultasi & Diagnosa", description: "Pemeriksaan fisik oleh dokter urologi dan penunjang medis (CT Scan/USG) untuk pemetaan lokasi batu." },
    { step: "02", title: "Persiapan Pasien", description: "Pasien berbaring di meja ESWL khusus, lokasi batu dipantau secara real-time via USG atau Fluoroskopi." },
    { step: "03", title: "Proses Fragmentasi", description: "Gelombang kejut (shock wave) diarahkan presisi ke target untuk memecah batu menjadi butiran halus." },
    { step: "04", title: "Evaluasi Akhir", description: "Butiran batu akan keluar secara alami melalui urine. Dokter akan memberikan panduan pasca tindakan." },
];

export const ESWLPage = () => {
    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="LAYANAN UNGGULAN"
                title="ESWL"
                highlightText="Bebas Batu Tanpa Bedah"
                subtitle="Layanan Extracorporeal Shock Wave Lithotripsy - Solusi modern penghancur batu ginjal menggunakan energi gelombang kejut dari luar tubuh."
            />

            {/* Quick Consultation Section */}
            <div className="container mx-auto px-4 -mt-10 relative z-10 mb-20">
                <div className="bg-card border rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border-primary/10">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarCheck className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Jadwalkan Konsultasi Urologi</h3>
                            <p className="text-muted-foreground text-sm">Temukan solusi terbaik untuk masalah batu saluran kemih Anda.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <AppointmentBookingModal
                            initialPoliId="urologi"
                            serviceItem={{ id: "eswl", name: "ESWL" }}
                            trigger={
                                <Button size="lg" className="flex-1 md:flex-none px-10 h-14 rounded-xl gap-2">
                                    Booking Janji Temu <ArrowRight className="h-4 w-4" />
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <ServiceSection
                title="Keunggulan Metode ESWL"
                subtitle="Teknologi minimal invasif yang menjadi standar utama penanganan batu ginjal non-operasi."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="bg-card border rounded-3xl p-8 hover:shadow-xl transition-all group">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <benefit.icon className="h-6 w-6" />
                            </div>
                            <h4 className="text-lg font-bold mb-3">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </ServiceSection>

            {/* Workflow / Steps */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <BadgeCheck className="h-12 w-12 text-primary mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tahapan Prosedur ESWL</h2>
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                Kami memastikan setiap tahapan dilakukan dengan presisi tinggi dan pemantauan ketat oleh dokter spesialis urologi berpengalaman.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-card border rounded-xl">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="font-bold text-sm">One Day Care</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-card border rounded-xl">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="font-bold text-sm">Persiapan Minimal</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {processSteps.map((item) => (
                                <div key={item.step} className="flex gap-6 p-6 bg-card border rounded-2xl group hover:border-primary/30 transition-all shadow-sm">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-all italic">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Indications & Contraindications */}
            <ServiceSection title="Kesesuaian Tindakan">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-xl">Indikasi Tindakan</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Batu ginjal berukuran 5-20 mm",
                                "Batu ureter bagian atas yang terdeteksi",
                                "Pasien dengan risiko operasi tinggi",
                                "Kondisi batu yang tidak kalsifikasi berat"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm font-medium">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-xl">Kontraindikasi</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Ibu sedang dalam kondisi hamil",
                                "Memiliki gangguan pembekuan darah",
                                "Mengalami infeksi saluran kemih (ISK) akut",
                                "Obstruksi/pemampatan total saluran kemih"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm font-medium">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Punya Masalah Batu Ginjal?"
                subtitle="Jangan tunggu sampai nyeri bertambah parah. Konsultasikan dengan tim Urologi kami hari ini."
                primaryAction={{
                    label: "Booking Konsultasi Sekarang",
                    icon: "calendar",
                    href: "/doctors?specialty=urologi"
                }}
            />
        </div>
    );
};

// Help helper for icons used but not imported
function BadgeCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
