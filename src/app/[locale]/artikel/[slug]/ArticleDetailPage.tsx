"use client";

import { useGetArticleBySlug } from "~/features/article/api/getArticleBySlug";
import { useGetRelatedArticles } from "~/features/article/api/getRelatedArticles";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageSrc } from "~/lib/utils";
import { useState } from "react";
import { Breadcrumb } from "~/components/shared/Breadcrumb";

interface ArticleDetailPageProps {
    slug: string;
}

export const ArticleDetailPage = ({ slug }: ArticleDetailPageProps) => {
    const { data: article, isLoading, isError } = useGetArticleBySlug({ slug });
    const { data: relatedArticles, isLoading: isLoadingRelated } = useGetRelatedArticles(slug);
    const [imageError, setImageError] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="bg-muted/30 py-12 border-b">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <Skeleton className="h-6 w-32 mb-8" />
                        <div className="flex gap-4 mb-6">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-12 w-full mb-4" />
                        <Skeleton className="h-12 w-2/3" />
                    </div>
                </div>
                <div className="container mx-auto px-4 max-w-6xl mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <Skeleton className="aspect-video w-full rounded-3xl mb-12 shadow-xl" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
                <Button asChild>
                    <Link href="/artikel">Kembali ke Daftar Artikel</Link>
                </Button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <article className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-muted/30 py-12 border-b">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-4">
                        <Breadcrumb
                            items={[
                                { label: "Artikel", href: "/artikel" },
                                { label: article.title }
                            ]}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mb-6">
                        <Badge variant="secondary" className="text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none">
                            {article.categories?.find(c => c.type === "ARTICLE_CATEGORY")?.name || article.categories?.[0]?.name || "Kesehatan"}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                {formatDate(article.createdAt)}
                            </span>
                            {article.author && (
                                <span className="flex items-center gap-2 border-l pl-4">
                                    <User className="h-4 w-4 text-primary" />
                                    {article.author}
                                </span>
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-foreground max-w-4xl">
                        {article.title}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {article.image && !imageError && (
                            <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl mb-12 bg-background border ring-1 ring-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getImageSrc(article.image)}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        )}

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 text-lg md:text-xl font-light">
                                {article.content}
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                {article.categories?.filter(c => c.type === "ARTICLE_TAG").map(tag => (
                                    <Badge key={tag.id} variant="outline" className="rounded-full px-3 py-1 text-xs hover:bg-slate-50">
                                        #{tag.name}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-500">Bagikan:</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                                    onClick={() => {
                                        const url = window.location.href;
                                        const title = article.title;
                                        const text = `Baca artikel menarik ini: ${article.title}`;

                                        if (navigator.share) {
                                            navigator.share({
                                                title,
                                                text,
                                                url
                                            }).catch(err => console.error("Error sharing:", err));
                                        } else {
                                            navigator.clipboard.writeText(url).then(() => {
                                                alert("Link artikel berhasil disalin!");
                                            }).catch(err => {
                                                console.error("Failed to copy:", err);
                                                alert("Gagal menyalin link.");
                                            });
                                        }
                                    }}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Related Articles */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-100">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                                    Artikel Terkait
                                </h3>

                                <div className="space-y-6">
                                    {isLoadingRelated ? (
                                        [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
                                    ) : relatedArticles && relatedArticles.length > 0 ? (
                                        relatedArticles.map((rel) => (
                                            <Link
                                                key={rel.slug}
                                                href={`/artikel/${rel.slug}`}
                                                className="group block space-y-2"
                                            >
                                                <div className="flex gap-4 items-start">
                                                    {rel.image && (
                                                        <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                                            <img
                                                                src={getImageSrc(rel.image)}
                                                                alt={rel.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                                            {rel.title}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatDate(rel.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm">Tidak ada artikel terkait ditemukan.</p>
                                    )}
                                </div>

                                <Button asChild variant="link" className="mt-8 p-0 h-auto font-bold text-primary group">
                                    <Link href="/artikel" className="flex items-center gap-2">
                                        Lihat Semua Artikel
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Newsletter or CTA placeholder */}
                            <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Butuh Bantuan?</h3>
                                    <p className="text-primary-foreground/80 text-sm mb-6">Konsultasikan kesehatan Anda dengan dokter spesialis kami.</p>
                                    <Button asChild variant="secondary" className="w-full rounded-2xl font-bold">
                                        <Link href="/doctors">Cari Dokter</Link>
                                    </Button>
                                </div>
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
};
