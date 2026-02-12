"use client";

import { Pill, TrendingUp, TrendingDown, DollarSign, BarChart3, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from "recharts";
import { useDrugProfitReport } from "../api/getFinanceReports";
import { exportToCSV, formatRupiah } from "../utils/exportCSV";

interface DrugProfitReportProps {
    period: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

export const DrugProfitReport = ({ period, date, startDate, endDate }: DrugProfitReportProps) => {
    const { data: drugProfitData, isLoading, error } = useDrugProfitReport(period, date, startDate, endDate);

    const handleExport = () => {
        if (!drugProfitData) return;
        exportToCSV(
            drugProfitData.map(d => ({
                unit: d.unit,
                penjualan: d.totalSales,
                hpp: d.cost,
                laba: d.profit,
                margin: d.totalSales > 0 ? Math.round((d.profit / d.totalSales) * 100) : 0,
            })),
            'laba_obat',
            [
                { key: 'unit', label: 'Unit Pelayanan' },
                { key: 'penjualan', label: 'Total Penjualan' },
                { key: 'hpp', label: 'HPP' },
                { key: 'laba', label: 'Laba Bersih' },
                { key: 'margin', label: 'Margin (%)' },
            ]
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Mengambil data dari Khanza...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <p className="text-sm font-medium">Gagal mengambil data keuangan.</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
        );
    }

    const hasData = drugProfitData && drugProfitData.length > 0;
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Derive summary stats from actual data
    const totalSales = drugProfitData?.reduce((s, d) => s + d.totalSales, 0) ?? 0;
    const totalProfit = drugProfitData?.reduce((s, d) => s + d.profit, 0) ?? 0;
    const overallMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;
    const topUnit = drugProfitData?.slice().sort((a, b) => b.profit - a.profit)[0];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Laba Penjualan Obat</h3>
                    <p className="text-sm text-muted-foreground">Analisis keuntungan bersih dari penjualan obat di berbagai unit layanan (Real-time)</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2 shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Visualisasi Keuntungan Per Unit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            {hasData ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={drugProfitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="unit" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Jt`} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number | undefined) => [formatRupiah(value ?? 0), '']}
                                        />
                                        <Legend />
                                        <Bar dataKey="profit" name="Keuntungan Bersih" radius={[6, 6, 0, 0]}>
                                            {drugProfitData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                    Tidak ada data untuk periode ini
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Card - Real data */}
                <Card className="shadow-sm border-none bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Ringkasan Obat</CardTitle>
                        <CardDescription>Berdasarkan data periode terpilih</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Total Penjualan Obat</p>
                            <p className="text-xl font-black text-emerald-700 mt-1">{formatRupiah(totalSales)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total Laba Obat</p>
                            <p className="text-xl font-black text-blue-700 mt-1">{formatRupiah(totalProfit)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                            <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">Margin Rata-rata</p>
                            <p className="text-xl font-black text-purple-700 mt-1">{overallMargin}%</p>
                        </div>
                        {topUnit && (
                            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Unit Terbaik</p>
                                <p className="text-sm font-bold text-amber-700 mt-1">{topUnit.unit}</p>
                                <p className="text-xs text-amber-500 mt-0.5">Laba: {formatRupiah(topUnit.profit)}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Rincian Keuntungan Per Unit</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium rounded-l-lg">Unit Pelayanan</th>
                                    <th className="px-6 py-3 font-medium">Total Penjualan</th>
                                    <th className="px-6 py-3 font-medium">Harga Pokok (HPP)</th>
                                    <th className="px-6 py-3 font-medium">Laba Bersih</th>
                                    <th className="px-6 py-3 font-medium rounded-r-lg">Margin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t border-border/50">
                                {hasData ? drugProfitData.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium">{item.unit}</td>
                                        <td className="px-6 py-4">{formatRupiah(item.totalSales)}</td>
                                        <td className="px-6 py-4 text-rose-500">{formatRupiah(item.cost)}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">
                                            {formatRupiah(item.profit)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="text-[10px] py-0 border-emerald-200 bg-emerald-50 text-emerald-700">
                                                {item.totalSales > 0 ? Math.round((item.profit / item.totalSales) * 100) : 0}%
                                            </Badge>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Data tidak tersedia untuk periode ini</td>
                                    </tr>
                                )}
                                {hasData && (
                                    <tr className="bg-muted/30 font-bold border-t-2">
                                        <td className="px-6 py-3 uppercase tracking-wider text-xs">TOTAL</td>
                                        <td className="px-6 py-3">{formatRupiah(totalSales)}</td>
                                        <td className="px-6 py-3 text-rose-600">{formatRupiah(totalSales - totalProfit)}</td>
                                        <td className="px-6 py-3 text-emerald-700">{formatRupiah(totalProfit)}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant="outline" className="text-[10px] py-0 border-primary/20 bg-primary/5 text-primary font-bold">
                                                {overallMargin}%
                                            </Badge>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
