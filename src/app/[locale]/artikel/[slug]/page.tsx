import { Metadata } from "next";
import { getArticleBySlug } from "~/features/article/api/getArticleBySlug";
import { ArticleDetailPage } from "./ArticleDetailPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const article = await getArticleBySlug(slug);
        const title = article.title;
        const description = article.excerpt || article.content.substring(0, 160);

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: "article",
                publishedTime: article.publishedAt || article.createdAt,
                authors: article.author ? [article.author] : ["RSI Siti Hajar Mataram"],
                images: article.image ? [article.image] : [],
            },
        };
    } catch {
        return {
            title: "Baca Artikel Kesehatan | RSI Siti Hajar Mataram",
        };
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ArticleDetailPage slug={slug} />;
}
