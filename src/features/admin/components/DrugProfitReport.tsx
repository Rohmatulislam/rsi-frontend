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

interface DrugProfitReportProps {
    period: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

export const DrugProfitReport = ({ period, date, startDate, endDate }: DrugProfitReportProps) => {
    const { data: drugProfitData, isLoading, error } = useDrugProfitReport(period, date, startDate, endDate);

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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Laba Penjualan Obat</h3>
                    <p className="text-sm text-muted-foreground">Analisis keuntungan bersih dari penjualan obat di berbagai unit layanan (Real-time)</p>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Laporan
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
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={drugProfitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="unit" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp ${val / 1000000}jt`} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number | undefined) => [`Rp ${(value ?? 0).toLocaleString()}`, '']}
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

                {/* Summary Card */}
                <Card className="shadow-sm border-none bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Top Drugs (Profit)</CardTitle>
                        <CardDescription>Obat dengan kontribusi laba terbesar</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {[
                                { name: "Amoxicillin 500mg", profit: 2500000, trend: "up" },
                                { name: "Paracetamol Syrup", profit: 1800000, trend: "up" },
                                { name: "Cefixime 100mg", profit: 1500000, trend: "down" },
                            ].map((drug, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-md">
                                            <Pill className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{drug.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-emerald-600">Rp {(drug.profit / 1000).toLocaleString()}rb</div>
                                        <div className={`text-[10px] flex items-center justify-end ${drug.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {drug.trend === 'up' ? <TrendingUp className="h-2 w-2 mr-1" /> : <TrendingDown className="h-2 w-2 mr-1" />}
                                            {Math.round(Math.random() * 20)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Rincian Keuntungan Unit Layer</CardTitle>
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
                                        <td className="px-6 py-4">Rp {item.totalSales.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-rose-500">Rp {item.cost.toLocaleString()}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">
                                            Rp {item.profit.toLocaleString()}
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
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
