export const runtime = 'edge';
import { Metadata } from "next";
import { MCUPage } from "~/features/mcu/pages/MCUPage";

export const metadata: Metadata = {
    title: "Medical Check Up - RSI Siti Hajar Mataram",
    description: "Paket Medical Check Up lengkap untuk deteksi dini penyakit. Tersedia paket Basic, Standard, dan Executive dengan harga terjangkau.",
};

export default function Page() {
    return <MCUPage />;
}
