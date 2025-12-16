"use client";

import { ServiceHero } from "~/features/services";
import { useGetArticles } from "~/features/article/api/getArticles";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageSrc } from "~/lib/utils";
import { useState } from "react";

export const ArticleListPage = () => {
    const { data: articles, isLoading } = useGetArticles();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="INFORMASI & EDUKASI"
                title="Artikel Kesehatan"
                highlightText="Berita & Tips Terkini"
                subtitle="Dapatkan informasi kesehatan terpercaya dari para ahli kami"
            />

            <section className="py-16 container mx-auto px-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-[200px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : articles?.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold">Belum ada artikel</h3>
                        <p className="text-muted-foreground">Silakan kembali lagi nanti.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles?.map((article) => (
                            <Link key={article.id} href={`/artikel/${article.slug}`} className="group">
                                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card">
                                    <div className="relative h-48 overflow-hidden bg-muted">
                                        {article.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={getImageSrc(article.image)}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                    const div = document.createElement('div');
                                                    div.className = "text-muted-foreground/30 font-bold text-xl";
                                                    div.innerText = "RSI SITI HAJAR MATARAM";
                                                    e.currentTarget.parentElement?.appendChild(div);
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold text-xl">
                                                RSI SITI HAJAR MATARAM
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="secondary" className="backdrop-blur-md bg-white/80">
                                                {article.category?.name || "Umum"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(article.createdAt)}
                                            </span>
                                            {article.author && (
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {article.author}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                                            {article.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                            {article.excerpt || article.content.substring(0, 150) + "..."}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
