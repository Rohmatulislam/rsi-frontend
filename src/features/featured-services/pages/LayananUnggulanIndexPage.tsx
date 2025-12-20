"use client";

import { ServiceHero, ServiceSection } from "~/features/services";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Zap, Globe, Clock, Trophy } from "lucide-react";
import { Button } from "~/components/ui/button";

// Assets
import bedahImg from "~/assets/layanan-unggulan/bedah-minimal-invasif.png";
import eswlImg from "~/assets/layanan-unggulan/eswl.png";
import persalinanImg from "~/assets/layanan-unggulan/persalinan-syari.png";
import executiveImg from "~/assets/layanan-unggulan/executive.png";

const layananUnggulan = [
    {
        slug: "bedah-minimal-invasif",
        image: bedahImg,
        title: "Bedah Minimal Invasif",
        description: "Teknik operasi modern dengan sayatan kecil, pemulihan lebih cepat, dan risiko komplikasi minimal menggunakan teknologi laparoskopi terbaru.",
        features: ["Laparoskopi", "Endoskopi", "Artroskopi"],
        icon: Zap,
        color: "from-blue-500/20 to-blue-600/5",
    },
    {
        slug: "eswl",
        image: eswlImg,
        title: "ESWL (Batu Ginjal)",
        description: "Penghancuran batu ginjal tanpa operasi menggunakan gelombang kejut (Shock Wave) dari luar tubuh. Aman, efektif, dan tanpa rawat inap.",
        features: ["Tanpa Operasi", "Rawat Jalan", "Hasil Efektif"],
        icon: Sparkles,
        color: "from-teal-500/20 to-teal-600/5",
    },
    {
        slug: "persalinan-syari",
        image: persalinanImg,
        title: "Persalinan Syar'i",
        description: "Proses persalinan yang mengutamakan privasi dan nilai-nilai Islami bagi ibu dan keluarga, didampingi tenaga medis wanita profesional.",
        features: ["Privasi Terjaga", "Tenaga Medis Wanita", "Ruang Nyaman"],
        icon: Heart,
        color: "from-rose-500/20 to-rose-600/5",
    },
    {
        slug: "executive",
        image: executiveImg,
        title: "Layanan Eksekutif",
        description: "Pelayanan premium dengan fasilitas eksklusif, ruang tunggu lounge, dan dokter-dokter senior berpengalaman untuk kenyamanan Anda.",
        features: ["Ruang Tunggu Ekslusif", "Prioritas Layanan", "Fasilitas Premium"],
        icon: Trophy,
        color: "from-amber-500/20 to-amber-600/5",
    },
];

export const LayananUnggulanIndexPage = () => {
    return (
        <div className="min-h-screen pb-24">
            <ServiceHero
                badge="CENTER OF EXCELLENCE"
                title="Layanan Unggulan"
                highlightText="Inovasi Medis Terbaik"
                subtitle="RSI Siti Hajar menghadirkan layanan kesehatan premium dengan teknologi medis mutakhir dan tim dokter ahli untuk memberikan hasil perawatan terbaik."
            />

            {/* Why Choose Our Centers */}
            <div className="container mx-auto px-4 -mt-10 mb-24 relative z-10">
                <div className="bg-card border rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-32 -mt-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {[
                            { icon: Globe, label: "Teknologi Modern", desc: "Peralatan medis standar internasional" },
                            { icon: Clock, label: "Pemulihan Cepat", desc: "Prosedur dengan downtime minimal" },
                            { icon: ShieldCheck, label: "Keamanan Pasien", desc: "Protokol medis yang ketat & teruji" },
                            { icon: Trophy, label: "Tim Spesialis", desc: "Dokter berpengalaman di bidangnya" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center px-4">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">{item.label}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ServiceSection
                title="Pilihan Layanan Unggulan Kami"
                subtitle="Fasilitas kesehatan terpilih dengan standar pelayanan medis tingkat lanjut."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {layananUnggulan.map((layanan) => (
                        <Link
                            key={layanan.slug}
                            href={`/layanan-unggulan/${layanan.slug}`}
                            className="group"
                        >
                            <div className={`bg-gradient-to-br ${layanan.color} border border-border/40 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col md:flex-row`}>
                                {/* Image Container */}
                                <div className="relative h-64 md:h-auto md:w-2/5 overflow-hidden">
                                    <Image
                                        src={layanan.image}
                                        alt={layanan.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-xl bg-white/50 backdrop-blur-md flex items-center justify-center text-primary shadow-sm">
                                            <layanan.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {layanan.title}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">{layanan.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {layanan.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/20"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center text-primary font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                                        EKSPLOR LAYANAN
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </ServiceSection>

            {/* Bottom CTA */}
            <div className="container mx-auto px-4 mt-20">
                <div className="bg-primary text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-10" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">Ingin Konsultasi Lebih Lanjut?</h2>
                        <p className="text-primary-foreground/80 text-lg mb-10">
                            Tim spesialis kami siap membantu Anda memberikan solusi medis terbaik sesuai dengan kebutuhan kesehatan Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="rounded-2xl h-16 px-10 text-lg font-bold" asChild>
                                <Link href="/doctors">
                                    Pilih Dokter Spesialis
                                </Link>
                            </Button>
                            <Button size="lg" className="bg-white/10 hover:bg-white/20 border-white/20 rounded-2xl h-16 px-10 text-lg font-bold" asChild>
                                <a href="https://wa.me/6281234567890">
                                    Hubungi Center
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
