import { AboutPage } from "~/features/about/pages/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tentang Kami | RSI Siti Hajar Mataram",
    description: "Profil lengkap RSI Siti Hajar Mataram, Visi Misi, Sejarah, dan Nilai-nilai Utama pelayanan kami.",
};

export default function TentangKamiPage() {
    return <AboutPage />;
}
