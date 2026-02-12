"use client";

import { useBalanceSheet, useProfitLoss, useOpeningEquity } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, Landmark, Plus, Minus, ArrowRight, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import { exportToCSV, formatRupiah } from "../utils/exportCSV";

interface EquityReportProps {
    startDate: string;
    endDate: string;
}

export const EquityReport = ({ startDate, endDate }: EquityReportProps) => {
    const { data: balanceSheet, isLoading: loadingBS } = useBalanceSheet(endDate);
    const { data: profitLoss, isLoading: loadingPL } = useProfitLoss(startDate, endDate);
    const { data: openingEquityData, isLoading: loadingOE } = useOpeningEquity(startDate);

    if (loadingBS || loadingPL || loadingOE) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Menghitung perubahan ekuitas...</p>
            </div>
        );
    }

    const equityItems = balanceSheet?.filter(r => r.category === 'MODAL') || [];
    const totalEquity = equityItems.reduce((sum, item) => sum + item.amount, 0);

    const incomeTotal = profitLoss?.filter(r => r.category === 'PENDAPATAN').reduce((sum, item) => sum + item.amount, 0) || 0;
    const expenseTotal = profitLoss?.filter(r => r.category === 'BEBAN').reduce((sum, item) => sum + item.amount, 0) || 0;
    const netProfit = incomeTotal - expenseTotal;

    // Use real opening equity from API 
    const openingEquity = openingEquityData?.openingEquity ?? (totalEquity - netProfit);

    const handleExport = () => {
        exportToCSV([
            { item: 'Modal Awal', jumlah: openingEquity },
            { item: 'Laba Bersih Periode Ini', jumlah: netProfit },
            { item: 'Pengambilan / Lainnya', jumlah: 0 },
            { item: 'Modal Akhir', jumlah: totalEquity },
            ...equityItems.map(e => ({ item: `  ${e.nm_rek} (${e.kd_rek})`, jumlah: e.amount })),
        ], 'laporan_perubahan_modal', [
            { key: 'item', label: 'Item' },
            { key: 'jumlah', label: 'Jumlah (Rp)' },
        ]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Laporan Perubahan Modal</h3>
                    <p className="text-sm text-muted-foreground">Analisis pertumbuhan ekuitas selama periode berjalan.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card className="shadow-sm border-none overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-border/50">
                    <CardTitle className="text-lg">Ringkasan Perubahan</CardTitle>
                    <CardDescription>Perhitungan Modal Akhir berdasarkan Laba/Rugi periode berjalan.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {/* Opening Balance */}
                        <div className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-200 rounded-lg">
                                    <Landmark className="h-5 w-5 text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-600 uppercase tracking-wider text-sm">Modal Awal</span>
                            </div>
                            <span className="font-mono text-lg font-bold">{formatRupiah(openingEquity)}</span>
                        </div>

                        {/* Net Profit */}
                        <div className="p-6 flex items-center justify-between bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Plus className="h-5 w-5 text-emerald-600" />
                                </div>
                                <span className="font-bold text-emerald-700 uppercase tracking-wider text-sm">Laba Bersih Periode Ini</span>
                            </div>
                            <span className="font-mono text-lg font-black text-emerald-600">+ {formatRupiah(Math.abs(netProfit))}</span>
                        </div>

                        {/* Withdrawals */}
                        <div className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors opacity-60">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-rose-100 rounded-lg">
                                    <Minus className="h-5 w-5 text-rose-600" />
                                </div>
                                <span className="font-medium text-rose-600 uppercase tracking-wider text-sm">Pengambilan / Lainnya</span>
                            </div>
                            <span className="font-mono text-lg font-bold">- Rp 0</span>
                        </div>

                        {/* Closing Balance */}
                        <div className="p-8 flex items-center justify-between bg-primary text-primary-foreground">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <ArrowRight className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-primary-foreground/70 uppercase font-black tracking-widest">Modal Akhir</p>
                                    <p className="text-sm font-medium opacity-80">Per tanggal {new Date(endDate).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                            <span className="text-3xl font-black">{formatRupiah(totalEquity)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Komposisi Modal</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-border/30">
                                {equityItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/20">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{item.nm_rek}</div>
                                            <div className="text-[10px] font-mono text-muted-foreground">{item.kd_rek}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold">{formatRupiah(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <div className="flex flex-col justify-center p-8 bg-muted/20 rounded-2xl border border-dashed border-border/50 text-center gap-4">
                    <p className="text-sm text-balance text-muted-foreground leading-relaxed">
                        Laporan ini menunjukkan bagaimana modal pemilik atau yayasan berubah selama periode akuntansi karena operasional rumah sakit (Laba/Rugi) serta investasi atau penarikan modal.
                    </p>
                </div>
            </div>
        </div>
    );
};
