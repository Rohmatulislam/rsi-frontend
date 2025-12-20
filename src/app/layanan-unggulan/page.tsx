import { Metadata } from "next";
import { LayananUnggulanIndexPage } from "~/features/featured-services/pages/LayananUnggulanIndexPage";

export const metadata: Metadata = {
    title: "Layanan Unggulan - RSI Siti Hajar Mataram",
    description: "Layanan unggulan RSI Siti Hajar: Bedah Minimal Invasif, ESWL, Persalinan Syar'i, dan Layanan Executive.",
};

export default function Page() {
    return <LayananUnggulanIndexPage />;
}
