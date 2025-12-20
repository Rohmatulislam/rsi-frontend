"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
    ArrowRight, Stethoscope, Activity, Heart, Shield, Star,
    Search, Clock, Calendar, Users, MapPin, BadgeCheck
} from "lucide-react";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { ServicePageSkeleton, ServiceHeroSkeleton, ServiceStatsSkeleton } from "~/components/shared/ServicePageSkeleton";

const iconMap: Record<string, any> = {
    Stethoscope,
    Activity,
    Heart,
    Shield,
    Star
};

export const RawatJalanPage = () => {
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'rawat-jalan' });
    const [searchQuery, setSearchQuery] = useState("");

    if (isLoading) {
        return (
            <div className="min-h-screen pb-20">
                <ServiceHeroSkeleton />
                <ServiceStatsSkeleton />
                <div className="container mx-auto px-4 py-12">
                    <ServicePageSkeleton variant="grid" itemCount={8} />
                </div>
            </div>
        );
    }

    const clinics = (service?.items?.length ? service.items : []).filter(item => item.isActive);

    const filteredClinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (clinic.description && clinic.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const operatingHours = [
        { day: "Senin - Jumat", hours: "08.00 - 20.00 WITA", status: "Buka" },
        { day: "Sabtu", hours: "08.00 - 14.00 WITA", status: "Buka" },
        { day: "Minggu & Hari Libur", hours: "Tutup (IGD 24 Jam)", status: "Libur" },
    ];

    return (
        <div className="min-h-screen pb-20">
            <ServiceHero
                badge="LAYANAN RAWAT JALAN"
                title={service?.title || service?.name || "Rawat Jalan"}
                highlightText={service?.subtitle || "Berbagai Poliklinik Spesialis"}
                subtitle={service?.description || "Layanan pemeriksaan dan konsultasi dengan dokter spesialis dari berbagai bidang keahlian didukung fasilitas modern."}
            />

            {/* Quick Search & Stats */}
            <div className="container mx-auto px-4 -mt-10 mb-16 relative z-10">
                <div className="bg-card border rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex-1 w-full max-w-lg">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Cari poliklinik atau layanan..."
                                className="pl-12 h-14 rounded-2xl text-lg border-primary/20 focus-visible:ring-primary/30"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-8 text-center sm:text-left">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{clinics.length}+</p>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Poliklinik</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-l pl-8 sm:border-l-0 sm:pl-0 lg:border-l lg:pl-8">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <BadgeCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">50+</p>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Dokter Ahli</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Poliklinik Grid */}
            <ServiceSection
                title="Daftar Poliklinik Spesialis"
                subtitle="Pilih poliklinik sesuai dengan kebutuhan kesehatan Anda"
            >
                {filteredClinics.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredClinics.map((item, idx) => {
                            const colors: ("primary" | "cyan" | "rose" | "accent" | "success" | "purple")[] = ["primary", "cyan", "rose", "accent", "success", "purple"];
                            return (
                                <div
                                    key={item.id}
                                    className="group relative bg-card border border-border/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1 h-full flex flex-col"
                                >
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className={`h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                                            <Stethoscope className="h-7 w-7" />
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-grow leading-relaxed">
                                        {item.description || "Layanan konsultasi spesialis dengan tenaga medis profesional dan berpengalaman."}
                                    </p>
                                    <div className="space-y-3">
                                        <Button className="w-full gap-2 rounded-xl h-11" asChild>
                                            <Link href={`/doctors?specialty=${encodeURIComponent(item.name)}`}>
                                                Lihat Jadwal Dokter <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary transition-colors" asChild>
                                            <Link href={`/layanan/poli/${item.id}`}>
                                                Detail Layanan Klinik
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
                        <p className="text-muted-foreground">Tidak menemukan poliklinik "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery("")}>Lihat Semua Poliklinik</Button>
                    </div>
                )}
            </ServiceSection>

            {/* Operating Hours & Flow */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Informasi Kedatangan</h2>
                            <div className="space-y-6">
                                {operatingHours.map((item) => (
                                    <div key={item.day} className="flex items-center justify-between p-6 bg-card border rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-3 w-3 rounded-full ${item.status === "Buka" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                                            <div>
                                                <p className="font-bold">{item.day}</p>
                                                <p className="text-sm text-muted-foreground">{item.hours}</p>
                                            </div>
                                        </div>
                                        <Clock className="h-5 w-5 text-muted-foreground opacity-30" />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                                <div className="flex gap-4">
                                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-primary">Lokasi Poliklinik</p>
                                        <p className="text-sm text-muted-foreground">Tersebar di Lantai Dasar dan Lantai 1 Gedung Rawat Jalan RSI Siti Hajar Mataram.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl -z-10 opacity-30" />
                            <div className="bg-card border rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-[10rem] -mr-10 -mt-10" />
                                <h3 className="text-2xl font-bold mb-8 relative">Langkah Pendaftaran</h3>
                                <div className="space-y-8 relative">
                                    {[
                                        { step: "01", title: "Pilih Poliklinik", desc: "Tentukan poli tujuan sesuai keluhan." },
                                        { step: "02", title: "Cek Jadwal Dokter", desc: "Pilih dokter dan waktu kunjungan." },
                                        { step: "03", title: "Registrasi Online", desc: "Isi data pasien dan kirim booking." },
                                        { step: "04", title: "Dapatkan Tiket", desc: "Tunjukkan tiket QR di RS saat arrival." },
                                    ].map((s, idx) => (
                                        <div key={idx} className="flex gap-6">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black italic">
                                                {s.step}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{s.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Butuh Konsultasi Mendesak?"
                subtitle="Unit Gawat Darurat kami siaga 24 jam untuk menangani kondisi darurat Anda."
                primaryAction={{
                    label: "Hubungi IGD 24 Jam",
                    href: "tel:0370123456",
                    icon: "phone",
                }}
                secondaryAction={{
                    label: "Lokasi Rumah Sakit",
                    href: "https://maps.google.com",
                }}
            />
        </div>
    );
};
