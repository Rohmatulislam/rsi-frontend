import { Metadata } from "next";
import { FAQPage } from "~/features/info";

export const metadata: Metadata = {
    title: "FAQ (Tanya Jawab) | RSI Siti Hajar Mataram",
    description: "Pertanyaan yang sering diajukan mengenai layanan RSI Siti Hajar Mataram.",
};

export default function Page() {
    return <FAQPage />;
}
