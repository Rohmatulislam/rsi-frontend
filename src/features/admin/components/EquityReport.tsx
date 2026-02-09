"use client";

import { useBalanceSheet, useProfitLoss } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, Landmark, Plus, Minus, ArrowRight } from "lucide-react";

interface EquityReportProps {
    startDate: string;
    endDate: string;
}

export const EquityReport = ({ startDate, endDate }: EquityReportProps) => {
    // Equity changes are basically: Opening Equity + Net Profit - Dividends/Withdrawals = Closing Equity
    const { data: balanceSheet, isLoading: loadingBS } = useBalanceSheet(endDate);
    const { data: profitLoss, isLoading: loadingPL } = useProfitLoss(startDate, endDate);

    if (loadingBS || loadingPL) {
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

    // Simplified simulation of changes
    const openingEquity = totalEquity - netProfit;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Laporan Perubahan Modal</h3>
                    <p className="text-sm text-muted-foreground">Analisis pertumbuhan ekuitas selama periode berjalan.</p>
                </div>
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
                            <span className="font-mono text-lg font-bold">Rp {openingEquity.toLocaleString()}</span>
                        </div>

                        {/* Net Profit */}
                        <div className="p-6 flex items-center justify-between bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Plus className="h-5 w-5 text-emerald-600" />
                                </div>
                                <span className="font-bold text-emerald-700 uppercase tracking-wider text-sm">Laba Bersih Periode Ini</span>
                            </div>
                            <span className="font-mono text-lg font-black text-emerald-600">+ Rp {netProfit.toLocaleString()}</span>
                        </div>

                        {/* Withdrawals / Prive (Simulated or from specific accounts if identified) */}
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
                                    <p className="text-sm font-medium opacity-80">Per tanggal {new Date(endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="text-3xl font-black">Rp {totalEquity.toLocaleString()}</span>
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
                                        <td className="px-6 py-4 text-right font-bold">Rp {item.amount.toLocaleString()}</td>
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
