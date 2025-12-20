"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
    Crown, UserCheck, Clock, Sparkles, Coffee, Car,
    ArrowRight, Gem, Award, ShieldCheck, CheckCircle2
} from "lucide-react";
import { Badge } from "~/components/ui/badge";

export const ExecutivePage = () => {
    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="PREMIUM EXPERIENCE"
                title="Layanan Executive"
                highlightText="Eksklusivitas Dalam Kesembuhan"
                subtitle="RSI Siti Hajar menghadirkan standar pelayanan medis premium yang menggabungkan keahlian dokter spesialis senior dengan kenyamanan fasilitas bintang lima."
            />

            {/* Core Values / Premium Highlights */}
            <div className="container mx-auto px-4 -mt-10 relative z-10 mb-20">
                <div className="bg-slate-900 border-none rounded-[3rem] p-10 md:p-14 shadow-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative items-center">
                        <div className="lg:col-span-1">
                            <Badge className="mb-6 bg-amber-500 text-white border-none py-1.5 px-4 uppercase tracking-[0.2em] text-[10px] font-black">Standard Excellence</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 italic leading-tight">Privasi & Prioritas Tanpa Kompromi</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Kami mendedikasikan waktu dan perhatian penuh untuk memastikan setiap langkah perjalanan medis Anda terasa personal dan efisien.
                            </p>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Crown, title: "Lounge Eksklusif", desc: "Ruang tunggu privat dengan refreshment premium." },
                                { icon: Award, title: "Pakar Senior", desc: "Konsultasi langsung dengan dokter spesialis utama." },
                                { icon: Clock, title: "Zero Waiting", desc: "Alur pelayanan prioritas tanpa antrean umum." },
                                { icon: UserCheck, title: "Personal Liaison", desc: "Pendampingan khusus selama kunjungan medis." },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm group hover:bg-white/10 transition-all">
                                    <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Services Section */}
            <ServiceSection
                title="Fasilitas & Keunggulan"
                subtitle="Nikmati kemudahan akses kesehatan dengan sentuhan kenyamanan maksimal."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        {[
                            { t: "Executive Lounge", d: "Nikmati kenyamanan menunggu dalam lounge yang tenang dengan fasilitas snack, kopi, dan WiFi berkecepatan tinggi." },
                            { t: "Fast Track Pharmacy", d: "Layanan pengambilan obat yang diprioritaskan, tidak perlu antre di loket farmasi umum." },
                            { t: "Convenient Parking", d: "Area parkir khusus yang terletak sangat dekat dengan pintu masuk lobby executive." },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                                <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-1 font-black text-xs">
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2 group-hover:text-amber-600 transition-colors">{item.t}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{item.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/20 dark:to-slate-900 rounded-[3rem] border border-amber-200/30 overflow-hidden flex items-center justify-center p-12">
                            <Gem className="h-40 w-40 text-amber-500 opacity-20 absolute -bottom-10 -right-10 rotate-12" />
                            <div className="relative text-center">
                                <Award className="h-20 w-20 text-amber-500 mx-auto mb-8 animate-pulse" />
                                <h3 className="text-2xl font-black mb-4">Dedicated Team</h3>
                                <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">Setiap pasien executive didampingi secara personal oleh perawat senior dan tim concierge kami.</p>
                                <Button className="bg-slate-900 hover:bg-amber-600 transition-all rounded-full px-10 h-14" asChild>
                                    <Link href="/doctors?executive=true">
                                        Lihat Spesialis Executive
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            {/* Bottom Special CTA */}
            <div className="container mx-auto px-4 mt-20">
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] p-12 md:p-20 text-center border border-border/40 relative">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 italic">Pesan Layanan Anda Hari Ini</h2>
                        <p className="text-muted-foreground text-lg mb-12">
                            Ingin bertanya lebih detail atau menjadwalkan kunjungan eksekutif Anda? Tim concierge kami siap melayani Anda 24/7.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl h-16 px-10 text-lg font-bold shadow-xl shadow-amber-200 dark:shadow-none" asChild>
                                <a href="https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang layanan Executive">
                                    <ShieldCheck className="mr-3 h-6 w-6" /> Hubungi Concierge
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
