export const runtime = 'edge';
import { Metadata } from "next";
import { RawatInapPage } from "~/features/inpatient/pages/RawatInapPage";

export const metadata: Metadata = {
    title: "Rawat Inap - RSI Siti Hajar Mataram",
    description: "Fasilitas rawat inap nyaman dengan berbagai pilihan kelas kamar. Pelayanan 24 jam dengan tenaga medis profesional.",
};

export default function Page() {
    return <RawatInapPage />;
}
