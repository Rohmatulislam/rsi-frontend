"use client";

import { useGetArticleBySlug } from "~/features/article/api/getArticleBySlug";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
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
    const [imageError, setImageError] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="bg-muted/30 py-12 border-b">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Skeleton className="h-6 w-32 mb-8" />
                        <div className="flex gap-4 mb-6">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-12 w-full mb-4" />
                        <Skeleton className="h-12 w-2/3" />
                    </div>
                </div>
                <div className="container mx-auto px-4 max-w-4xl -mt-8">
                    <Skeleton className="aspect-video w-full rounded-3xl mb-12 shadow-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
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
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-4">
                        <Breadcrumb
                            items={[
                                { label: "Artikel", href: "/artikel" },
                                { label: article.title }
                            ]}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {article.categories?.find(c => c.type === "ARTICLE_CATEGORY")?.name || article.categories?.[0]?.name || "Kesehatan"}
                        </Badge>
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.createdAt)}
                        </span>
                        {article.author && (
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                {article.author}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
                        {article.title}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl -mt-8">
                {article.image && !imageError && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl mb-12 bg-background">
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
                    <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-lg">
                        {article.content}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex justify-between items-center">
                    <p className="text-muted-foreground italic">Bagikan artikel ini:</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
};
