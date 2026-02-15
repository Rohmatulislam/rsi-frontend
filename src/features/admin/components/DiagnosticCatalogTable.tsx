"use client";

import { useState } from "react";
import { Edit2, Search, FlaskConical, Activity, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DiagnosticCatalogItem } from "../api/getDiagnosticCatalog";
import { useUpdateDiagnosticMetadata } from "../api/updateDiagnosticMetadata";

interface DiagnosticCatalogTableProps {
    items: DiagnosticCatalogItem[] | undefined;
    isLoading: boolean;
    type: 'LAB' | 'RADIOLOGY';
}

export function DiagnosticCatalogTable({ items, isLoading, type }: DiagnosticCatalogTableProps) {
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState<DiagnosticCatalogItem | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const updateMetadata = useUpdateDiagnosticMetadata();

    // Form state
    const [formData, setFormData] = useState({
        description: "",
        preparation: "",
        estimatedTime: "",
        isPopular: false,
    });

    const filteredItems = items?.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (item: DiagnosticCatalogItem) => {
        setSelectedItem(item);
        setFormData({
            description: item.description || "",
            preparation: item.preparation?.join("\n") || "",
            estimatedTime: item.estimatedTime || "",
            isPopular: item.isPopular || false,
        });
        setIsEditDialogOpen(true);
    };

    const handleSave = async () => {
        if (!selectedItem) return;

        await updateMetadata.mutateAsync({
            treatmentId: selectedItem.id,
            type: selectedItem.type,
            ...formData,
        });

        setIsEditDialogOpen(false);
    };

    return (
        <Card className="border-none shadow-md overflow-hidden ring-1 ring-border">
            <CardHeader className="bg-secondary border-b border-border py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    {type === 'LAB' ? <FlaskConical className="h-5 w-5 text-primary" /> : <Activity className="h-5 w-5 text-primary" />}
                    Katalog {type === 'LAB' ? 'Laboratorium' : 'Radiologi'}
                </CardTitle>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari pemeriksaan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 rounded-xl text-xs"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Kode & Nama Pemeriksaan</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Status Metadata</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredItems?.map((item) => {
                                    const isComplete = item.description && item.description.length > 20;
                                    return (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-slate-900">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{item.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="text-[10px] font-medium border-slate-200">
                                                    {item.category || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isComplete ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] gap-1 px-2 font-bold uppercase tracking-wider">
                                                        <CheckCircle2 className="h-3 w-3" /> Lengkap
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px] gap-1 px-2 font-bold uppercase tracking-wider">
                                                        <AlertCircle className="h-3 w-3" /> Perlu Update
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-2 rounded-lg text-primary hover:text-primary hover:bg-primary/10 transition-all font-bold"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" /> Edit Metadata
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-xl rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit2 className="h-5 w-5 text-primary" />
                            Edit Metadata Pemeriksaan
                        </DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">
                            {selectedItem?.name} ({selectedItem?.id})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Deskripsi Layanan</Label>
                            <Textarea
                                id="description"
                                placeholder="Jelaskan apa itu pemeriksaan ini..."
                                className="min-h-[120px] rounded-2xl resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="preparation" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Instruksi Persiapan (Satu per baris)</Label>
                            <Textarea
                                id="preparation"
                                placeholder="Contoh: Puasa 10 jam\nHindari rokok..."
                                className="min-h-[100px] rounded-2xl resize-none font-mono text-xs"
                                value={formData.preparation}
                                onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="time" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Estimasi Waktu</Label>
                                <Input
                                    id="time"
                                    placeholder="Contoh: 30-45 menit"
                                    className="rounded-xl"
                                    value={formData.estimatedTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Label htmlFor="popular" className="font-black text-[10px] uppercase tracking-widest text-slate-600">Terpopuler</Label>
                                <input
                                    type="checkbox"
                                    id="popular"
                                    className="h-5 w-5 accent-primary cursor-pointer"
                                    checked={formData.isPopular}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
                        <Button
                            className="rounded-xl px-8 font-black tracking-tight shadow-lg shadow-primary/20"
                            onClick={handleSave}
                            disabled={updateMetadata.isPending}
                        >
                            {updateMetadata.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
