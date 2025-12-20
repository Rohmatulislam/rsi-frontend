"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ListChecks, Package, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ServiceDto, ServiceItemDto } from "../../types";
import { ServiceItemModal } from "./ServiceItemModal";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "~/components/ui/alert-dialog";

interface ServiceItemManagementProps {
    service: ServiceDto;
    isCreatingItem: boolean;
    isUpdatingItem: boolean;
    isDeletingItem: boolean;
    onCreateItem: (data: any) => void;
    onUpdateItem: (id: string, data: any) => void;
    onDeleteItem: (id: string) => void;
}

export function ServiceItemManagement({
    service,
    isCreatingItem,
    isUpdatingItem,
    isDeletingItem,
    onCreateItem,
    onUpdateItem,
    onDeleteItem
}: ServiceItemManagementProps) {
    const [editingItem, setEditingItem] = useState<Partial<ServiceItemDto> | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const handleSaveItem = (data: any) => {
        if (editingItem?.id) {
            onUpdateItem(editingItem.id, data);
        } else {
            onCreateItem(data);
        }
        setEditingItem(null);
    };

    const handleDeleteItem = () => {
        if (itemToDelete) {
            onDeleteItem(itemToDelete);
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" /> Daftar Item Layanan
                </h2>
                <Button
                    className="gap-2"
                    onClick={() => setEditingItem({ name: "", category: "", price: 0, order: service?.items?.length || 0, isActive: true })}
                >
                    <Plus className="h-4 w-4" /> Tambah Item Baru
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {service?.items?.map((item) => (
                    <Card key={item.id} className="group overflow-hidden border-slate-200 hover:border-primary/50 transition-all hover:shadow-md">
                        <CardContent className="p-0">
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        {item.category && (
                                            <Badge variant="secondary" className="mb-1 text-[10px] uppercase font-bold tracking-wider">
                                                {item.category}
                                            </Badge>
                                        )}
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{item.name}</h3>
                                    </div>
                                    {!item.isActive && (
                                        <Badge variant="outline" className="text-red-500 border-red-200">Draft</Badge>
                                    )}
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                    {item.description || "Tidak ada deskripsi."}
                                </p>

                                {item.price !== null && item.price !== undefined && (
                                    <div className="text-lg font-bold text-primary">
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 gap-2 border-t border-slate-100">
                                    <div className="text-[10px] text-slate-400 font-medium">ORDER: {item.order}</div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-primary hover:bg-primary/10"
                                            onClick={() => setEditingItem(item)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => setItemToDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {service?.items?.length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-slate-900">Belum ada item layanan</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                        Tambahkan paket MCU, daftar tes laboratorium, atau kategori fasilitas untuk layanan ini secara mandiri.
                    </p>
                    <Button className="mt-6 gap-2" variant="outline" onClick={() => setEditingItem({ name: "", category: "", price: 0, order: 0, isActive: true })}>
                        <Plus className="h-4 w-4" /> Item Pertama
                    </Button>
                </div>
            )}

            <ServiceItemModal
                isOpen={!!editingItem}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                isSaving={isCreatingItem || isUpdatingItem}
                onSave={handleSaveItem}
            />

            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Item Ini?</AlertDialogTitle>
                        <AlertDialogDescription>Data item akan dihapus secara permanen dari daftar layanan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingItem}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDeleteItem}
                            disabled={isDeletingItem}
                        >
                            {isDeletingItem && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
