"use client";

import { useJournal } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, BookOpen, AlertCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

interface AccountingJournalProps {
    startDate: string;
    endDate: string;
}

export const AccountingJournal = ({ startDate, endDate }: AccountingJournalProps) => {
    const { data: journals, isLoading, error } = useJournal(startDate, endDate);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Memuat data jurnal...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <AlertCircle className="h-8 w-8" />
                <p className="text-sm font-medium">Gagal memuat data jurnal harian.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Jurnal Harian</h3>
                    <p className="text-sm text-muted-foreground">
                        Daftar transaksi akuntansi terperinci dalam rentang waktu yang dipilih.
                    </p>
                </div>
            </div>

            <Card className="shadow-sm border-none">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Transaksi Jurnal</CardTitle>
                    </div>
                    <CardDescription>
                        Klik baris untuk melihat detail debit dan kredit per rekening.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {!journals || journals.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">
                                Tidak ada data jurnal untuk rentang tanggal ini.
                            </div>
                        ) : (
                            journals.map((journal) => (
                                <div key={journal.no_jurnal} className="border border-border/50 rounded-xl overflow-hidden bg-card/50 hover:bg-card transition-colors">
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleExpand(journal.no_jurnal)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{journal.no_jurnal}</span>
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                        {new Date(journal.tgl_jurnal).toLocaleDateString('id-ID')} {journal.jam_jurnal}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-0.5 italic">"{journal.keterangan}"</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Nilai</p>
                                                <p className="font-mono font-bold text-emerald-600">
                                                    Rp {journal.details.reduce((sum, d) => sum + (d.debet || 0), 0).toLocaleString()}
                                                </p>
                                            </div>
                                            {expandedIds.has(journal.no_jurnal) ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                                        </div>
                                    </div>

                                    {expandedIds.has(journal.no_jurnal) && (
                                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                                            <div className="overflow-x-auto rounded-lg border border-border/50 bg-muted/30">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-border/50 bg-muted/50 text-muted-foreground">
                                                            <th className="px-4 py-2 text-left font-medium">Rekening</th>
                                                            <th className="px-4 py-2 text-right font-medium">Debet</th>
                                                            <th className="px-4 py-2 text-right font-medium">Kredit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/30">
                                                        {journal.details.map((detail, idx) => (
                                                            <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <div className="font-medium">{detail.nm_rek}</div>
                                                                    <div className="text-[10px] font-mono text-muted-foreground">{detail.kd_rek}</div>
                                                                </td>
                                                                <td className="px-4 py-3 text-right font-mono">
                                                                    {detail.debet > 0 ? `Rp ${detail.debet.toLocaleString()}` : '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-right font-mono">
                                                                    {detail.kredit > 0 ? `Rp ${detail.kredit.toLocaleString()}` : '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
