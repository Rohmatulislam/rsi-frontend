"use client";

import { Clock, Truck, MapPin, Search, FileText } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { PrescriptionResult } from "../services/farmasiService";

interface PharmacyHistoryProps {
    isLoading: boolean;
    prescriptions: PrescriptionResult[] | null;
    onTrack: (id: string) => void;
}

export const PharmacyHistory = ({
    isLoading,
    prescriptions,
    onTrack
}: PharmacyHistoryProps) => {
    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Clock className="h-6 w-6 text-primary" /> Riwayat Resep Saya
                    </h3>
                    <p className="text-sm text-muted-foreground">Monitoring resep digital yang Anda unggah via website.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    Array(2).fill(0).map((_, i) => (
                        <div key={i} className="bg-white border rounded-3xl p-6 flex flex-col gap-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-48" />
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    ))
                ) : prescriptions && prescriptions.length > 0 ? (
                    prescriptions.slice(0, 5).map((pres) => (
                        <div key={pres.id} className="group bg-white border rounded-3xl p-6 hover:shadow-lg transition-all border-slate-100 hover:border-primary/20 flex flex-col md:flex-row justify-between gap-6 overflow-hidden relative">
                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center gap-2">
                                    <Badge className={
                                        ['COMPLETED', 'READY'].includes(pres.status) ? "bg-green-500" :
                                            ['PROCESSING', 'VERIFIED', 'SUBMITTED'].includes(pres.status) ? "bg-blue-500" :
                                                pres.status === 'CANCELLED' ? "bg-red-500" : "bg-amber-500"
                                    }>
                                        {pres.status}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                        {new Date(pres.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{pres.patientName}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                            <Truck className="h-3 w-3" /> {pres.deliveryMethod}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {pres.deliveryMethod === 'DELIVERY' ? 'Antar' : 'Ambil di RS'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="px-4 py-3 bg-slate-50 rounded-2xl border flex flex-col items-center min-w-[120px]">
                                    <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Tracking ID</p>
                                    <p className="font-bold text-slate-900 tracking-tight">{pres.id.slice(-8).toUpperCase()}</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-12 w-12 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(pres.id);
                                        toast.success("Tracking ID disalin ke clipboard");
                                        onTrack(pres.id);
                                    }}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-primary/5 to-transparent translate-x-12 group-hover:translate-x-0 transition-transform duration-500" />
                        </div>
                    ))
                ) : (
                    <div className="bg-slate-50 border border-dashed rounded-3xl p-10 text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">Belum ada riwayat resep digital.</p>
                        <p className="text-xs text-slate-400 mt-1">Resep yang Anda unggah via website akan muncul di sini.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
