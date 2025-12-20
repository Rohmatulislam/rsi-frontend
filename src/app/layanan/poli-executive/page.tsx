import { Metadata } from "next";
import { PoliExecutivePage } from "~/features/executive/pages/PoliExecutivePage";

export const metadata: Metadata = {
    title: "Poli Executive - RSI Siti Hajar Mataram",
    description: "Layanan prioritas Poliklinik Executive dengan kenyamanan ekstra dan waktu tunggu minimal.",
};

export default function Page() {
    return <PoliExecutivePage />;
}
