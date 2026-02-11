"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, Loader2, Stethoscope, Activity, Heart, Shield, Star } from "lucide-react";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";

const iconMap: Record<string, any> = {
    Stethoscope,
    Activity,
    Heart,
    Shield,
    Star
};

export const RawatJalanPage = () => {
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'rawat-jalan' });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN RAWAT JALAN"
                title={service?.title || service?.name || "Rawat Jalan"}
                highlightText={service?.subtitle || "Berbagai Poliklinik Spesialis"}
                subtitle={service?.description || "Layanan pemeriksaan dan konsultasi dengan dokter spesialis dari berbagai bidang keahlian"}
                backgroundImage={service?.image || undefined}
            />

            {/* Poliklinik Grid */}
            <ServiceSection
                title="Poliklinik Spesialis"
                subtitle="Pilih poliklinik sesuai dengan kebutuhan kesehatan Anda"
            >
                <ServiceGrid columns={4}>
                    {(service?.items?.length ? service.items : []).filter(item => item.isActive).map((item, idx) => {
                        const colors: ("primary" | "cyan" | "rose" | "accent" | "success" | "purple")[] = ["primary", "cyan", "rose", "accent", "success", "purple"];
                        return (
                            <ServiceCard
                                key={item.id}
                                title={item.name}
                                description={item.description}
                                color={colors[idx % colors.length]}
                            />
                        );
                    })}
                </ServiceGrid>
            </ServiceSection>

            {/* Operating Hours */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-xl font-bold mb-6 text-center">Jam Operasional Poliklinik</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card border rounded-xl p-5 text-center">
                                <p className="font-semibold">Senin - Jumat</p>
                                <p className="text-muted-foreground text-sm">08.00 - 20.00 WITA</p>
                            </div>
                            <div className="bg-card border rounded-xl p-5 text-center">
                                <p className="font-semibold">Sabtu</p>
                                <p className="text-muted-foreground text-sm">08.00 - 14.00 WITA</p>
                            </div>
                            <div className="bg-card border rounded-xl p-5 text-center">
                                <p className="font-semibold">Minggu</p>
                                <p className="text-muted-foreground text-sm">Tutup (kecuali IGD)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA - Find Doctor */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Temukan Dokter Spesialis</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Cari dan booking jadwal dokter spesialis sesuai kebutuhan Anda
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/doctors">
                            Lihat Daftar Dokter
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            <ServiceCTA
                title="Butuh Bantuan?"
                subtitle="Tim kami siap membantu Anda menemukan dokter yang tepat"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang poliklinik",
                    icon: "whatsapp",
                }}
            />
        </div>
    );
};
