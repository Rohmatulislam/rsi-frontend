"use client";

import { CreditCard, Banknote, ShieldCheck, Wallet, PieChart as PieChartIcon, TrendingUp, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    PieChart as RePieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import { usePaymentMethodReport, useFinanceTrends } from "../api/getFinanceReports";

interface PaymentMethodReportProps {
    period: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

export const PaymentMethodReport = ({ period, date, startDate, endDate }: PaymentMethodReportProps) => {
    const { data: paymentData, isLoading, error } = usePaymentMethodReport(period, date, startDate, endDate);
    const { data: monthlyTrends } = useFinanceTrends();

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
                <p className="text-sm font-medium">Gagal mengambil data cara bayar.</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
        );
    }

    const hasData = paymentData && paymentData.length > 0;

    // Enhanced payment data with icons and colors
    const displayData = paymentData?.map(item => {
        let icon = Wallet;
        let color = "bg-slate-400";
        let chartColor = "#94a3b8";

        if (item.name.toLowerCase().includes('bpjs')) {
            icon = ShieldCheck;
            color = "bg-blue-500";
            chartColor = "#3b82f6";
        } else if (item.name.toLowerCase().includes('umum') || item.name.toLowerCase().includes('tunai')) {
            icon = Banknote;
            color = "bg-emerald-500";
            chartColor = "#10b981";
        } else if (item.name.toLowerCase().includes('asuransi')) {
            icon = CreditCard;
            color = "bg-purple-500";
            chartColor = "#8b5cf6";
        }

        return { ...item, icon, color, chartColor };
    }) || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Keuntungan Per Cara Bayar</h3>
                    <p className="text-sm text-muted-foreground">Analisis pendapatan dan profitabilitas berdasarkan metode pembayaran pasien (Real-time)</p>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Laporan
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Distribution Chart */}
                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Porsi Pendapatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            {hasData ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={displayData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {displayData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.chartColor} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number | undefined) => `Rp ${(value ?? 0).toLocaleString()}`}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Tidak ada data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Trend Chart */}
                <Card className="lg:col-span-2 shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Trend Pertumbuhan (Real-time)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTrends || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp ${val / 1000000}jt`} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        formatter={(value: number | undefined) => `Rp ${(value ?? 0).toLocaleString()}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="bpjs" name="BPJS" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="umum" name="Tunai" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="asuransi" name="Swasta" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayData.map((item, i) => {
                    const Icon = item.icon;
                    const margin = item.value > 0 ? Math.round((item.profit / item.value) * 100) : 0;
                    return (
                        <Card key={i} className="shadow-sm border-none overflow-hidden group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground truncate mr-2">{item.name}</CardTitle>
                                <div className={`${item.color} p-1.5 rounded-lg text-white shadow-sm ring-4 ring-slate-50 shrink-0`}>
                                    <Icon className="h-3.5 w-3.5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold">Rp {(item.value / 1000000).toLocaleString()} Jt</div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] text-muted-foreground mr-2 whitespace-nowrap">Est. Margin Laba</span>
                                    <span className="text-xs font-medium text-emerald-600">
                                        {margin}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5">
                                    <div
                                        className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${margin}%` }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Comparison Table */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Tabel Realisasi Cara Bayar</CardTitle>
                    <CardDescription>Analisis total pembayaran masuk berdasarkan cara bayar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium rounded-l-lg">Cara Bayar</th>
                                    <th className="px-6 py-3 font-medium">Total Penerimaan</th>
                                    <th className="px-6 py-3 font-medium">Estimasi Laba</th>
                                    <th className="px-6 py-3 font-medium rounded-r-lg">Efektivitas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t border-border/50">
                                {hasData ? displayData.map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                            <span className="font-medium">{item.name}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">Rp {item.value.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-emerald-600">Rp {item.profit.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={item.value > 100000000 ? "default" : "secondary"} className="font-mono">
                                                {item.value > 100000000 ? "High" : "Normal"}
                                            </Badge>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Data tidak tersedia</td>
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
