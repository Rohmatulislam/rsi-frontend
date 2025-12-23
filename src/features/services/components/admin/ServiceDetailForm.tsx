"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Layout } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ImageUploadField } from "~/features/admin/components/ImageUploadField";
import { ServiceDto } from "../../types";

interface ServiceDetailFormProps {
    service: ServiceDto;
    isUpdating: boolean;
    onUpdate: (data: any) => void;
}

export function ServiceDetailForm({ service, isUpdating, onUpdate }: ServiceDetailFormProps) {
    const [metadata, setMetadata] = useState({
        name: service.name,
        title: service.title || "",
        subtitle: service.subtitle || "",
        description: service.description || "",
        image: service.image || "",
        isActive: service.isActive,
        isFeatured: service.isFeatured,
        order: service.order
    });

    useEffect(() => {
        setMetadata({
            name: service.name,
            title: service.title || "",
            subtitle: service.subtitle || "",
            description: service.description || "",
            image: service.image || "",
            isActive: service.isActive,
            isFeatured: service.isFeatured,
            order: service.order
        });
    }, [service]);

    const handleSave = () => {
        onUpdate(metadata);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Utama</CardTitle>
                        <CardDescription>Gunakan teks yang menarik untuk halaman publik.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul Utama (Hero Title)</Label>
                            <Input
                                id="title"
                                value={metadata.title}
                                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                placeholder="Contoh: Paket Medical Check Up Terlengkap"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtitle">Sub-judul (Hero Subtitle)</Label>
                            <Input
                                id="subtitle"
                                value={metadata.subtitle}
                                onChange={(e) => setMetadata({ ...metadata, subtitle: e.target.value })}
                                placeholder="Contoh: Deteksi dini untuk kesehatan masa depan Anda."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi Lengkap</Label>
                            <Textarea
                                id="description"
                                value={metadata.description}
                                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                className="h-32"
                                placeholder="Jelaskan mengenai layanan ini secara mendalam..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan Tampilan</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/50">
                            <div className="space-y-0.5">
                                <Label>Status Aktif</Label>
                                <p className="text-xs text-muted-foreground">Tampilkan di menu navigasi.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={metadata.isActive}
                                onChange={(e) => setMetadata({ ...metadata, isActive: e.target.checked })}
                                className="w-5 h-5 accent-primary cursor-pointer"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/50">
                            <div className="space-y-0.5">
                                <Label>Layanan Unggulan</Label>
                                <p className="text-xs text-muted-foreground">Tampilkan di halaman utama.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={metadata.isFeatured}
                                onChange={(e) => setMetadata({ ...metadata, isFeatured: e.target.checked })}
                                className="w-5 h-5 accent-accent cursor-pointer"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="order">Urutan Tampilan</Label>
                            <Input
                                id="order"
                                type="number"
                                value={metadata.order}
                                onChange={(e) => setMetadata({ ...metadata, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Banner Layanan</CardTitle>
                        <CardDescription>Gambar yang muncul pada bagian hero.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUploadField
                            value={metadata.image}
                            onChange={(value) => setMetadata({ ...metadata, image: value })}
                            label="Upload Banner"
                            placeholder="Click to upload hero image"
                        />
                    </CardContent>
                </Card>

                <div className="sticky top-6">
                    <Button
                        className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                        onClick={handleSave}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Simpan Perubahan
                    </Button>
                </div>
            </div>
        </div>
    );
}
