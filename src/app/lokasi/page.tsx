import { Metadata } from "next";
import { LocationPage } from "~/features/info";

export const metadata: Metadata = {
    title: "Lokasi & Peta | RSI Siti Hajar Mataram",
    description: "Panduan lokasi dan akses menuju Rumah Sakit Islam Siti Hajar Mataram.",
};

export default function Page() {
    return <LocationPage />;
}
