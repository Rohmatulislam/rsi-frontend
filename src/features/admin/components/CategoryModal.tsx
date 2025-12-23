"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Category, CreateCategoryDto } from "../types/category";

type CategoryFormData = CreateCategoryDto & {
    description: string;
    icon: string;
    color: string;
    order: number;
    isActive: boolean;
};

type CategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSave: (data: CategoryFormData, isEdit: boolean) => void;
    isSaving: boolean;
};

export const CategoryModal = ({ isOpen, onClose, category, onSave, isSaving }: CategoryModalProps) => {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        slug: "",
        type: "ARTICLE_CATEGORY",
        description: "",
        icon: "",
        color: "",
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                slug: category.slug,
                type: category.type as "ARTICLE_CATEGORY" | "ARTICLE_TAG",
                description: "",
                icon: "",
                color: "",
                order: 0,
                isActive: category.isActive,
            });
        } else {
            setFormData({
                name: "",
                slug: "",
                type: "ARTICLE_CATEGORY",
                description: "",
                icon: "",
                color: "",
                order: 0,
                isActive: true,
            });
        }
    }, [category, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            if (name === "name" && !category) {
                updates.slug = value.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
            }
            return updates;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, !!category);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Kategori" : "Buat Kategori Baru"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Nama kategori..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required placeholder="slug-kategori" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipe</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "ARTICLE_CATEGORY" | "ARTICLE_TAG" }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ARTICLE_CATEGORY">Kategori Artikel</SelectItem>
                                <SelectItem value="ARTICLE_TAG">Tag / Topik Populer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="resize-none" placeholder="Deskripsi singkat..." />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="isActive">Aktif</Label>
                        <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))} />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
