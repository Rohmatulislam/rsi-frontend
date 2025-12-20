"use client";

import { ServiceHero } from "~/features/services";
import { useGetServiceBySlug } from "~/features/services/api/getServiceBySlug";

// Modular Components
import { ExecutiveStats } from "../components/ExecutiveStats";
import { ExecutiveBenefits } from "../components/ExecutiveBenefits";
import { ExecutiveClinicsGrid } from "../components/ExecutiveClinicsGrid";
import { ExecutiveCTA } from "../components/ExecutiveCTA";
import { ExecutivePageSkeleton } from "../components/ExecutivePageSkeleton";

export const PoliExecutivePage = () => {
    const { data: service, isLoading } = useGetServiceBySlug({ slug: 'poli-executive' });

    if (isLoading) {
        return <ExecutivePageSkeleton />;
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent" />

                <ServiceHero
                    badge="PELAYANAN PREMIUM"
                    title={service?.title || service?.name || "Poliklinik Eksekutif"}
                    highlightText={service?.subtitle || "Kenyamanan Prioritas Kami"}
                    subtitle={service?.description || "Nikmati pengalaman medis kelas satu dengan kenyamanan ekstra, waktu tunggu minimal, dan pelayanan personal di RSI Siti Hajar."}
                />
            </div>

            {/* Premium Stats / Highlight */}
            <ExecutiveStats />

            {/* Keunggulan Section */}
            <ExecutiveBenefits />

            {/* List Layanan Executive */}
            <ExecutiveClinicsGrid items={service?.items || []} />

            {/* CTA Specialized */}
            <ExecutiveCTA />
        </div>
    );
};
