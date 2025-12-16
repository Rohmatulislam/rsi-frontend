import { Metadata } from "next";
import { ExecutivePage } from "./ExecutivePage";

export const metadata: Metadata = {
    title: "Layanan Executive - RSI Siti Hajar Mataram",
    description: "Layanan kesehatan premium dengan fasilitas eksklusif, dokter senior, dan pelayanan prioritas.",
};

export default function Page() {
    return <ExecutivePage />;
}
