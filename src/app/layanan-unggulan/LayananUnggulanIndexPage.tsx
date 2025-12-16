"use client";

import { ServiceHero, ServiceSection } from "~/features/services";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import bedahImg from "~/assets/layanan-unggulan/bedah-minimal-invasif.png";
import eswlImg from "~/assets/layanan-unggulan/eswl.png";
import persalinanImg from "~/assets/layanan-unggulan/persalinan-syari.png";
import executiveImg from "~/assets/layanan-unggulan/executive.png";

const layananUnggulan = [
    {
        slug: "bedah-minimal-invasif",
        image: bedahImg,
        title: "Bedah Minimal Invasif",
        description: "Teknik operasi modern dengan sayatan kecil, pemulihan lebih cepat, dan risiko komplikasi minimal",
        features: ["Laparoskopi", "Endoskopi", "Artroskopi"],
    },
    {
        slug: "eswl",
        image: eswlImg,
        title: "ESWL",
        description: "Penghancuran batu ginjal tanpa operasi menggunakan gelombang kejut dari luar tubuh",
        features: ["Tanpa Operasi", "Rawat Jalan", "Hasil Efektif"],
    },
    {
        slug: "persalinan-syari",
        image: persalinanImg,
        title: "Persalinan Syar'i",
        description: "Proses persalinan yang mengutamakan privasi dan nilai-nilai Islami bagi ibu dan keluarga",
        features: ["Privasi Terjaga", "Tenaga Medis Wanita", "Ruang Nyaman"],
    },
    {
        slug: "executive",
        image: executiveImg,
        title: "Layanan Executive",
        description: "Pelayanan premium dengan fasilitas eksklusif dan dokter-dokter senior berpengalaman",
        features: ["Ruang Tunggu Ekslusif", "Prioritas Layanan", "Fasilitas Premium"],
    },
];

export const LayananUnggulanIndexPage = () => {
    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="LAYANAN UNGGULAN"
                title="Layanan Unggulan"
                highlightText="Pelayanan Terbaik untuk Anda"
                subtitle="Layanan kesehatan premium dengan teknologi modern dan tenaga medis profesional"
            />

            <ServiceSection
                title="Pilihan Layanan Unggulan"
                subtitle="Temukan layanan kesehatan terbaik sesuai kebutuhan Anda"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {layananUnggulan.map((layanan) => (
                        <Link
                            key={layanan.slug}
                            href={`/layanan-unggulan/${layanan.slug}`}
                            className="group"
                        >
                            <div className="bg-card border rounded-2xl overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                {/* Image Container */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={layanan.image}
                                        alt={layanan.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                                        {layanan.title}
                                    </h3>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <p className="text-muted-foreground mb-4">{layanan.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {layanan.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="text-xs px-3 py-1 bg-muted rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center text-primary font-medium text-sm">
                                        Selengkapnya
                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </ServiceSection>
        </div>
    );
};
