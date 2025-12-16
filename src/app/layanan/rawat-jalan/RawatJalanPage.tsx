"use client";

import { ServiceHero, ServiceSection, ServiceGrid, ServiceCard, ServiceCTA } from "~/features/services";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

const poliklinikList = [
    { name: "Poli Umum", description: "Pemeriksaan kesehatan umum dan konsultasi", color: "primary" as const },
    { name: "Poli Anak", description: "Kesehatan anak dan tumbuh kembang", color: "cyan" as const },
    { name: "Poli Kandungan", description: "Kesehatan ibu hamil dan reproduksi", color: "rose" as const },
    { name: "Poli Penyakit Dalam", description: "Penyakit organ dalam dan metabolik", color: "accent" as const },
    { name: "Poli Bedah", description: "Konsultasi dan tindakan bedah", color: "success" as const },
    { name: "Poli Jantung", description: "Kesehatan jantung dan pembuluh darah", color: "rose" as const },
    { name: "Poli Saraf", description: "Gangguan sistem saraf dan otak", color: "purple" as const },
    { name: "Poli Mata", description: "Kesehatan mata dan penglihatan", color: "cyan" as const },
    { name: "Poli THT", description: "Telinga, hidung, dan tenggorokan", color: "accent" as const },
    { name: "Poli Kulit", description: "Kesehatan kulit dan kelamin", color: "primary" as const },
    { name: "Poli Orthopedi", description: "Tulang dan persendian", color: "success" as const },
    { name: "Poli Urologi", description: "Saluran kemih dan reproduksi pria", color: "purple" as const },
];

export const RawatJalanPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN RAWAT JALAN"
                title="Rawat Jalan"
                highlightText="Berbagai Poliklinik Spesialis"
                subtitle="Layanan pemeriksaan dan konsultasi dengan dokter spesialis dari berbagai bidang keahlian"
            />

            {/* Poliklinik Grid */}
            <ServiceSection
                title="Poliklinik Spesialis"
                subtitle="Pilih poliklinik sesuai dengan kebutuhan kesehatan Anda"
            >
                <ServiceGrid columns={4}>
                    {poliklinikList.map((poli) => (
                        <ServiceCard
                            key={poli.name}
                            title={poli.name}
                            description={poli.description}
                            color={poli.color}
                        />
                    ))}
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
