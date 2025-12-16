"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ArrowLeft, Plus, Trash2, Loader2, Users, User } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";
import { getFamilyMembers, addFamilyMember, removeFamilyMember, FamilyMember } from "../api/getFamilyMembers";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";

const RELATIONSHIP_OPTIONS = [
    { value: "spouse", label: "Suami/Istri" },
    { value: "child", label: "Anak" },
    { value: "parent", label: "Orang Tua" },
    { value: "sibling", label: "Saudara Kandung" },
    { value: "other", label: "Lainnya" },
];

const getRelationshipLabel = (value: string) => {
    return RELATIONSHIP_OPTIONS.find(opt => opt.value === value)?.label || value;
};

export const FamilyManagementPage = () => {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        relationship: "",
        nik: "",
        birthDate: "",
        gender: "",
        phone: "",
    });

    const { data: familyMembers = [], isLoading } = useQuery<FamilyMember[]>({
        queryKey: ["familyMembers"],
        queryFn: getFamilyMembers,
    });

    const addMutation = useMutation({
        mutationFn: addFamilyMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["familyMembers"] });
            toast.success("Anggota keluarga berhasil ditambahkan");
            setIsDialogOpen(false);
            setFormData({ name: "", relationship: "", nik: "", birthDate: "", gender: "", phone: "" });
        },
        onError: () => {
            toast.error("Gagal menambahkan anggota keluarga");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: removeFamilyMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["familyMembers"] });
            toast.success("Anggota keluarga berhasil dihapus");
        },
        onError: () => {
            toast.error("Gagal menghapus anggota keluarga");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.relationship) {
            toast.error("Nama dan hubungan wajib diisi");
            return;
        }
        addMutation.mutate(formData);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <Button variant="ghost" asChild className="mb-4">
                                <Link href="/profil">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Kembali ke Profil
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold text-slate-900">Data Keluarga</h1>
                            <p className="text-muted-foreground">
                                Kelola anggota keluarga untuk kemudahan pendaftaran booking
                            </p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Anggota Keluarga</DialogTitle>
                                    <DialogDescription>
                                        Data anggota keluarga dapat digunakan untuk mempermudah pendaftaran booking
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Lengkap *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Nama lengkap"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hubungan *</Label>
                                        <Select
                                            value={formData.relationship}
                                            onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih hubungan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {RELATIONSHIP_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nik">NIK</Label>
                                            <Input
                                                id="nik"
                                                value={formData.nik}
                                                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                                placeholder="Nomor KTP"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">No. Telepon</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="birthDate">Tanggal Lahir</Label>
                                            <Input
                                                id="birthDate"
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jenis Kelamin</Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="L">Laki-laki</SelectItem>
                                                    <SelectItem value="P">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={addMutation.isPending}>
                                            {addMutation.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                "Simpan"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : familyMembers.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Users className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Belum Ada Data Keluarga</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                    Tambahkan anggota keluarga untuk mempermudah proses booking
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {familyMembers.map((member) => (
                                <Card key={member.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{member.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {getRelationshipLabel(member.relationship)}
                                                    </p>
                                                    {member.phone && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {member.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => deleteMutation.mutate(member.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default FamilyManagementPage;
