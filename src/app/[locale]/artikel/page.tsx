export const runtime = 'edge';
import { Metadata } from "next";
import { ArticleListPage } from "./ArticleListPage";

export const metadata: Metadata = {
    title: "Artikel Kesehatan | RSI Siti Hajar Mataram",
    description: "Informasi dan edukasi kesehatan terpercaya dari RSI Siti Hajar Mataram",
};

export default function Page() {
    return <ArticleListPage />;
}
