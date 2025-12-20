"use client";

import { Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { ServiceDto } from "../../types";
import { useState } from "react";
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

interface ServiceListTableProps {
    services: ServiceDto[] | undefined;
    isLoading: boolean;
    isDeleting: boolean;
    onDelete: (id: string) => void;
}

export function ServiceListTable({ services, isLoading, isDeleting, onDelete }: ServiceListTableProps) {
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

    const handleDelete = () => {
        if (serviceToDelete) {
            onDelete(serviceToDelete);
            setServiceToDelete(null);
        }
    };

    return (
        <>
            <Card className="border-none shadow-md overflow-hidden ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle>Daftar Layanan Utama</CardTitle>
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
                                <thead className="bg-slate-50/50 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">Nama Layanan</th>
                                        <th className="px-6 py-4">Slug</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {services?.map((service) => (
                                        <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-900">{service.name}</span>
                                                    {service.isFeatured && (
                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 text-[10px] font-bold">
                                                            UNGGULAN
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                                                    /{service.slug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="font-medium bg-white">
                                                    {service._count?.items || 0} Items
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={service.isActive ? "default" : "secondary"}
                                                    className={service.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                                                >
                                                    {service.isActive ? "Aktif" : "Draft"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-primary">
                                                        <Link href={`/layanan/${service.slug}`} target="_blank">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-primary hover:bg-primary/10">
                                                        <Link href={`/admin/services/${service.slug}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setServiceToDelete(service.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {services?.length === 0 && (
                                <div className="text-center py-20 bg-muted/20">
                                    <p className="text-muted-foreground italic">Belum ada data layanan.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Layanan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Menghapus layanan juga akan menghapus seluruh item layanan terkait (paket, tes, dll).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Hapus Selamanya
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
