"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Upload, X, Check } from "lucide-react";
import { Badge } from "~/components/ui/badge";

import { ArticleDto } from "~/features/article/services/articleService";
import { CreateArticleDto, UpdateArticleDto } from "~/features/admin/types/article";
import { getImageSrc } from "~/lib/utils";
import { useGetCategories } from "../api/getCategories";

type ArticleModalProps = {
    isOpen: boolean;
    onClose: () => void;
    article: ArticleDto | null;
    onSave: (data: CreateArticleDto | UpdateArticleDto, isEdit: boolean) => void;
    isSaving: boolean;
};

export const ArticleModal = ({ isOpen, onClose, article, onSave, isSaving }: ArticleModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: categories = [] } = useGetCategories();
    const [formData, setFormData] = useState<CreateArticleDto>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image: "",
        isActive: true,
        categoryIds: [],
    });

    const articleCategories = categories.filter(c => c.type === "ARTICLE_CATEGORY");
    const popularTopics = categories.filter(c => c.type === "ARTICLE_TAG");

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                slug: article.slug,
                content: article.content,
                excerpt: article.excerpt || "",
                image: article.image || "",
                isActive: true,
                categoryIds: article.categories?.map(c => c.id) || [],
            });
        } else {
            setFormData({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                image: "",
                isActive: true,
                categoryIds: [],
            });
        }
    }, [article, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            if (name === "title" && (!article)) {
                if (!prev.slug || prev.slug === "") {
                    updates.slug = value.toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');
                }
            }
            return updates;
        });
    };

    const toggleCategoryId = (id: string) => {
        setFormData(prev => {
            const currentIds = prev.categoryIds || [];
            if (currentIds.includes(id)) {
                return { ...prev, categoryIds: currentIds.filter(cid => cid !== id) };
            } else {
                return { ...prev, categoryIds: [...currentIds, id] };
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large (max 5MB)");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, !!article);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 border-b bg-slate-50/50">
                    <DialogTitle className="text-xl">{article ? "Edit Article" : "Create New Article"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                                {article && <p className="text-xs text-yellow-600">Warning: Changing slug will change the URL.</p>}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Featured Image</Label>
                                <div className="flex flex-col gap-4 p-4 border rounded-xl border-dashed bg-slate-50/50 transition-colors hover:bg-slate-50">
                                    <div className="flex items-center gap-6">
                                        {formData.image ? (
                                            <div className="relative shrink-0">
                                                <div className="w-40 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={getImageSrc(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-40 h-28 rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 gap-2 shrink-0">
                                                <Upload className="w-6 h-6" />
                                                <span className="text-[10px] font-medium">No Image</span>
                                            </div>
                                        )}

                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={triggerFileInput}
                                                    className="w-full bg-white hover:bg-slate-50 border-slate-200"
                                                >
                                                    {formData.image ? "Ganti Gambar" : "Unggah Gambar"}
                                                </Button>
                                                <p className="text-[10px] text-muted-foreground leading-tight">
                                                    Format: JPG, PNG, WEBP (Maks. 5MB). Rekomendasi rasio 16:9.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Categories</Label>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-1">
                                    {articleCategories.length > 0 ? articleCategories.map(cat => (
                                        <Badge
                                            key={cat.id}
                                            variant={formData.categoryIds?.includes(cat.id) ? "default" : "outline"}
                                            className={`cursor-pointer py-1.5 px-4 rounded-full transition-all border-slate-200 ${formData.categoryIds?.includes(cat.id)
                                                ? "bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                                                : "bg-white hover:border-primary/50"
                                                }`}
                                            onClick={() => toggleCategoryId(cat.id)}
                                        >
                                            {cat.name}
                                            {formData.categoryIds?.includes(cat.id) && <Check className="ml-1.5 w-3 h-3" />}
                                        </Badge>
                                    )) : (
                                        <p className="text-xs text-muted-foreground italic">No categories found.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Popular Topics (Tags)</Label>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-1">
                                    {popularTopics.length > 0 ? popularTopics.map(tag => (
                                        <Badge
                                            key={tag.id}
                                            variant={formData.categoryIds?.includes(tag.id) ? "secondary" : "outline"}
                                            className={`cursor-pointer py-1.5 px-4 rounded-full transition-all border-slate-200 ${formData.categoryIds?.includes(tag.id)
                                                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md shadow-secondary/20"
                                                : "bg-white hover:border-secondary/50"
                                                }`}
                                            onClick={() => toggleCategoryId(tag.id)}
                                        >
                                            {tag.name}
                                            {formData.categoryIds?.includes(tag.id) && <Check className="ml-1.5 w-3 h-3" />}
                                        </Badge>
                                    )) : (
                                        <p className="text-xs text-muted-foreground italic">No topics found.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="text-sm font-semibold">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={3}
                                    className="resize-none rounded-xl bg-slate-50/30 focus:bg-white transition-colors"
                                    placeholder="Ringkasan singkat artikel..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-sm font-semibold">Content</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    rows={22}
                                    className="font-mono text-sm rounded-xl bg-slate-50/30 focus:bg-white transition-colors p-4"
                                    placeholder="Tulis isi artikel di sini (Markdown didukung)..."
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t bg-slate-50/50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-slate-200">Batal</Button>
                    <Button type="submit" disabled={isSaving} onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e as any);
                    }} className="px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        {isSaving ? "Menyimpan..." : "Simpan Artikel"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
