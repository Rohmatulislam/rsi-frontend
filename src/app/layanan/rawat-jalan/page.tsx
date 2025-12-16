import { Metadata } from "next";
import { RawatJalanPage } from "./RawatJalanPage";

export const metadata: Metadata = {
    title: "Rawat Jalan - RSI Siti Hajar Mataram",
    description: "Layanan rawat jalan dengan berbagai poliklinik spesialis. Konsultasi dengan dokter ahli untuk berbagai keluhan kesehatan.",
};

export default function Page() {
    return <RawatJalanPage />;
}
