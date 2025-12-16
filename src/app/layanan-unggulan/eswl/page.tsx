import { Metadata } from "next";
import { ESWLPage } from "./ESWLPage";

export const metadata: Metadata = {
    title: "ESWL - RSI Siti Hajar Mataram",
    description: "Penghancuran batu ginjal tanpa operasi menggunakan gelombang kejut. Prosedur aman, efektif, dan rawat jalan.",
};

export default function Page() {
    return <ESWLPage />;
}
