"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";
import { changePassword } from "../api/changePassword";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const changeMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            toast.success("Password berhasil diubah");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal mengubah password");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error("Password baru minimal 8 karakter");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Konfirmasi password tidak sesuai");
            return;
        }

        changeMutation.mutate({ currentPassword, newPassword });
    };

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
                        <h1 className="text-3xl font-bold text-slate-900">Ubah Password</h1>
                        <p className="text-muted-foreground">Ganti password akun Anda</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Keamanan Akun
                            </CardTitle>
                            <CardDescription>
                                Pastikan password baru minimal 8 karakter dan berbeda dari password lama
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Password Saat Ini</Label>
                                    <div className="relative">
                                        <Input
                                            id="current-password"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Masukkan password saat ini"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Password Baru</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi password baru"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={changeMutation.isPending}
                                >
                                    {changeMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Mengubah Password...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4 mr-2" />
                                            Ubah Password
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

export default ChangePasswordPage;
