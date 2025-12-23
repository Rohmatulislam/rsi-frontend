import { useGetQueueStatus } from "../api/getQueueStatus";
import { Users, UserCheck, Timer, RefreshCcw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface QueueStatusCardProps {
    doctorCode: string;
    poliCode: string;
    date?: string;
    className?: string;
}

export const QueueStatusCard = ({
    doctorCode,
    poliCode,
    date = new Date().toISOString().split('T')[0],
    className
}: QueueStatusCardProps) => {
    const { data, isLoading, isError, refetch, isFetching } = useGetQueueStatus({
        doctorCode,
        poliCode,
        date,
    });

    if (isLoading) {
        return <Skeleton className="h-[120px] w-full rounded-2xl" />;
    }

    if (isError || !data) {
        return (
            <Card className={cn("border-red-100 bg-red-50 dark:bg-red-950/20", className)}>
                <CardContent className="p-4 flex items-center gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Gagal memuat status antrean</p>
                </CardContent>
            </Card>
        );
    }

    const isDone = data.status === 'Selesai';
    const noQueue = data.totalQueue === 0;

    return (
        <Card className={cn(
            "overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 ring-1 ring-slate-100 dark:ring-slate-800",
            className
        )}>
            <CardContent className="p-0">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Status Antrean</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCcw className={cn("h-3.5 w-3.5 text-slate-400", isFetching && "animate-spin")} />
                    </button>
                </div>

                <div className="p-5 grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Dipanggil</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-primary tracking-tighter">
                                {noQueue ? '-' : data.currentNumber}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                {data.totalQueue}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sisa</p>
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-slate-400" />
                            <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                                {data.totalWaiting}
                            </span>
                        </div>
                    </div>
                </div>

                {noQueue ? (
                    <div className="px-5 pb-5">
                        <Badge variant="outline" className="w-full justify-center py-1 bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-300 border-dashed border-slate-200 dark:border-slate-700">
                            Belum ada pasien terdaftar hari ini
                        </Badge>
                    </div>
                ) : isDone ? (
                    <div className="px-5 pb-5">
                        <Badge className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600">
                            <UserCheck className="h-3 w-3 mr-2" />
                            Praktek Selesai
                        </Badge>
                    </div>
                ) : (
                    <div className="px-5 pb-5 flex gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${(data.currentNumber / data.totalQueue) * 100}%` }}
                            />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">
                            {Math.round((data.currentNumber / data.totalQueue) * 100)}%
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
