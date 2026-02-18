"use client";

import { useState, useMemo } from "react";
import {
    useGetAdminUsers,
    useUpdateAdminUserRole,
    useDeleteAdminUser,
    AdminUser
} from "~/features/admin/api/adminUserApi";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Search,
    User as UserIcon,
    Shield,
    Trash2,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    CheckCircle2,
    XCircle,
    Users,
    UserCheck,
    UserMinus,
    Stethoscope
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Administrator", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
    { value: "DOCTOR", label: "Dokter", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { value: "NURSE", label: "Perawat", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
    { value: "STAFF", label: "Staff", color: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
    { value: "PATIENT", label: "Pasien", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
];

const toTitleCase = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

export default function AdminUsersPage() {
    const { data: users, isLoading } = useGetAdminUsers();
    const updateRoleMutation = useUpdateAdminUserRole();
    const deleteUserMutation = useDeleteAdminUser();

    const [searchQuery, setSearchQuery] = useState("");
    const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const metrics = useMemo(() => {
        if (!users) return null;
        return {
            total: users.length,
            verified: users.filter(u => u.emailVerified).length,
            unverified: users.filter(u => !u.emailVerified).length,
            doctors: users.filter(u => u.role?.toUpperCase() === "DOCTOR").length,
            admins: users.filter(u => u.role?.toUpperCase() === "ADMIN").length,
        };
    }, [users]);

    const handleRoleChange = (userId: string, newRole: string) => {
        updateRoleMutation.mutate({ id: userId, role: newRole });
    };

    const handleDeleteConfirm = () => {
        if (deletingUser) {
            deleteUserMutation.mutate(deletingUser.id);
            setDeletingUser(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">User Management</h1>
                    <p className="text-slate-500 mt-1">Kelola data pengguna, hak akses, dan verifikasi akun.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 h-11 rounded-xl border-slate-200 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Metrics Dashboard */}
            {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-none shadow-sm bg-indigo-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Total User</p>
                                <p className="text-2xl font-bold text-indigo-900">{metrics.total}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-emerald-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Terverifikasi</p>
                                <p className="text-2xl font-bold text-emerald-900">{metrics.verified}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-rose-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                                <UserMinus className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Belum Verif</p>
                                <p className="text-2xl font-bold text-rose-900">{metrics.unverified}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-blue-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                <Stethoscope className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Dokter</p>
                                <p className="text-2xl font-bold text-blue-900">{metrics.doctors}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="p-4 font-medium">User Details</th>
                                <th className="p-4 font-medium">Contact & Verification</th>
                                <th className="p-4 font-medium">Role Access</th>
                                <th className="p-4 font-medium">Joined Date</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                <AvatarImage src={user.image || undefined} />
                                                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 leading-tight">
                                                    {toTitleCase(user.name)}
                                                </span>
                                                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Mail className="h-2.5 w-2.5" /> {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1.5">
                                            {user.profile?.phone ? (
                                                <span className="text-xs text-slate-600 flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3 text-slate-400" /> {user.profile.phone}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No phone</span>
                                            )}
                                            <div className="flex items-center gap-2">
                                                {user.emailVerified ? (
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1 py-0.5">
                                                        <CheckCircle2 className="h-3 w-3" /> Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-100 gap-1 py-0.5">
                                                        <XCircle className="h-3 w-3" /> Unverified
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Select
                                            defaultValue={user.role?.toUpperCase()}
                                            onValueChange={(value) => handleRoleChange(user.id, value)}
                                            disabled={updateRoleMutation.isPending && updateRoleMutation.variables?.id === user.id}
                                        >
                                            <SelectTrigger className={`w-36 h-7 text-[10px] uppercase font-bold rounded-full border-none shadow-none ${ROLE_OPTIONS.find(r => r.value === user.role?.toUpperCase())?.color || "bg-slate-100"
                                                }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100">
                                                {ROLE_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value} className="text-[11px] font-bold">
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            <span>{format(new Date(user.createdAt), "dd MMM yyyy", { locale: id })}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
                                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 gap-2 cursor-pointer"
                                                    onClick={() => setDeletingUser(user)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Hapus User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Search className="h-8 w-8 opacity-20" />
                                            <p>No users found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <AlertDialogContent className="rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Hapus Pengguna?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus akun <strong>{deletingUser?.name}</strong>?
                            Seluruh data terkait user ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            onClick={handleDeleteConfirm}
                        >
                            Hapus Permanen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
