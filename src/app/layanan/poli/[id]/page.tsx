import { PoliDetailPage } from "~/features/outpatient/components/PoliDetailPage";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    return {
        title: `Detail Poliklinik - RSI Siti Hajar Mataram`,
        description: "Informasi detail poliklinik dan jadwal dokter",
    };
}

export default async function Page(props: PageProps) {
    const params = await props.params;
    return <PoliDetailPage id={params.id} />;
}
