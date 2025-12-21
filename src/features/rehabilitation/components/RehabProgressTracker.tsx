"use client";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ClipboardList, Clock, UserCheck } from "lucide-react";
import { RehabProgress } from "../services/rehabilitationService";

interface RehabProgressTrackerProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    progress: RehabProgress | null;
    isError: boolean;
}

export const RehabProgressTracker = ({
    searchQuery,
    onSearchChange,
    onSearch,
    isLoading,
    progress,
    isError
}: RehabProgressTrackerProps) => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Lacak Progres Terapi</h2>
                <p className="text-muted-foreground">Masukkan Nomor RM atau Nomor Rawat untuk melihat riwayat program terapi Anda.</p>
            </div>
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white dark:bg-slate-900 border rounded-[2.5rem] p-8 md:p-12 shadow-xl border-primary/10">
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Nomor Rekam Medis / Nomor Rawat..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            className="flex-1 h-14 px-6 rounded-2xl border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                        />
                        <Button
                            onClick={onSearch}
                            disabled={isLoading}
                            className="h-14 px-10 rounded-2xl font-bold"
                        >
                            {isLoading ? "Mencari..." : "Cek Progres"}
                        </Button>
                    </div>

                    {progress && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-primary/5 rounded-[2rem] border border-primary/20">
                                <div className="space-y-4 text-left">
                                    <Badge className="bg-primary">{progress.status_program || 'AKTIF'}</Badge>
                                    <h3 className="text-2xl font-bold">{progress.nama_pasien}</h3>
                                    <p className="text-sm text-muted-foreground">Diagnosa: {progress.diagnosa}</p>
                                </div>
                                <div className="space-y-4 text-left md:border-l md:pl-8 border-primary/10">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <UserCheck className="h-4 w-4 text-primary" /> Dr. {progress.dokter}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <Clock className="h-4 w-4 text-primary" /> Update: {new Date(progress.tanggal_terakhir).toLocaleDateString('id-ID')}
                                    </div>
                                    <p className="text-sm italic text-muted-foreground mt-2">"{progress.evaluasi}"</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-left">
                                <h4 className="font-bold text-lg flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-primary" /> Riwayat Sesi Terapi
                                </h4>
                                <div className="space-y-3">
                                    {progress.programs && progress.programs.length > 0 ? progress.programs.map((p, i) => (
                                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border flex justify-between items-center group hover:border-primary/30 transition-colors">
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">{p.program}</p>
                                                <p className="text-xs text-muted-foreground">{p.keterangan}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-primary">{new Date(p.tanggal).toLocaleDateString('id-ID')}</p>
                                                <Badge variant="outline" className="text-[10px] scale-75 origin-right">Selesai</Badge>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-10 text-center text-muted-foreground bg-slate-50 rounded-2xl border-dashed border-2">
                                            Belum ada detail sesi tercatat di SIMRS.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isError && (
                        <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                            Data rehabilitasi tidak ditemukan. Pastikan nomor yang dimasukkan benar atau silakan hubungi Customer Service.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
