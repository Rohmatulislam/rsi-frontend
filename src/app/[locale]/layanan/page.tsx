import { Metadata } from "next";
import { LayananIndexPage } from "~/features/services";

export const metadata: Metadata = {
    title: "Layanan - RSI Siti Hajar Mataram",
    description: "Daftar lengkap layanan kesehatan di RSI Siti Hajar Mataram.",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    await params;
    return <LayananIndexPage />;
}
