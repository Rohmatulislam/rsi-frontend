export const runtime = 'edge';
import { Metadata } from "next";
import { RawatJalanPage } from "~/features/outpatient/pages/RawatJalanPage";

export const metadata: Metadata = {
    title: "Rawat Jalan - RSI Siti Hajar Mataram",
    description: "Layanan rawat jalan dengan berbagai poliklinik spesialis. Konsultasi dengan dokter ahli untuk berbagai keluhan kesehatan.",
};

export default function Page() {
    return <RawatJalanPage />;
}
