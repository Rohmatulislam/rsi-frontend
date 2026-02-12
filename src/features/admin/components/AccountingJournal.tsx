"use client";

import { useJournal } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, BookOpen, AlertCircle, FileText, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { exportToCSV, formatRupiah } from "../utils/exportCSV";

interface AccountingJournalProps {
    startDate: string;
    endDate: string;
}

export const AccountingJournal = ({ startDate, endDate }: AccountingJournalProps) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);

    const { data: journalResponse, isLoading, error } = useJournal(startDate, endDate, page, limit);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleExport = () => {
        if (!journalResponse?.data) return;
        const rows: Record<string, string | number>[] = [];
        journalResponse.data.forEach(j => {
            j.details.forEach(d => {
                rows.push({
                    no_jurnal: j.no_jurnal,
                    tanggal: j.tgl_jurnal,
                    jam: j.jam_jurnal,
                    no_bukti: j.no_bukti,
                    keterangan: j.keterangan,
                    kd_rek: d.kd_rek,
                    nm_rek: d.nm_rek,
                    debet: d.debet,
                    kredit: d.kredit,
                });
            });
        });
        exportToCSV(rows, 'jurnal_umum', [
            { key: 'no_jurnal', label: 'No Jurnal' },
            { key: 'tanggal', label: 'Tanggal' },
            { key: 'jam', label: 'Jam' },
            { key: 'no_bukti', label: 'No Bukti' },
            { key: 'keterangan', label: 'Keterangan' },
            { key: 'kd_rek', label: 'Kode Rekening' },
            { key: 'nm_rek', label: 'Nama Rekening' },
            { key: 'debet', label: 'Debet' },
            { key: 'kredit', label: 'Kredit' },
        ]);
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
                <p className="text-sm font-medium">Gagal memuat data jurnal.</p>
            </div>
        );
    }

    const journals = journalResponse?.data || [];
    const pagination = journalResponse?.pagination;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold">Jurnal Umum</h3>
                    <p className="text-sm text-muted-foreground">
                        Catatan transaksi jurnal umum dari SIMRS Khanza.
                        {pagination && <span className="ml-1 font-medium">({pagination.total} jurnal ditemukan)</span>}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {journals.length === 0 ? (
                <Card className="border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tidak ada data jurnal untuk periode ini.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {journals.map((journal) => {
                        const isExpanded = expandedIds.has(journal.no_jurnal);
                        const totalDebet = journal.details.reduce((sum, d) => sum + d.debet, 0);
                        const totalKredit = journal.details.reduce((sum, d) => sum + d.kredit, 0);

                        return (
                            <Card key={journal.no_jurnal} className="shadow-sm border-none overflow-hidden transition-all">
                                <div
                                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors"
                                    onClick={() => toggleExpand(journal.no_jurnal)}
                                >
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="font-mono font-bold text-sm">{journal.no_jurnal}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                                    {journal.no_bukti}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 truncate italic">{journal.keterangan}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(journal.tgl_jurnal).toLocaleDateString('id-ID')} • {journal.jam_jurnal}
                                            </p>
                                            <p className="text-sm font-bold text-emerald-600">{formatRupiah(totalDebet)}</p>
                                        </div>
                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-muted/40 text-muted-foreground">
                                                    <th className="px-5 py-2 text-left font-medium text-xs">Kode</th>
                                                    <th className="px-5 py-2 text-left font-medium text-xs">Nama Rekening</th>
                                                    <th className="px-5 py-2 text-right font-medium text-xs">Debet</th>
                                                    <th className="px-5 py-2 text-right font-medium text-xs">Kredit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/30">
                                                {journal.details.map((d, i) => (
                                                    <tr key={i} className="hover:bg-muted/10">
                                                        <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{d.kd_rek}</td>
                                                        <td className="px-5 py-2.5">{d.nm_rek}</td>
                                                        <td className="px-5 py-2.5 text-right font-bold text-emerald-600">
                                                            {d.debet > 0 ? formatRupiah(d.debet) : '-'}
                                                        </td>
                                                        <td className="px-5 py-2.5 text-right font-bold text-rose-600">
                                                            {d.kredit > 0 ? formatRupiah(d.kredit) : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-muted/20 font-bold">
                                                    <td colSpan={2} className="px-5 py-2.5 text-right uppercase text-xs tracking-wider">Total</td>
                                                    <td className="px-5 py-2.5 text-right text-emerald-700">{formatRupiah(totalDebet)}</td>
                                                    <td className="px-5 py-2.5 text-right text-rose-700">{formatRupiah(totalKredit)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Tampilkan</span>
                        <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                            <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>dari <strong>{pagination.total}</strong> jurnal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium px-2">
                            {page} / {pagination.totalPages}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
