"use client";

import { useState } from "react";
import { useGetArticles } from "~/features/article/api/getArticles";
import { Button } from "~/components/ui/button";
import { Plus, Edit, Trash2, Eye, Search, FileText, Tag } from "lucide-react";
import NextLink from "next/link";
import { useDeleteArticle } from "~/features/admin/api/deleteArticle";
import { useCreateArticle } from "~/features/admin/api/createArticle";
import { useUpdateArticle } from "~/features/admin/api/updateArticle";
import { ArticleDto } from "~/features/article/services/articleService";
import { ArticleModal } from "~/features/admin/components/ArticleModal";
import { CreateArticleDto, UpdateArticleDto } from "~/features/admin/types/article";
import { CategoryManagement } from "~/features/admin/components/CategoryManagement";

type TabType = "articles" | "categories";

export default function AdminArticlesPage() {
    const { data: articles, isLoading } = useGetArticles();
    const deleteArticle = useDeleteArticle();
    const createArticle = useCreateArticle();
    const updateArticle = useUpdateArticle();

    const [activeTab, setActiveTab] = useState<TabType>("articles");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<ArticleDto | null>(null);
    const [search, setSearch] = useState("");

    const filteredArticles = articles?.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.slug.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleCreate = () => {
        setCurrentArticle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (article: ArticleDto) => {
        if (!article.slug) {
            alert("DATA KORUP: Artikel ini tidak memiliki slug. Mohon hapus artikel ini dan buat baru.");
            return;
        }
        setCurrentArticle(article);
        setIsModalOpen(true);
    };

    const handleSave = (data: CreateArticleDto | UpdateArticleDto, isEdit: boolean) => {
        if (isEdit && currentArticle) {
            console.log(`>>> [AdminArticlesPage] Saving Edit. Slug: '${currentArticle.slug}'`);
            if (!currentArticle.slug) {
                alert("Critical Error: Original slug is missing!");
                return;
            }
            updateArticle.mutate({
                slug: currentArticle.slug,
                data: data as UpdateArticleDto
            }, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            createArticle.mutate(data as CreateArticleDto, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const handleDelete = (slug: string) => {
        if (confirm("Are you sure you want to delete this article?")) {
            deleteArticle.mutate(slug);
        }
    };

    const isSaving = createArticle.isPending || updateArticle.isPending;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manajemen Artikel</h1>
                <p className="text-muted-foreground">Kelola artikel dan kategori untuk website.</p>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto">
                <button
                    onClick={() => setActiveTab("articles")}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "articles" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Daftar Artikel ({articles?.length || 0})
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === "categories" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" /> Kategori & Tag
                    </div>
                </button>
            </div>

            {/* Tab: Daftar Artikel */}
            {activeTab === "articles" && (
                <>
                    <div className="flex justify-between items-center">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Create Article
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading articles...</div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="p-4 font-medium w-[40%]">Title</th>
                                            <th className="p-4 font-medium">Slug</th>
                                            <th className="p-4 font-medium">Author</th>
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredArticles.map((article) => (
                                            <tr key={article.id} className="hover:bg-slate-50/50">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900">
                                                        {article.title}
                                                        {article.excerpt && (
                                                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{article.excerpt}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-500 text-sm font-mono">{article.slug}</td>
                                                <td className="p-4 text-slate-600">{article.author || "-"}</td>
                                                <td className="p-4 text-slate-600">{new Date(article.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild title="View" className="w-8 h-8 text-slate-500 hover:text-primary hover:bg-slate-100">
                                                            <NextLink href={`/artikel/${article.slug}`} target="_blank">
                                                                <Eye className="h-4 w-4" />
                                                            </NextLink>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(article)} title="Edit" className="w-8 h-8 text-slate-500 hover:text-blue-600 hover:bg-slate-100">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-8 h-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDelete(article.slug)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredArticles.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-16 text-center text-slate-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <p>No articles found</p>
                                                        <Button variant="outline" size="sm" onClick={handleCreate}>Create your first article</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <ArticleModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        article={currentArticle}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                </>
            )}

            {/* Tab: Kategori & Tag */}
            {activeTab === "categories" && (
                <CategoryManagement />
            )}
        </div>
    );
}
