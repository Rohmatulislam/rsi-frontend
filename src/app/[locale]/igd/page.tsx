import { Metadata } from "next";
import { IGDPage } from "~/features/info";

export const metadata: Metadata = {
    title: "IGD 24 Jam | RSI Siti Hajar Mataram",
    description: "Layanan Gawat Darurat siap siaga 24 jam dengan fasilitas lengkap dan tim medis profesional RSI Siti Hajar Mataram.",
};

export default function Page() {
    return <IGDPage />;
}
