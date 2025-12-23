"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag, FolderOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetCategories, Category } from "~/features/admin/api/getCategories";
import { useCreateCategory } from "~/features/admin/api/createCategory";
import { useUpdateCategory } from "~/features/admin/api/updateCategory";
import { useDeleteCategory } from "~/features/admin/api/deleteCategory";
import { CategoryModal } from "~/features/admin/components/CategoryModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";

export default function AdminCategoriesPage() {
    const { data: categories = [], isLoading } = useGetCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    const articleCategories = categories.filter(c => c.type === "ARTICLE_CATEGORY");
    const articleTags = categories.filter(c => c.type === "ARTICLE_TAG");

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: any, isEdit: boolean) => {
        try {
            // Clean up payload - remove empty strings and ensure proper types
            const cleanedData = {
                name: formData.name,
                slug: formData.slug,
                type: formData.type,
                isActive: formData.isActive,
                ...(formData.description && { description: formData.description }),
                ...(formData.icon && { icon: formData.icon }),
                ...(formData.color && { color: formData.color }),
                ...(formData.order !== undefined && formData.order !== 0 && { order: Number(formData.order) }),
            };

            console.log("Sending category data:", cleanedData);

            if (isEdit && selectedCategory) {
                await updateMutation.mutateAsync({ id: selectedCategory.id, data: cleanedData });
            } else {
                await createMutation.mutateAsync(cleanedData);
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Failed to save category:", error);
            console.error("Response data:", JSON.stringify(error?.response?.data, null, 2));
        }
    };

    const handleDelete = async () => {
        if (deleteCategory) {
            try {
                await deleteMutation.mutateAsync(deleteCategory.id);
                setDeleteCategory(null);
            } catch (error) {
                console.error("Failed to delete category:", error);
            }
        }
    };

    const renderCategoryTable = (items: Category[], title: string, icon: React.ReactNode, description: string) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Belum ada data. Klik "Tambah Baru" untuk membuat.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(cat => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant={cat.isActive ? "default" : "secondary"}>
                                            {cat.isActive ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteCategory(cat)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kelola Kategori</h1>
                    <p className="text-muted-foreground">Kelola kategori dan tag untuk artikel.</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Baru
                </Button>
            </div>

            <div className="grid gap-6">
                {renderCategoryTable(articleCategories, "Kategori Artikel", <FolderOpen className="h-5 w-5" />, "Digunakan untuk mengelompokkan artikel berdasarkan topik.")}
                {renderCategoryTable(articleTags, "Topik Populer (Tags)", <Tag className="h-5 w-5" />, "Ditampilkan di sidebar homepage sebagai topik populer.")}
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={selectedCategory}
                onSave={handleSave}
                isSaving={createMutation.isPending || updateMutation.isPending}
            />

            <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kategori "{deleteCategory?.name}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
