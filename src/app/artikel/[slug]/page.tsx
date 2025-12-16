import { Metadata } from "next";
import { ArticleDetailPage } from "./ArticleDetailPage";

export const metadata: Metadata = {
    title: "Detail Artikel | RSI Sultan Agung Banjarbaru",
    description: "Baca artikel kesehatan terbaru",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ArticleDetailPage slug={slug} />;
}
