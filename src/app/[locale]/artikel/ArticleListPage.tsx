"use client";

import { useState, useMemo } from "react";
import { ServiceHero } from "~/features/services";
import { useGetArticles } from "~/features/article/api/getArticles";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Calendar, User, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageSrc } from "~/lib/utils";

export const ArticleListPage = () => {
    const { data: articles, isLoading } = useGetArticles();

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Get unique categories
    const categories = useMemo(() => {
        if (!articles) return [];
        const uniqueCategories = [...new Set(
            articles
                .flatMap(article => article.categories?.filter(c => c.type === "ARTICLE_CATEGORY").map(c => c.name) || [])
                .filter(Boolean)
        )];
        return uniqueCategories;
    }, [articles]);

    // Filter articles
    const filteredArticles = useMemo(() => {
        if (!articles) return [];

        return articles.filter(article => {
            // Search filter - check title and content
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === "" ||
                article.title.toLowerCase().includes(searchLower) ||
                (article.excerpt && article.excerpt.toLowerCase().includes(searchLower)) ||
                article.content.toLowerCase().includes(searchLower);

            // Category filter
            const matchesCategory = categoryFilter === "all" ||
                article.categories?.some(cat => cat.name === categoryFilter);

            return matchesSearch && matchesCategory;
        });
    }, [articles, searchTerm, categoryFilter]);

    return (
        <div className="min-h-screen">
            <ServiceHero
                badge="INFORMASI & EDUKASI"
                title="Artikel Kesehatan"
                highlightText="Berita & Tips Terkini"
                subtitle="Dapatkan informasi kesehatan terpercaya dari para ahli kami"
            />

            <section className="py-16 container mx-auto px-4">
                {/* Search and Filter Section */}
                <div className="mb-10 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Cari artikel berdasarkan judul atau konten..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter Pills */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${categoryFilter === 'all'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                                    }`}
                                onClick={() => setCategoryFilter('all')}
                            >
                                Semua Kategori
                            </button>
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${categoryFilter === category
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                                        }`}
                                    onClick={() => setCategoryFilter(category as string)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Results count */}
                    {!isLoading && articles && (
                        <div className="text-center text-sm text-muted-foreground">
                            Menampilkan {filteredArticles.length} dari {articles.length} artikel
                        </div>
                    )}
                </div>

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
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-xl font-bold mb-2">
                            {searchTerm || categoryFilter !== 'all'
                                ? 'Artikel tidak ditemukan'
                                : 'Belum ada artikel'}
                        </h3>
                        <p className="text-muted-foreground">
                            {searchTerm || categoryFilter !== 'all'
                                ? 'Coba ubah kata kunci pencarian atau filter kategori'
                                : 'Silakan kembali lagi nanti.'}
                        </p>
                        {(searchTerm || categoryFilter !== 'all') && (
                            <button
                                className="mt-4 text-primary hover:underline font-medium"
                                onClick={() => {
                                    setSearchTerm("");
                                    setCategoryFilter("all");
                                }}
                            >
                                Reset filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article) => (
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
                                                {article.categories?.find(c => c.type === "ARTICLE_CATEGORY")?.name || article.categories?.[0]?.name || "Umum"}
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
