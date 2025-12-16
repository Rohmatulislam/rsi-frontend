"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
    User,
    Mail,
    Calendar,
    Settings,
    History,
    LogOut,
    Shield,
    Stethoscope,
    Users,
    Briefcase,
    Edit,
    Lock,
    FileText,
    UserPlus
} from "lucide-react";
import Link from "next/link";
import { useAuth, UserRole } from "~/features/auth/hook/useAuth";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";

// Role display names in Indonesian
const ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "Administrator",
    DOCTOR: "Dokter",
    NURSE: "Perawat",
    STAFF: "Staff",
    PATIENT: "Pasien",
};

// Role icons
const ROLE_ICONS: Record<UserRole, React.ElementType> = {
    ADMIN: Shield,
    DOCTOR: Stethoscope,
    NURSE: Users,
    STAFF: Briefcase,
    PATIENT: User,
};

// Role badge colors
const ROLE_COLORS: Record<UserRole, string> = {
    ADMIN: "bg-red-500",
    DOCTOR: "bg-blue-500",
    NURSE: "bg-green-500",
    STAFF: "bg-purple-500",
    PATIENT: "bg-slate-500",
};

const ProfilePage = () => {
    const { user, role, isLoading, logout, canAccessAdmin } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Memuat profil...</div>
            </div>
        );
    }

    const RoleIcon = ROLE_ICONS[role] || User;
    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "-";

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
                        <p className="text-muted-foreground">Kelola informasi akun Anda</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Profile Card */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Informasi Akun</CardTitle>
                                <CardDescription>Detail akun Anda</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar & Name */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={user?.image || undefined} alt={user?.name} />
                                        <AvatarFallback className="bg-primary text-white text-2xl">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
                                        <Badge className={`${ROLE_COLORS[role]} text-white mt-1`}>
                                            <RoleIcon className="h-3 w-3 mr-1" />
                                            {ROLE_LABELS[role]}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{user?.email || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Bergabung sejak</p>
                                            <p className="font-medium">{formattedDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status Email</p>
                                            <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                                                {user?.emailVerified ? "Terverifikasi" : "Belum Terverifikasi"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/profil/edit">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profil
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/profil/ubah-password">
                                            <Lock className="h-4 w-4 mr-2" />
                                            Ubah Password
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/profil/keluarga">
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Data Keluarga
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/profil/riwayat-kesehatan">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Riwayat Kesehatan
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/riwayat-booking">
                                            <History className="h-4 w-4 mr-2" />
                                            Riwayat Booking
                                        </Link>
                                    </Button>

                                    {canAccessAdmin && (
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <Link href="/admin">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Admin Panel
                                            </Link>
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Info Card */}
                            <Card className="bg-primary/5 border-primary/20">
                                <CardContent className="pt-6">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-primary">Butuh bantuan?</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Hubungi customer service kami di (0370) 671000
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
