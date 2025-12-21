"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Upload, Trash2, X } from "lucide-react";

import { ArticleDto } from "~/features/article/services/articleService";
import { CreateArticleDto, UpdateArticleDto } from "~/features/admin/types/article";
import { getImageSrc } from "~/lib/utils";

type ArticleModalProps = {
    isOpen: boolean;
    onClose: () => void;
    article: ArticleDto | null;
    onSave: (data: CreateArticleDto | UpdateArticleDto, isEdit: boolean) => void;
    isSaving: boolean;
};

export const ArticleModal = ({ isOpen, onClose, article, onSave, isSaving }: ArticleModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<CreateArticleDto>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image: "",
        isActive: true,
    });

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                slug: article.slug,
                content: article.content,
                excerpt: article.excerpt || "",
                image: article.image || "",
                isActive: true,
            });
        } else {
            setFormData({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                image: "",
                isActive: true,
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{article ? "Edit Article" : "Create New Article"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                        {article && <p className="text-xs text-yellow-600">Warning: Changing slug will change the URL.</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <div className="flex items-start gap-4 p-4 border rounded-md border-dashed bg-slate-50">
                            {formData.image ? (
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={getImageSrc(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-300">
                                    <Upload className="w-8 h-8" />
                                </div>
                            )}

                            <div className="flex-1 space-y-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col gap-1">
                                    <Button type="button" variant="secondary" onClick={triggerFileInput}>
                                        {formData.image ? "Change Image" : "Upload Image"}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Max 5MB. SVG, PNG, JPG or GIF.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} required rows={10} className="font-mono text-sm" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
