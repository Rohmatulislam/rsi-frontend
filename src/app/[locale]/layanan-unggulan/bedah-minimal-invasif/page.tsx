export const runtime = 'edge';
import { Metadata } from "next";
import { BedahMinimalInvasifPage } from "~/features/featured-services/pages/BedahMinimalInvasifPage";

export const metadata: Metadata = {
    title: "Bedah Minimal Invasif - RSI Siti Hajar Mataram",
    description: "Teknik operasi modern dengan sayatan kecil, pemulihan cepat, luka minimal, dan risiko komplikasi rendah.",
};

export default function Page() {
    return <BedahMinimalInvasifPage />;
}
