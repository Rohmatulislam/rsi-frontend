"use client";

import { useState } from "react";
import { RefreshCw, Loader2, Upload, ImageIcon, Building2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetUnits, UnitDto } from "~/features/inpatient/api/getUnits";
import { useSyncUnits } from "~/features/admin/api/syncUnits";
import { useUpdateUnit } from "~/features/admin/api/updateUnit";
import { ImageUploadField } from "~/features/admin/components/ImageUploadField";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export const UnitManagement = () => {
    const { data: units, isLoading } = useGetUnits();
    const syncUnits = useSyncUnits();
    const updateUnit = useUpdateUnit();

    const [editingUnit, setEditingUnit] = useState<UnitDto | null>(null);
    const [formData, setFormData] = useState({ imageUrl: "", description: "", isActive: true });

    const handleEditClick = (unit: UnitDto) => {
        setEditingUnit(unit);
        setFormData({
            imageUrl: unit.imageUrl || "",
            description: unit.description || "",
            isActive: unit.isActive,
        });
    };

    const handleSave = () => {
        if (!editingUnit) return;
        updateUnit.mutate(
            { id: editingUnit.id, data: formData },
            { onSuccess: () => setEditingUnit(null) }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Unit Perawatan</h2>
                    <p className="text-muted-foreground">
                        Kelola gambar dan informasi unit rawat inap
                    </p>
                </div>
                <Button
                    onClick={() => syncUnits.mutate()}
                    disabled={syncUnits.isPending}
                    variant="outline"
                >
                    {syncUnits.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Sync dari SIMRS
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-xl" />
                    ))}
                </div>
            ) : units?.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-16 text-center">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Belum ada data unit</h3>
                        <p className="text-muted-foreground mb-4">
                            Klik tombol "Sync dari SIMRS" untuk mengambil data unit dari SIMRS Khanza.
                        </p>
                        <Button onClick={() => syncUnits.mutate()} disabled={syncUnits.isPending}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Sekarang
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units?.map((unit) => (
                        <Card key={unit.id} className="overflow-hidden group">
                            <div className="aspect-video relative bg-muted">
                                {unit.imageUrl ? (
                                    <img
                                        src={unit.imageUrl}
                                        alt={unit.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleEditClick(unit)}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Edit Gambar
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                                    <Badge variant={unit.isActive ? "default" : "secondary"}>
                                        {unit.isActive ? "Aktif" : "Non-aktif"}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Kode: {unit.kd_bangsal}
                                </CardDescription>
                            </CardHeader>
                            {unit.description && (
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {unit.description}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingUnit} onOpenChange={(open: boolean) => !open && setEditingUnit(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Unit: {editingUnit?.name}</DialogTitle>
                        <DialogDescription>
                            Upload gambar dan tambahkan deskripsi untuk unit ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Gambar Unit</Label>
                            <ImageUploadField
                                value={formData.imageUrl}
                                onChange={(value: string) => setFormData({ ...formData, imageUrl: value })}
                                label="Upload Gambar"
                                placeholder="Klik untuk upload gambar unit"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Deskripsi singkat tentang unit..."
                                className="h-24"
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="is-active">Tampilkan di Publik</Label>
                                <p className="text-xs text-muted-foreground">
                                    Aktifkan agar unit ini muncul di halaman Rawat Inap publik.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                id="is-active"
                                checked={formData.isActive}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all hover:scale-110"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditingUnit(null)}>
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={updateUnit.isPending}>
                            {updateUnit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
