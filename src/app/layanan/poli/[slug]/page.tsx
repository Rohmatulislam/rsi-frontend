import { notFound } from "next/navigation";
import { ServicePoliDetail } from "~/features/services/components/ServicePoliDetail";
import { getPoliklinikBySlug, poliklinikData } from "~/features/services/data/poliklinik-data";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata dynamically
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const poli = getPoliklinikBySlug(params.slug);

    if (!poli) {
        return {
            title: "Poliklinik Tidak Ditemukan",
        };
    }

    return {
        title: `${poli.name} - RSI Siti Hajar Mataram`,
        description: poli.description,
    };
}

// Generate static params if we want static generation (optional but good for performance)
export async function generateStaticParams() {
    return poliklinikData.map((poli) => ({
        slug: poli.slug,
    }));
}

export default async function Page(props: PageProps) {
    const params = await props.params;
    const poli = getPoliklinikBySlug(params.slug);

    if (!poli) {
        notFound();
    }

    // We pass slug only to avoid serialization error with Icon component
    return <ServicePoliDetail slug={params.slug} />;
}
