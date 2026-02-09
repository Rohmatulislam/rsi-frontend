export const runtime = 'edge';
import { Metadata } from "next";
import { RehabilitasiMedikPage } from "~/features/rehabilitation/pages/RehabilitasiMedikPage";

export const metadata: Metadata = {
    title: "Rehabilitasi Medik - RSI Siti Hajar Mataram",
    description: "Layanan fisioterapi dan rehabilitasi medik untuk pemulihan fungsi tubuh. Ditangani oleh dokter spesialis dan fisioterapis profesional.",
};

export default function Page() {
    return <RehabilitasiMedikPage />;
}
