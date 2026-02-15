"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetArticles } from "~/features/article/api/getArticles";
import { useTranslations } from "next-intl";
import { getImageSrc } from "~/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategories } from "~/features/admin/api/getCategories";
import { ArticleCardSkeleton } from "~/features/article/components/ArticleCardSkeleton";

export const ArticlesSection = () => {
    const t = useTranslations("Home");
    const { data: articles, isLoading } = useGetArticles();
    const { data: categories = [] } = useGetCategories();
    const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all");

    // Filter categories to only show those for articles
    const articleCategories = useMemo(() => {
        return categories.filter(c => c.type === "ARTICLE_CATEGORY" && c.isActive);
    }, [categories]);

    // Filter topics/tags
    const popularTopics = useMemo(() => {
        return categories.filter(c => c.type === "ARTICLE_TAG" && c.isActive);
    }, [categories]);

    // Filter articles based on active category
    const filteredArticles = useMemo(() => {
        if (!articles) return [];
        if (activeCategorySlug === "all") return articles.slice(0, 6);

        return articles.filter(article =>
            article.categories?.some(cat => cat.slug === activeCategorySlug)
        ).slice(0, 6);
    }, [articles, activeCategorySlug]);

    if (!isLoading && (!articles || articles.length === 0)) return null;

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left Section: Header & Topics */}
                    <div className="lg:w-[35%] relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-ramadan-gold/10 rounded-full blur-3xl pointer-events-none" />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-8 leading-tight">
                                {t("latest_articles")}
                                <span className="text-ramadan-gold ml-2">.</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed font-medium">
                                Temukan informasi kesehatan terpilih untuk menjaga kebugaran selama bulan Ramadan dan seterusnya.
                            </p>
                            <Link
                                href="/artikel"
                                className="inline-flex items-center gap-3 bg-ramadan-gold/10 text-ramadan-gold px-6 py-3 rounded-2xl font-black text-sm group mb-10 hover:bg-ramadan-gold hover:text-white transition-all duration-500 shadow-xl shadow-ramadan-gold/10"
                            >
                                {t("view_all_articles")}
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <div className="h-1.5 w-24 bg-ramadan-gold rounded-full mb-10" />

                            {popularTopics.length > 0 && (
                                <>
                                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">
                                        Atau Telusuri Topik Populer
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {popularTopics.map((topic) => (
                                            <Link
                                                key={topic.id}
                                                href={`/artikel?tag=${topic.slug}`}
                                                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs hover:border-primary hover:text-primary transition-colors"
                                            >
                                                {topic.name}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Section: Categories & Grid */}
                    <div className="lg:w-[70%]">
                        {/* Categories List */}
                        <div className="relative mb-10 overflow-hidden">
                            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveCategorySlug("all")}
                                        className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${activeCategorySlug === "all"
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/50"
                                            }`}
                                    >
                                        Semua Artikel
                                    </button>
                                    {articleCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategorySlug(cat.slug)}
                                            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${activeCategorySlug === cat.slug
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/50"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Articles Grid */}
                        <div className="relative min-h-[400px]">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {isLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <ArticleCardSkeleton key={i} />
                                        ))
                                    ) : filteredArticles.length > 0 ? (
                                        filteredArticles.slice(0, 3).map((article, index) => (
                                            <motion.article
                                                key={article.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-500"
                                            >
                                                <Link href={`/artikel/${article.slug}`} className="block relative aspect-[1.3/1] overflow-hidden">
                                                    <img
                                                        src={getImageSrc(article.image)}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </Link>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <Link href={`/artikel/${article.slug}`}>
                                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                            {article.title}
                                                        </h3>
                                                    </Link>
                                                    <div className="mt-auto">
                                                        <Link
                                                            href={`/artikel/${article.slug}`}
                                                            className="inline-flex items-center gap-2 text-primary text-xs font-bold group/btn"
                                                        >
                                                            {t("read_more")}
                                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <p className="text-slate-400">Belum ada artikel di kategori ini.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
