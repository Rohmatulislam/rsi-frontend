"use client";

import { useState } from "react";
import { useGetRatings, RatingDto } from "~/features/doctor/api/getRatings";
import { useUpdateRatingStatus } from "~/features/doctor/api/updateRatingStatus";
import {
    Star,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Filter,
    Search,
    MoreVertical,
    ThumbsUp,
    ThumbsDown,
    User,
    Calendar,
    Stethoscope,
    Loader2
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Skeleton } from "~/components/ui/skeleton";

export const ReviewModerationPage = () => {
    const [statusTab, setStatusTab] = useState("PENDING");
    const { data: ratings, isLoading, refetch } = useGetRatings({
        status: statusTab
    });

    const updateStatusMutation = useUpdateRatingStatus({
        mutationConfig: {
            onSuccess: () => {
                toast.success("Status review berhasil diperbarui");
                refetch();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Gagal memperbarui status");
            }
        }
    });

    const handleUpdateStatus = (ratingId: string, status: 'APPROVED' | 'REJECTED') => {
        updateStatusMutation.mutate({ ratingId, data: { status } });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Moderasi Review</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Kelola dan tinjau ulasan yang diberikan oleh pasien.</p>
                </div>
            </div>

            <Tabs value={statusTab} onValueChange={setStatusTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="PENDING" className="rounded-lg font-bold data-[state=active]:shadow-sm">
                            Menunggu ({ratings?.filter(r => r.status === 'PENDING').length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="APPROVED" className="rounded-lg font-bold data-[state=active]:shadow-sm">
                            Disetujui
                        </TabsTrigger>
                        <TabsTrigger value="REJECTED" className="rounded-lg font-bold data-[state=active]:shadow-sm">
                            Ditolak
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : !ratings || ratings.length === 0 ? (
                            <div className="py-20 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <MessageSquare className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tidak ada data review</h3>
                                <p className="text-muted-foreground max-w-xs mt-2">Belum ada review dengan status {statusTab.toLowerCase()} saat ini.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <TableRow className="border-none">
                                        <TableHead className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px] pl-6">Pasien</TableHead>
                                        <TableHead className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Dokter</TableHead>
                                        <TableHead className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Rating</TableHead>
                                        <TableHead className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px] max-w-md">Komentar</TableHead>
                                        <TableHead className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-right pr-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ratings.map((rating) => (
                                        <TableRow key={rating.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                                                        <AvatarImage src={rating.user.image || ""} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{rating.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{rating.user.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(rating.createdAt), "dd MMM yyyy", { locale: id })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                                        <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{rating.doctor.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/50 w-fit">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">{rating.rating}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                                                    {rating.comment ? `"${rating.comment}"` : <span className="text-slate-300 dark:text-slate-600">Tidak ada komentar</span>}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    {rating.status === 'PENDING' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-9 px-4 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold gap-2"
                                                                onClick={() => handleUpdateStatus(rating.id, 'APPROVED')}
                                                                disabled={updateStatusMutation.isPending}
                                                            >
                                                                <ThumbsUp className="h-4 w-4" /> Setujui
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-9 px-4 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold gap-2"
                                                                onClick={() => handleUpdateStatus(rating.id, 'REJECTED')}
                                                                disabled={updateStatusMutation.isPending}
                                                            >
                                                                <ThumbsDown className="h-4 w-4" /> Tolak
                                                            </Button>
                                                        </>
                                                    )}
                                                    {rating.status === 'APPROVED' && (
                                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20 font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full">
                                                            Published
                                                        </Badge>
                                                    )}
                                                    {rating.status === 'REJECTED' && (
                                                        <Badge className="bg-red-500/10 text-red-500 border-red-200 hover:bg-red-500/20 font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full">
                                                            Rejected
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
};
