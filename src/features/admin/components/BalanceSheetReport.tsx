"use client";

import { useBalanceSheet } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, Landmark, Scale, Wallet2, PieChart as PieChartIcon, ArrowRightLeft, Download } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Button } from "~/components/ui/button";
import { exportToCSV, formatRupiah } from "../utils/exportCSV";

interface BalanceSheetReportProps {
    endDate: string;
}

export const BalanceSheetReport = ({ endDate }: BalanceSheetReportProps) => {
    const { data: reports, isLoading, error } = useBalanceSheet(endDate);

    const handleExport = () => {
        if (!reports) return;
        exportToCSV(
            reports.map(r => ({ kd_rek: r.kd_rek, nama_rekening: r.nm_rek, kategori: r.category, jumlah: r.amount })),
            'neraca_saldo',
            [
                { key: 'kd_rek', label: 'Kode Rekening' },
                { key: 'nama_rekening', label: 'Nama Rekening' },
                { key: 'kategori', label: 'Kategori' },
                { key: 'jumlah', label: 'Jumlah (Rp)' },
            ]
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Menyusun neraca saldo...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <p className="text-sm font-medium">Gagal memuat laporan neraca.</p>
            </div>
        );
    }

    const assetItems = reports?.filter(r => r.category === 'ASET') || [];
    const liabilityItems = reports?.filter(r => r.category === 'KEWAJIBAN') || [];
    const equityItems = reports?.filter(r => r.category === 'MODAL') || [];

    const totalAssets = assetItems.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilityItems.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equityItems.reduce((sum, item) => sum + item.amount, 0);

    const chartData = [
        { name: 'Aset', value: totalAssets, color: '#3b82f6' },
        { name: 'Kewajiban', value: totalLiabilities, color: '#f59e0b' },
        { name: 'Modal', value: totalEquity, color: '#8b5cf6' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Neraca (Balance Sheet)</h3>
                    <p className="text-sm text-muted-foreground">Posisi keuangan rumah sakit: Aset, Kewajiban, dan Modal.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Equation */}
                <Card className="lg:col-span-1 border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Scale className="h-32 w-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-slate-400 text-xs font-bold uppercase tracking-widest">Persamaan Akuntansi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">ASET</p>
                            <p className="text-3xl font-black text-blue-400">Rp {totalAssets.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4 py-2 border-y border-white/10">
                            <span className="text-2xl font-bold text-slate-500">=</span>
                            <div className="flex-1">
                                <p className="text-xs text-slate-400">KEWAJIBAN + MODAL</p>
                                <p className="text-xl font-bold text-emerald-400">Rp {(totalLiabilities + totalEquity).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                            <ArrowRightLeft className={`h-5 w-5 ${Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1 ? 'text-emerald-400' : 'text-rose-400'}`} />
                            <span className="text-xs font-medium">
                                Status: {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1 ? 'SEIMBANG (BALANCED)' : 'TIDAK SEIMBANG'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Struktur Permodalan & Aset
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number | undefined) => `Rp ${(value ?? 0).toLocaleString()}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-fit items-start">
                {/* Assets Table */}
                <Card className="shadow-sm border-none">
                    <CardHeader className="bg-blue-50/50 py-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-bold text-blue-700 uppercase">Aset</CardTitle>
                            <Landmark className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-[11px]">
                            <tbody className="divide-y divide-border/30">
                                {assetItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30">
                                        <td className="px-4 py-2 opacity-80">{item.nm_rek}</td>
                                        <td className="px-4 py-2 text-right font-semibold">Rp {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50/30 font-bold border-t border-blue-100">
                                    <td className="px-4 py-3">TOTAL ASET</td>
                                    <td className="px-4 py-3 text-right text-blue-700">Rp {totalAssets.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Liabilities Table */}
                <Card className="shadow-sm border-none">
                    <CardHeader className="bg-amber-50/50 py-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-bold text-amber-700 uppercase">Kewajiban</CardTitle>
                            <Scale className="h-4 w-4 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-[11px]">
                            <tbody className="divide-y divide-border/30">
                                {liabilityItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30">
                                        <td className="px-4 py-2 opacity-80">{item.nm_rek}</td>
                                        <td className="px-4 py-2 text-right font-semibold">Rp {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-amber-50/30 font-bold border-t border-amber-100">
                                    <td className="px-4 py-3">TOTAL KEWAJIBAN</td>
                                    <td className="px-4 py-3 text-right text-amber-700">Rp {totalLiabilities.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Equity Table */}
                <Card className="shadow-sm border-none h-fit">
                    <CardHeader className="bg-purple-50/50 py-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-bold text-purple-700 uppercase">Modal</CardTitle>
                            <Wallet2 className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-[11px]">
                            <tbody className="divide-y divide-border/30">
                                {equityItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30">
                                        <td className="px-4 py-2 opacity-80">{item.nm_rek}</td>
                                        <td className="px-4 py-2 text-right font-semibold">Rp {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-purple-50/30 font-bold border-t border-purple-100">
                                    <td className="px-4 py-3">TOTAL MODAL</td>
                                    <td className="px-4 py-3 text-right text-purple-700">Rp {totalEquity.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
