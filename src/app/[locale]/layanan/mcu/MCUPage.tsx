"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import { Loader2, Check, Clock, FileCheck, Heart, Shield, Star, Database } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { Button } from "~/components/ui/button";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";
import { useGetMcuPackages, McuBookingModal } from "~/features/mcu";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";
import { MCUPageSkeleton } from "~/components/shared/PageSkeletons";


export const MCUPage = () => {
    const { data: service, isLoading: serviceLoading } = useGetServiceBySlug({ slug: 'mcu' });
    const { data: khanzaPackages, isLoading: khanzaLoading } = useGetMcuPackages();

    const isLoading = serviceLoading;

    if (isLoading) {
        return <MCUPageSkeleton />;
    }

    const benefits = [
        {
            icon: Shield,
            title: "Deteksi Dini",
            description: "Menemukan masalah kesehatan sebelum menjadi serius",
        },
        {
            icon: Heart,
            title: "Kesehatan Optimal",
            description: "Memastikan tubuh dalam kondisi terbaik",
        },
        {
            icon: FileCheck,
            title: "Rekam Medis",
            description: "Dokumentasi kesehatan yang lengkap dan terorganisir",
        },
        {
            icon: Clock,
            title: "Hemat Waktu",
            description: "Pemeriksaan lengkap dalam satu kunjungan",
        },
    ];

    return (
        <div className="min-h-screen">
            <BreadcrumbContainer
                items={[
                    { label: "Layanan", href: "/layanan" },
                    { label: "Medical Check Up" }
                ]}
                className="bg-muted/30 border-b"
            />
            <ServiceHero
                badge="LAYANAN MCU"
                title={service?.title || service?.name || "Medical Check Up"}
                highlightText={service?.subtitle || "Paket Lengkap & Terjangkau"}
                subtitle={service?.description || "Investasi terbaik untuk kesehatan Anda dengan pemeriksaan menyeluruh dan akurat"}
                backgroundImage={service?.image || undefined}
            />

            {/* Benefits Section */}
            <ServiceSection
                title="Mengapa Medical Check Up?"
                subtitle="Pemeriksaan kesehatan rutin adalah investasi terbaik untuk masa depan Anda"
            >
                <ServiceGrid columns={4}>
                    {benefits.map((benefit) => (
                        <ServiceCard
                            key={benefit.title}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            color="primary"
                        />
                    ))}
                </ServiceGrid>
            </ServiceSection>

            {/* Packages Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Pilihan Paket MCU</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Pilih paket yang sesuai dengan kebutuhan kesehatan Anda
                        </p>
                    </div>

                    {/* Loading state for Khanza packages */}
                    {khanzaLoading && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Khanza Packages - Primary source */}
                    {!khanzaLoading && khanzaPackages && khanzaPackages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {khanzaPackages.filter(pkg =>
                                pkg.name.toLowerCase().includes('mcu') ||
                                pkg.name.toLowerCase().includes('medical check')
                            ).slice(0, 6).map((pkg, idx) => {
                                const isPopular = idx === 1;

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isPopular ? "border-primary shadow-lg scale-105" : "border-border"
                                            }`}
                                    >
                                        {isPopular && (
                                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                                                <Star className="h-3 w-3 mr-1" />
                                                Terpopuler
                                            </Badge>
                                        )}
                                        <div className="text-center mb-6">
                                            <Badge variant="secondary" className="mb-2">
                                                <Database className="h-3 w-3 mr-1" />
                                                SIMRS
                                            </Badge>
                                            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                                            <p className="text-3xl font-black text-primary mb-2">
                                                {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                                            </p>
                                        </div>

                                        <McuBookingModal
                                            package={pkg}
                                            trigger={
                                                <Button
                                                    className="w-full mt-auto"
                                                    variant={isPopular ? "default" : "outline"}
                                                >
                                                    Booking Sekarang
                                                </Button>
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}



                    {/* Fallback to local service items if no Khanza packages */}
                    {!khanzaLoading && (!khanzaPackages || khanzaPackages.length === 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {service?.items?.filter(item => item.isActive).map((pkg, idx) => {
                                const features = pkg.features ? pkg.features.split(',') : [];
                                const isPopular = idx === 1;

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isPopular ? "border-primary shadow-lg scale-105" : "border-border"
                                            }`}
                                    >
                                        {isPopular && (
                                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                                                <Star className="h-3 w-3 mr-1" />
                                                Terpopuler
                                            </Badge>
                                        )}
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                                            <p className="text-3xl font-black text-primary mb-2">
                                                {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            {features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>{feature.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <AppointmentBookingModal
                                            serviceItem={{ id: pkg.id, name: pkg.name }}
                                            initialPoliId="mcu"
                                            trigger={
                                                <Button className="w-full mt-auto" variant={isPopular ? "default" : "outline"}>
                                                    Booking Sekarang
                                                </Button>
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>


            {/* Operating Hours */}
            <ServiceSection title="Informasi Layanan">
                <div className="max-w-2xl mx-auto bg-card border rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">Jam Operasional</h4>
                            <p className="text-muted-foreground text-sm">Senin - Sabtu: 07.00 - 14.00 WITA</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Persiapan</h4>
                            <p className="text-muted-foreground text-sm">Puasa 10-12 jam sebelum pemeriksaan</p>
                        </div>
                    </div>
                </div>
            </ServiceSection>

            <ServiceCTA
                title="Siap Untuk Pemeriksaan?"
                subtitle="Hubungi kami untuk reservasi atau informasi lebih lanjut"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin reservasi Medical Check Up di RSI Siti Hajar`,
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
