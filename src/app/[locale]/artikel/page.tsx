import { Metadata } from "next";
import { ArticleListPage } from "./ArticleListPage";

export const metadata: Metadata = {
    title: "Artikel Kesehatan | RSI Sultan Agung Banjarbaru",
    description: "Informasi dan edukasi kesehatan terpercaya dari RSI Sultan Agung Banjarbaru",
};

export default function Page() {
    return <ArticleListPage />;
}
