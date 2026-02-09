export const runtime = 'edge';
import { Metadata } from "next";
import { LaboratoriumPage } from "~/features/lab/pages/LaboratoriumPage";

export const metadata: Metadata = {
    title: "Laboratorium - RSI Siti Hajar Mataram",
    description: "Layanan pemeriksaan laboratorium lengkap dengan peralatan modern dan hasil akurat. Tersedia pemeriksaan darah, urine, dan berbagai tes diagnostik.",
};

export default function Page() {
    return <LaboratoriumPage />;
}
