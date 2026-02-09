"use client";

import { useProfitLoss } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ProfitLossReportProps {
    startDate: string;
    endDate: string;
}

export const ProfitLossReport = ({ startDate, endDate }: ProfitLossReportProps) => {
    const { data: reports, isLoading, error } = useProfitLoss(startDate, endDate);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Menghitung laba rugi...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <p className="text-sm font-medium">Gagal memuat laporan laba rugi.</p>
            </div>
        );
    }

    const incomeItems = reports?.filter(r => r.category === 'PENDAPATAN') || [];
    const expenseItems = reports?.filter(r => r.category === 'BEBAN') || [];

    const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const chartData = [
        { name: 'Pendapatan', value: totalIncome, color: '#10b981' },
        { name: 'Beban', value: totalExpenses, color: '#f43f5e' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Laba Rugi</h3>
                    <p className="text-sm text-muted-foreground">Ringkasan pendapatan dan beban operasional rumah sakit.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-emerald-50 border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-emerald-600 font-medium">Total Pendapatan</CardDescription>
                            <CardTitle className="text-3xl font-bold text-emerald-700">Rp {totalIncome.toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-emerald-600">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-semibold">Berdasarkan Jurnal Terinput</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-rose-50 border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-rose-600 font-medium">Total Beban</CardDescription>
                            <CardTitle className="text-3xl font-bold text-rose-700">Rp {totalExpenses.toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-rose-600">
                                <TrendingDown className="h-4 w-4" />
                                <span className="text-xs font-semibold">Semua Biaya Operasional</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`border-none shadow-md ${netProfit >= 0 ? 'bg-primary text-primary-foreground' : 'bg-rose-600 text-white'}`}>
                        <CardHeader className="pb-2">
                            <CardDescription className={netProfit >= 0 ? "text-primary-foreground/80 font-medium" : "text-white/80 font-medium"}>
                                {netProfit >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}
                            </CardDescription>
                            <CardTitle className="text-4xl font-black">Rp {Math.abs(netProfit).toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 opacity-80">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-xs font-semibold">Periode terpilih</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:col-span-2 shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Analisis Pendapatan vs Beban
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Details */}
                <Card className="shadow-sm border-none h-fit">
                    <CardHeader className="bg-emerald-50/50">
                        <CardTitle className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Detail Pendapatan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <tbody className="divide-y">
                                {incomeItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{item.nm_rek}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono">{item.kd_rek}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">Rp {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {incomeItems.length === 0 && (
                                    <tr><td colSpan={2} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data pendapatan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Expense Details */}
                <Card className="shadow-sm border-none h-fit">
                    <CardHeader className="bg-rose-50/50">
                        <CardTitle className="text-sm font-bold text-rose-700 uppercase tracking-wider">Detail Beban</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <tbody className="divide-y">
                                {expenseItems.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{item.nm_rek}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono">{item.kd_rek}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-rose-600">Rp {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {expenseItems.length === 0 && (
                                    <tr><td colSpan={2} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data beban</td></tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
