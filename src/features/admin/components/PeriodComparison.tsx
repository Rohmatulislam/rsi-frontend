"use client";

import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Download, Loader2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { usePeriodComparison } from "../api/getFinanceReports";
import { exportToCSV, formatRupiah } from "../utils/exportCSV";

interface PeriodComparisonProps {
    period: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

const ChangeIndicator = ({ value, label }: { value: number; label: string }) => {
    const isPositive = value > 0;
    const isNeutral = value === 0;
    const color = label === 'Pengeluaran'
        ? (isPositive ? 'text-rose-600' : 'text-emerald-600')
        : (isPositive ? 'text-emerald-600' : 'text-rose-600');

    return (
        <div className="flex items-center gap-1">
            {isNeutral ? (
                <Minus className="h-3 w-3 text-gray-400" />
            ) : isPositive ? (
                <ArrowUpRight className={`h-3 w-3 ${color}`} />
            ) : (
                <ArrowDownRight className={`h-3 w-3 ${color}`} />
            )}
            <span className={`text-sm font-bold ${isNeutral ? 'text-gray-400' : color}`}>
                {isNeutral ? '0%' : `${value > 0 ? '+' : ''}${value}%`}
            </span>
        </div>
    );
};

export const PeriodComparison = ({ period, date, startDate, endDate }: PeriodComparisonProps) => {
    const { data, isLoading, error } = usePeriodComparison(period, date, startDate, endDate);

    const handleExport = () => {
        if (!data) return;
        const rows = [
            { metrik: 'Pendapatan', periode_ini: data.current.revenue, periode_lalu: data.previous.revenue, perubahan: `${data.changes.revenue}%` },
            { metrik: 'Pengeluaran', periode_ini: data.current.expenses, periode_lalu: data.previous.expenses, perubahan: `${data.changes.expenses}%` },
            { metrik: 'Laba Obat', periode_ini: data.current.drugProfit, periode_lalu: data.previous.drugProfit, perubahan: `${data.changes.drugProfit}%` },
            { metrik: 'Transaksi', periode_ini: data.current.transactions, periode_lalu: data.previous.transactions, perubahan: `${data.changes.transactions}%` },
            { metrik: 'Laba Bersih', periode_ini: data.current.netIncome, periode_lalu: data.previous.netIncome, perubahan: `${data.changes.netIncome}%` },
        ];
        exportToCSV(rows, 'perbandingan_periode', [
            { key: 'metrik', label: 'Metrik' },
            { key: 'periode_ini', label: 'Periode Ini' },
            { key: 'periode_lalu', label: 'Periode Lalu' },
            { key: 'perubahan', label: 'Perubahan (%)' },
        ]);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Mengambil data perbandingan...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <p className="text-sm font-medium">Gagal mengambil data perbandingan periode.</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
        );
    }

    const formatDate = (d: string) => {
        const dt = new Date(d);
        return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const metrics = [
        { key: 'revenue', label: 'Pendapatan', current: data.current.revenue, previous: data.previous.revenue, change: data.changes.revenue, icon: TrendingUp, color: 'bg-emerald-500' },
        { key: 'expenses', label: 'Pengeluaran', current: data.current.expenses, previous: data.previous.expenses, change: data.changes.expenses, icon: TrendingDown, color: 'bg-rose-500' },
        { key: 'drugProfit', label: 'Laba Obat', current: data.current.drugProfit, previous: data.previous.drugProfit, change: data.changes.drugProfit, icon: TrendingUp, color: 'bg-blue-500' },
        { key: 'transactions', label: 'Transaksi', current: data.current.transactions, previous: data.previous.transactions, change: data.changes.transactions, icon: BarChart3, color: 'bg-purple-500' },
        { key: 'netIncome', label: 'Laba Bersih', current: data.current.netIncome, previous: data.previous.netIncome, change: data.changes.netIncome, icon: TrendingUp, color: 'bg-amber-500' },
    ];

    const chartData = metrics.filter(m => m.key !== 'transactions').map(m => ({
        name: m.label,
        'Periode Ini': m.current,
        'Periode Lalu': m.previous,
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Perbandingan Periode</h3>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(data.current.startDate)} – {formatDate(data.current.endDate)}
                        {' vs '}
                        {formatDate(data.previous.startDate)} – {formatDate(data.previous.endDate)}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map(m => {
                    const Icon = m.icon;
                    return (
                        <Card key={m.key} className="shadow-sm border-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{m.label}</CardTitle>
                                <div className={`${m.color} p-1.5 rounded-lg text-white`}>
                                    <Icon className="h-3.5 w-3.5" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-lg font-bold">
                                        {m.key === 'transactions' ? m.current.toLocaleString() : formatRupiah(m.current)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Lalu: {m.key === 'transactions' ? m.previous.toLocaleString() : formatRupiah(m.previous)}
                                    </p>
                                </div>
                                <ChangeIndicator value={m.change} label={m.label} />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Comparison Bar Chart */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Visualisasi Perbandingan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Jt`} />
                                <Tooltip
                                    formatter={(value: number | undefined) => formatRupiah(value ?? 0)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Periode Ini" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="Periode Lalu" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Table */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Tabel Perbandingan Detail</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium rounded-l-lg">Metrik</th>
                                    <th className="px-6 py-3 font-medium">Periode Ini</th>
                                    <th className="px-6 py-3 font-medium">Periode Lalu</th>
                                    <th className="px-6 py-3 font-medium">Selisih</th>
                                    <th className="px-6 py-3 font-medium rounded-r-lg">Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t border-border/50">
                                {metrics.map(m => {
                                    const diff = m.current - m.previous;
                                    const isCurrency = m.key !== 'transactions';
                                    return (
                                        <tr key={m.key} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{m.label}</td>
                                            <td className="px-6 py-4 font-bold">{isCurrency ? formatRupiah(m.current) : m.current.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{isCurrency ? formatRupiah(m.previous) : m.previous.toLocaleString()}</td>
                                            <td className={`px-6 py-4 font-medium ${m.key === 'expenses'
                                                ? (diff > 0 ? 'text-rose-600' : 'text-emerald-600')
                                                : (diff >= 0 ? 'text-emerald-600' : 'text-rose-600')
                                                }`}>
                                                {diff >= 0 ? '+' : ''}{isCurrency ? formatRupiah(diff) : diff.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <ChangeIndicator value={m.change} label={m.label} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
