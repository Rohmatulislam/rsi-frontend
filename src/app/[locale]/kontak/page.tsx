import { Metadata } from "next";
import { ContactPage } from "~/features/info";

export const metadata: Metadata = {
    title: "Hubungi Kami | RSI Siti Hajar Mataram",
    description: "Informasi kontak, alamat, dan formulir pesan RSI Siti Hajar Mataram.",
};

export default function Page() {
    return <ContactPage />;
}
