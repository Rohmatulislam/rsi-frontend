import { Metadata } from "next";
import { PoliExecutivePage } from "~/features/executive/pages/PoliExecutivePage";

export const metadata: Metadata = {
    title: "Layanan Executive - RSI Siti Hajar Mataram",
    description: "Layanan kesehatan premium dengan fasilitas eksklusif, dokter senior, dan pelayanan prioritas.",
};

export default function Page() {
    return <PoliExecutivePage />;
}
