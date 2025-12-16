import { Metadata } from "next";
import { RadiologiPage } from "./RadiologiPage";

export const metadata: Metadata = {
    title: "Radiologi - RSI Siti Hajar Mataram",
    description: "Layanan pencitraan medis lengkap: Rontgen, USG, CT Scan dengan teknologi modern untuk diagnosis yang akurat.",
};

export default function Page() {
    return <RadiologiPage />;
}
