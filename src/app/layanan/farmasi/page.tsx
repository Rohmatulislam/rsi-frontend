import { Metadata } from "next";
import { FarmasiPage } from "./FarmasiPage";

export const metadata: Metadata = {
    title: "Farmasi 24 Jam - RSI Siti Hajar Mataram",
    description: "Apotek rumah sakit 24 jam dengan obat lengkap dan berkualitas. Layanan konsultasi apoteker profesional.",
};

export default function Page() {
    return <FarmasiPage />;
}
