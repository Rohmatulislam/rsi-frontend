
"use client";

import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { ServiceHero, ServiceSection } from "~/features/services";
import { DoctorCard } from "~/components/shared/DoctorCard";
import { getPoliklinikBySlug } from "~/features/services/data/poliklinik-data";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServiceCTA } from "~/features/services/components/ServiceCTA";
import { Skeleton } from "~/components/ui/skeleton";
import { notFound } from "next/navigation";

interface ServicePoliDetailProps {
    slug: string;
}

export const ServicePoliDetail = ({ slug }: ServicePoliDetailProps) => {
    const poli = getPoliklinikBySlug(slug);

    if (!poli) {
        notFound();
        return null;
    }

    // Determine if we should filter for executive doctors
    const isExecutive = poli.category === "executive";

    // Fetch doctors
    const { data: doctors, isLoading } = useGetDoctorsList({
        input: {
            isExecutive: isExecutive,
            // We can add search param if the API supports filtering by specialty via search
            // For now we might need to filter client side if API doesn't support specific poli filter
        },
    });

    // Client-side filtering to match the poli's specialty
    // This is a temporary solution until the API supports direct specialty filtering
    const filteredDoctors = doctors?.filter(doc => {
        // Matches if doctor's specialization or category includes the poli's name or specialtyId
        const specialtyMatch = doc.specialization?.toLowerCase().includes(poli.specialtyId?.toLowerCase() || "");
        // Categories in DoctorDto only have name, no slug
        const categoryMatch = doc.categories?.some(cat => cat.name.toLowerCase().includes(poli.specialtyId?.toLowerCase() || ""));

        // If specialtyId is not defined, maybe show all (or none?) - let's assume loose matching
        if (!poli.specialtyId) return true;

        return specialtyMatch || categoryMatch;
    });

    const PoliIcon = poli.icon;

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge={isExecutive ? "POLI EXECUTIVE" : "POLIKLINIK"}
                title={poli.name}
                highlightText={isExecutive ? "Layanan Premium" : "Layanan Dokter Spesialis"}
                subtitle={poli.description}
            />

            <ServiceSection
                title={`Dokter ${poli.name} `}
                subtitle={`Tim dokter spesialis yang siap melayani Anda di ${poli.name} `}
            >
                <div className="mb-8">
                    <Button variant="outline" asChild>
                        <Link href={isExecutive ? "/layanan-unggulan/executive" : "/layanan/rawat-jalan"}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke {isExecutive ? "Executive" : "Rawat Jalan"}
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-[300px] w-full rounded-xl" />
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        ))}
                    </div>
                ) : filteredDoctors && filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                        <div className="p-4 rounded-full bg-muted inline-flex mb-4">
                            <PoliIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada dokter terdaftar</h3>
                        <p className="text-muted-foreground">
                            Saat ini belum ada data dokter untuk {poli.name}.
                        </p>
                    </div>
                )}
            </ServiceSection>

            <ServiceCTA
                title={`Butuh Layanan ${poli.name}?`}
                subtitle="Hubungi kami untuk informasi jadwal dan pendaftaran"
                primaryAction={{
                    label: "Hubungi via WhatsApp",
                    href: `https://wa.me/6281234567890?text=Halo, saya ingin daftar di ${poli.name}`,
                    icon: "whatsapp",
                }}
            />
        </div >
    );
};
