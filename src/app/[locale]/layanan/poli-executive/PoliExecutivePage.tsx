"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { Loader2, Zap, ShieldCheck, Clock, UserCheck, Star, FileCheck, PhoneCall } from "lucide-react";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { Button } from "~/components/ui/button";

export const PoliExecutivePage = () => {
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'poli-executive' });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const benefits = [
        {
            icon: Zap,
            title: "Tanpa Antre",
            description: "Waktu tunggu minimal dengan sistem appointment yang terjadwal",
        },
        {
            icon: UserCheck,
            title: "Privasi Tinggi",
            description: "Ruang tunggu dan konsultasi yang nyaman dan eksklusif",
        },
        {
            icon: Star,
            title: "Layanan One-Stop",
            description: "Pendaftaran, pemeriksaan, dan pembayaran dalam satu area",
        },
        {
            icon: PhoneCall,
            title: "Personal Assistant",
            description: "Pendampingan selama proses pelayanan oleh staf kami",
        },
    ];

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN PREMIUM"
                title={service?.title || service?.name || "Poliklinik Executive"}
                highlightText={service?.subtitle || "Layanan Prioritas Anda"}
                subtitle={service?.description || "Nikmati layanan medis kelas satu dengan kenyamanan ekstra dan waktu tunggu minimal"}
                backgroundImage={service?.image || undefined}
            />

            {/* Benefits Section */}
            <ServiceSection
                title="Keunggulan Poli Executive"
                subtitle="Kami mengutamakan waktu dan kenyamanan Anda"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color="accent"
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Features / Items Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Layanan Tersedia</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Berbagai spesialisasi kini tersedia di Poliklinik Executive
                        </p>
                    </div>

                    <ServiceGrid columns={4}>
                        {(service?.items?.length ? service.items : []).filter(item => item.isActive).map((item, idx) => {
                            const colors: ("rose" | "cyan" | "accent" | "purple" | "primary" | "success")[] = ["rose", "cyan", "accent", "purple", "primary", "success"];
                            return (
                                <ServiceCard
                                    key={item.id}
                                    icon={Star}
                                    title={item.name}
                                    description={item.description}
                                    color={colors[idx % colors.length]}
                                >
                                    <AppointmentBookingModal
                                        serviceItem={{ id: item.id, name: item.name }}
                                        initialPoliId="poli-executive"
                                        trigger={
                                            <Button className="w-full" variant="outline" size="sm">
                                                Booking Jadwal
                                            </Button>
                                        }
                                    />
                                </ServiceCard>
                            );
                        })}
                    </ServiceGrid>
                </div>
            </section>

            <ServiceCTA
                title="Jadwalkan Konsultasi Anda"
                subtitle="Hubungi concierge kami untuk membantu mengatur kunjungan Anda"
                primaryAction={{
                    label: "Hubungi Concierge",
                    href: "https://wa.me/6281234567890?text=Halo, saya ingin reservasi di Poli Executive RSI Siti Hajar",
                    icon: "whatsapp",
                }}
                secondaryAction={{
                    label: "Lihat Dokter",
                    href: "/doctors",
                }}
            />
        </div>
    );
};
