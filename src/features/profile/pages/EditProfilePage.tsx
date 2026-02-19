"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ArrowLeft, Save, Loader2, Camera } from "lucide-react";
import Link from "next/link";
import { useAuth } from "~/features/auth/hook/useAuth";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";
import { updateProfile } from "../api/getProfile";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export const EditProfilePage = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [nik, setNik] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            // @ts-ignore
            if (user.profile?.phone) setPhone(user.profile.phone);
            // @ts-ignore
            if (user.profile?.nik) setNik(user.profile.nik);
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profil berhasil diperbarui");
            // Force reload to update session data
            window.location.href = "/profil";
        },
        onError: () => {
            toast.error("Gagal memperbarui profil");
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file terlalu besar. Maksimal 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            name: name || undefined,
            phone: phone || undefined,
            nik: nik || undefined,
            image: imagePreview || undefined,
        });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="mb-8">
                        <Button variant="ghost" asChild className="mb-4">
                            <Link href="/profil">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Profil
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900">Edit Profil</h1>
                        <p className="text-muted-foreground">Perbarui informasi akun Anda</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pribadi</CardTitle>
                            <CardDescription>Ubah nama, foto, dan nomor telepon Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={imagePreview || user?.image || undefined} />
                                            <AvatarFallback className="bg-primary text-white text-2xl">
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Klik ikon kamera untuk mengganti foto
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="bg-slate-100"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email tidak dapat diubah
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
                                    <Input
                                        id="nik"
                                        value={nik}
                                        onChange={(e) => setNik(e.target.value)}
                                        placeholder="Masukkan 16 digit NIK Anda (Sesuai KTP/Data RS)"
                                        maxLength={16}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        NIK digunakan untuk menyambungkan akun dengan data Rekam Medis.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Contoh: 08123456789"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default EditProfilePage;
