"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ServiceItemDto } from "../../types";

interface ServiceItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Partial<ServiceItemDto> | null;
    isSaving: boolean;
    onSave: (data: any) => void;
}

export function ServiceItemModal({ isOpen, onClose, item, isSaving, onSave }: ServiceItemModalProps) {
    const [formData, setFormData] = useState<Partial<ServiceItemDto>>({
        name: "",
        category: "",
        price: 0,
        order: 0,
        isActive: true,
        description: "",
        features: ""
    });

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || "",
                category: item.category || "",
                price: item.price || 0,
                order: item.order || 0,
                isActive: item.isActive ?? true,
                description: item.description || "",
                features: item.features || ""
            });
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{item?.id ? "Edit Item Layanan" : "Tambah Item Layanan"}</DialogTitle>
                        <DialogDescription>Masukkan detail paket atau fasilitas layanan.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="item-name">Nama Item *</Label>
                                <Input
                                    id="item-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="item-category">Kategori/Group (Opsional)</Label>
                                <Input
                                    id="item-category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Gedung Mina / Tes Darah"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="item-price">Harga (Rp)</Label>
                                <Input
                                    id="item-price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="item-order">Urutan</Label>
                                <Input
                                    id="item-order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-description">Deskripsi Singkat</Label>
                            <Textarea
                                id="item-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="h-20"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-features">Fitur (Pisahkan dengan koma)</Label>
                            <Textarea
                                id="item-features"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                className="h-20"
                                placeholder="Konsultasi Dokter, Pemeriksaan Fisik, Thorax..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
