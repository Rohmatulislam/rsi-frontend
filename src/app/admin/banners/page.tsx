"use client";

import { useState, useEffect } from "react";
import { useGetBanners } from "~/features/banner/api/getBanners";
import { useDeleteBanner } from "~/features/banner/api/deleteBanner";
import { useReorderBanners } from "~/features/banner/api/reorderBanners";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
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
import { cn } from "~/lib/utils";

export default function BannersPage() {
    const { data: banners, isLoading } = useGetBanners();
    const deleteMutation = useDeleteBanner();
    const reorderMutation = useReorderBanners();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

    // Local state for immediate drag-and-drop feedback
    const [localBanners, setLocalBanners] = useState<Banner[]>([]);

    // Update local state when query data changes
    useEffect(() => {
        if (banners) {
            setLocalBanners(banners);
        }
    }, [banners]);

    // Handle drag end
    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination || !banners) return;

        const items = Array.from(localBanners);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state immediately for snappy UI
        setLocalBanners(items);

        // Prepare data for backend
        const reorderData = items.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        reorderMutation.mutate(reorderData);
    };

    // Use local banners if available, fallback to query data
    const displayBanners = localBanners.length > 0 ? localBanners : (banners || []);

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
            ) : displayBanners.length > 0 ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="banners" direction="horizontal">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {displayBanners.map((banner, index) => (
                                    <Draggable key={banner.id} draggableId={banner.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "transition-shadow",
                                                    snapshot.isDragging && "shadow-2xl z-50 ring-2 ring-primary/50 rounded-xl"
                                                )}
                                            >
                                                <Card className="overflow-hidden h-full">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 flex gap-2">
                                                                <div {...provided.dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                                                                    <GripVertical className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <CardTitle className="text-lg line-clamp-1">
                                                                        {banner.title}
                                                                    </CardTitle>
                                                                    {banner.subtitle && (
                                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                            {banner.subtitle}
                                                                        </p>
                                                                    )}
                                                                </div>
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
                                                                draggable={false}
                                                            />
                                                        </div>

                                                        {/* Description */}
                                                        {banner.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                                                {banner.description}
                                                            </p>
                                                        )}

                                                        {/* Link */}
                                                        {banner.link && (
                                                            <div className="text-sm truncate">
                                                                <span className="text-muted-foreground">Link: </span>
                                                                <a
                                                                    href={banner.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {banner.link}
                                                                </a>
                                                            </div>
                                                        )}

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
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
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
