"use client";

import { useState, useEffect } from "react";
import { useGetPartners } from "~/features/partner/api/getPartners";
import { useDeletePartner } from "~/features/partner/api/deletePartner";
import { useReorderPartners } from "~/features/partner/api/reorderPartners";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Partner } from "~/features/partner/services/partnerService";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { PartnerModal } from "~/features/partner/components/PartnerModal";
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

export default function PartnersPage() {
    const { data: partners, isLoading } = useGetPartners();
    const deleteMutation = useDeletePartner();
    const reorderMutation = useReorderPartners();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);

    // Local state for immediate drag-and-drop feedback
    const [localPartners, setLocalPartners] = useState<Partner[]>([]);

    // Update local state when query data changes
    useEffect(() => {
        if (partners) {
            setLocalPartners(partners);
        }
    }, [partners]);

    // Handle drag end
    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination || !partners) return;

        const items = Array.from(localPartners);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state immediately for snappy UI
        setLocalPartners(items);

        // Prepare data for backend
        const reorderData = items.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        reorderMutation.mutate(reorderData);
    };

    // Use local partners if available, fallback to query data
    const displayPartners = localPartners.length > 0 ? localPartners : (partners || []);

    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setIsModalOpen(true);
    };

    const handleDelete = (partner: Partner) => {
        setDeletingPartner(partner);
    };

    const confirmDelete = () => {
        if (deletingPartner) {
            deleteMutation.mutate(deletingPartner.id);
            setDeletingPartner(null);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingPartner(null);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-serif">Kemitraan Kami</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola logo instansi dan asuransi rekanan
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="rounded-full">
                    <Plus className="mr-2 h-5 w-5" />
                    Tambah Mitra
                </Button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i} className="rounded-2xl">
                                <CardContent className="p-4">
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                    <Skeleton className="h-4 w-3/4 mt-4" />
                                </CardContent>
                            </Card>
                        ))}
                </div>
            ) : displayPartners.length > 0 ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="partners" direction="horizontal">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                            >
                                {displayPartners.map((partner: Partner, index: number) => (
                                    <Draggable key={partner.id} draggableId={partner.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "transition-shadow",
                                                    snapshot.isDragging && "shadow-2xl z-50 ring-2 ring-primary/50 rounded-2xl"
                                                )}
                                            >
                                                <Card className="overflow-hidden h-full rounded-2xl group border-blue-50 dark:border-slate-800">
                                                    <CardHeader className="p-0 relative">
                                                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-lg text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                                                                <GripVertical className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                        <div className="aspect-[3/2] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50">
                                                            <img
                                                                src={getImageSrc(partner.imageUrl)}
                                                                alt={partner.name}
                                                                className="max-w-full max-h-full object-contain"
                                                                draggable={false}
                                                            />
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-4 space-y-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h3 className="font-bold text-sm line-clamp-1 flex-1">
                                                                {partner.name}
                                                            </h3>
                                                            <Badge variant={partner.isActive ? "default" : "secondary"} className="text-[10px] h-5 px-1.5">
                                                                {partner.isActive ? "Aktif" : "Nonaktif"}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex gap-2 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(partner)}
                                                                className="flex-1 h-8 text-xs rounded-lg"
                                                            >
                                                                <Edit className="h-3 w-3 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(partner)}
                                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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
                <Card className="rounded-2xl border-dashed">
                    <CardContent className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">Belum ada mitra</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                            Klik tombol "Tambah Mitra" di pojok kanan atas untuk mulai mengelola daftar kemitraan.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Modal */}
            <PartnerModal
                open={isModalOpen}
                onClose={handleModalClose}
                partner={editingPartner}
            />

            {/* Delete Dialog */}
            <AlertDialog
                open={!!deletingPartner}
                onOpenChange={(open: boolean) => !open && setDeletingPartner(null)}
            >
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mitra?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus mitra "{deletingPartner?.name}"?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 text-white hover:bg-red-600 rounded-full"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
