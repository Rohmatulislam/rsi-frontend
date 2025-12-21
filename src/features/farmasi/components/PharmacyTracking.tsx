"use client";

import { Search, FileText, Clock, Truck, SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { PrescriptionStatusDto } from "../services/farmasiService";

interface PharmacyTrackingProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    status: PrescriptionStatusDto | null;
    isError: boolean;
}

export const PharmacyTracking = ({
    searchQuery,
    onSearchChange,
    onSearch,
    isLoading,
    status,
    isError
}: PharmacyTrackingProps) => {
    return (
        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Search className="h-6 w-6 text-primary" /> Lacak Antrean Resep
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Ketik Nomor Resep / No. RM / No. Rawat..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                        />
                    </div>
                    <Button
                        onClick={onSearch}
                        disabled={isLoading}
                        className="h-14 px-10 rounded-2xl font-bold"
                    >
                        {isLoading ? "Mengecek..." : "Cek Status"}
                    </Button>
                </div>

                {/* Tracking Result */}
                {status && (
                    <div className="mt-8 p-6 bg-white rounded-3xl border border-primary/10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={
                                        ['SELESAI', 'COMPLETED', 'READY'].includes(status.status) ? "bg-green-500 hover:bg-green-600" :
                                            ['PROSES', 'PROCESSING', 'VERIFIED'].includes(status.status) ? "bg-blue-500 hover:bg-blue-600" :
                                                status.status === 'CANCELLED' ? "bg-red-500 hover:bg-red-600" :
                                                    "bg-amber-500 hover:bg-amber-600"
                                    }>
                                        {status.status_label}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-bold">
                                        Source: {status.source}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground font-medium">No: {status.no_resep}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-xl">{status.nama_pasien}</p>
                                    <p className="text-sm text-muted-foreground">Dokter: {status.dokter}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                        <Clock className="h-3 w-3" /> {new Date(status.tanggal).toLocaleDateString('id-ID')} {status.jam}
                                    </div>
                                    {status.delivery_method && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                                            <Truck className="h-3 w-3" /> {status.delivery_method}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border min-w-[160px]">
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 text-center">Estimasi Selesai</p>
                                <p className="text-2xl font-black text-slate-900">
                                    {['SELESAI', 'COMPLETED', 'READY'].includes(status.status) ? 'READY' :
                                        ['PROSES', 'PROCESSING', 'VERIFIED'].includes(status.status) ? '10-15m' : '25-30m'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                        Data resep tidak ditemukan. Pastikan nomor yang Anda masukkan benar.
                    </div>
                )}

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-2xl border text-center shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Rata-rata Racik</p>
                        <p className="font-bold text-slate-800 tracking-tight">15-30 Menit</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border text-center shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Obat Jadi</p>
                        <p className="font-bold text-slate-800 tracking-tight">5-10 Menit</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border text-center shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Status Apotek</p>
                        <div className="flex items-center justify-center gap-1.5 font-bold text-green-600">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Lancar
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border text-center shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Sediaan Tersedia</p>
                        <p className="font-bold text-slate-800 tracking-tight">99% Stok</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
