"use client";

import { useState } from "react";
import { useGetBanners } from "~/features/banner/api/getBanners";
import { useDeleteBanner } from "~/features/banner/api/deleteBanner";
import { useReorderBanners } from "~/features/banner/api/reorderBanners";
import { Banner } from "~/features/banner/services/bannerService";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { BannerModal } from "~/features/admin/components/BannerModal";
import { getImageSrc } from "~/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export default function BannersPage() {
    const { data: banners, isLoading } = useGetBanners();
    const deleteMutation = useDeleteBanner();
    const reorderMutation = useReorderBanners();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    const handleDelete = (banner: Banner) => {
        setDeletingBanner(banner);
    };

    const confirmDelete = () => {
        if (deletingBanner) {
            deleteMutation.mutate(deletingBanner.id);
            setDeletingBanner(null);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Banner Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola banner slider di homepage
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Tambah Banner
                </Button>
            </div>

            {/* Banner List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-48 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                </div>
            ) : banners && banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <Card key={banner.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-1">
                                            {banner.title}
                                        </CardTitle>
                                        {banner.subtitle && (
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                                        {banner.isActive ? (
                                            <>
                                                <Eye className="h-3 w-3 mr-1" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                Inactive
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Image Preview */}
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={getImageSrc(banner.imageUrl)}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Description */}
                                {banner.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {banner.description}
                                    </p>
                                )}

                                {/* Link */}
                                {banner.link && (
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Link: </span>
                                        <a
                                            href={banner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline truncate"
                                        >
                                            {banner.link}
                                        </a>
                                    </div>
                                )}

                                {/* Order */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <GripVertical className="h-4 w-4" />
                                    <span>Order: {banner.order}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(banner)}
                                        className="flex-1"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(banner)}
                                        className="flex-1"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Belum ada banner. Klik tombol "Tambah Banner" untuk membuat banner
                            pertama.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Create/Edit Modal */}
            <BannerModal
                open={isModalOpen}
                onClose={handleModalClose}
                banner={editingBanner}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingBanner}
                onOpenChange={(open) => !open && setDeletingBanner(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus banner "{deletingBanner?.title}"?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
