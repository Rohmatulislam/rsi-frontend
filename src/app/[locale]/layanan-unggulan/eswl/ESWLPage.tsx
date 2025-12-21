"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { Waves, Shield, Clock, Pill, Zap, CheckCircle } from "lucide-react";

const benefits = [
    {
        icon: Shield,
        title: "Tanpa Operasi",
        description: "Tidak memerlukan sayatan atau anestesi umum",
        color: "primary" as const,
    },
    {
        icon: Clock,
        title: "Rawat Jalan",
        description: "Prosedur selesai dalam 30-60 menit, langsung pulang",
        color: "success" as const,
    },
    {
        icon: Zap,
        title: "Hasil Efektif",
        description: "Tingkat keberhasilan tinggi untuk batu berukuran kecil-sedang",
        color: "purple" as const,
    },
    {
        icon: Pill,
        title: "Pemulihan Cepat",
        description: "Kembali beraktivitas normal dalam 1-2 hari",
        color: "cyan" as const,
    },
];

const processSteps = [
    { step: 1, title: "Konsultasi", description: "Pemeriksaan oleh dokter urologi dan CT Scan/USG untuk menentukan lokasi dan ukuran batu" },
    { step: 2, title: "Persiapan", description: "Pasien berbaring di meja ESWL, batu diposisikan menggunakan panduan fluoroskopi/USG" },
    { step: 3, title: "Prosedur", description: "Gelombang kejut diarahkan ke batu untuk menghancurkannya menjadi fragmen kecil" },
    { step: 4, title: "Pasca Tindakan", description: "Fragmen batu akan keluar secara alami melalui urine dalam beberapa hari/minggu" },
];

const indications = [
    "Batu ginjal berukuran 5-20 mm",
    "Batu ureter bagian atas",
    "Batu yang tidak merespon pengobatan konservatif",
    "Pasien yang tidak cocok untuk operasi terbuka",
];

const contraindications = [
    "Kehamilan",
    "Gangguan pembekuan darah",
    "Infeksi saluran kemih aktif",
    "Obstruksi total saluran kemih",
];

export const ESWLPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN UNGGULAN"
                title="ESWL"
                highlightText="Hancurkan Batu Tanpa Operasi"
                subtitle="Extracorporeal Shock Wave Lithotripsy - Penghancuran batu ginjal menggunakan gelombang kejut dari luar tubuh"
            />

            {/* Benefits */}
            <ServiceSection
                title="Keunggulan ESWL"
                subtitle="Metode non-invasif untuk mengatasi batu ginjal"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color={benefit.color}
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* How it works */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Bagaimana ESWL Bekerja?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Proses penghancuran batu ginjal dengan gelombang kejut
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-4">
                            {processSteps.map((item) => (
                                <div key={item.step} className="flex gap-4 bg-card border rounded-xl p-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Indications & Contraindications */}
            <ServiceSection title="Indikasi & Kontraindikasi">
                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 text-green-600 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Indikasi
                        </h3>
                        <ul className="space-y-2">
                            {indications.map((item, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 text-red-600 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Kontraindikasi
                        </h3>
                        <ul className="space-y-2">
                            {contraindications.map((item, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Konsultasi dengan Dokter Urologi"
                subtitle="Konsultasikan kondisi batu ginjal Anda dengan dokter spesialis urologi"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin konsultasi tentang ESWL",
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Lihat Dokter Urologi",
                    href: "/doctors?specialty=urologi",
                }}
            />
        </div>
    );
};
