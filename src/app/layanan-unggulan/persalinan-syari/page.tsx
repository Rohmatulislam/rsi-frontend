import { Metadata } from "next";
import { PersalinanSyariPage } from "./PersalinanSyariPage";

export const metadata: Metadata = {
    title: "Persalinan Syar'i - RSI Siti Hajar Mataram",
    description: "Layanan persalinan yang mengutamakan privasi dan nilai-nilai Islami. Tenaga medis profesional dengan fasilitas nyaman.",
};

export default function Page() {
    return <PersalinanSyariPage />;
}
