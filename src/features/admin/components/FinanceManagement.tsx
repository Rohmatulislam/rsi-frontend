"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
    DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard,
    BookOpen, FileText, Scale, Landmark, PieChart as PieChartIcon,
    Pill, BarChart3, Download, Loader2, ArrowUpRight, ArrowDownRight,
    Banknote, Receipt, Wallet, GitCompareArrows, Printer, Target, ShieldCheck
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";
import { useFinanceSummary, useFinanceTrends, useExpenseSummary, usePaymentMethodReport } from "../api/getFinanceReports";

// Lazy-loaded sub-tabs
import { AccountingJournal } from "./AccountingJournal";
import { GeneralLedger } from "./GeneralLedger";
import { ProfitLossReport } from "./ProfitLossReport";
import { BalanceSheetReport } from "./BalanceSheetReport";
import { EquityReport } from "./EquityReport";
import { DrugProfitReport } from "./DrugProfitReport";
import { PaymentMethodReport } from "./PaymentMethodReport";
import { CashFlowReport } from "./CashFlowReport";
import { PeriodComparison } from "./PeriodComparison";
import { PrintLayout } from "./PrintLayout";
import { BudgetReport } from "./BudgetReport";
import { AccountsPayableReport } from "./AccountsPayableReport";
import { AccountsReceivableReport } from "./AccountsReceivableReport";
import { BPJSPerformanceReport } from "./BPJSPerformanceReport";
import { formatRupiah, exportToCSV } from "../utils/exportCSV";

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4'];

export const FinanceManagement = () => {
    const [period, setPeriod] = useState("monthly");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [activeTab, setActiveTab] = useState("overview");

    const isCustomRange = startDate && endDate;

    const analyticsProps = {
        period,
        date: !isCustomRange ? date : undefined,
        startDate: isCustomRange ? startDate : undefined,
        endDate: isCustomRange ? endDate : undefined
    };

    // Real data hooks
    const { data: summary, isLoading: summaryLoading } = useFinanceSummary(
        period,
        !isCustomRange ? date : undefined,
        isCustomRange ? startDate : undefined,
        isCustomRange ? endDate : undefined
    );
    const { data: trends, isLoading: trendsLoading } = useFinanceTrends();
    const { data: expenses, isLoading: expensesLoading } = useExpenseSummary(
        period,
        !isCustomRange ? date : undefined,
        isCustomRange ? startDate : undefined,
        isCustomRange ? endDate : undefined
    );
    const { data: paymentMethods } = usePaymentMethodReport(
        period,
        !isCustomRange ? date : undefined,
        isCustomRange ? startDate : undefined,
        isCustomRange ? endDate : undefined
    );

    // Compute accounting dates for sub-tabs
    const getAccountingDates = () => {
        if (isCustomRange) return { start: startDate, end: endDate };
        const d = new Date(date);
        if (period === 'monthly') {
            const y = d.getFullYear();
            const m = d.getMonth();
            const s = `${y}-${String(m + 1).padStart(2, '0')}-01`;
            const last = new Date(y, m + 1, 0).getDate();
            const e = `${y}-${String(m + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
            return { start: s, end: e };
        }
        const y = d.getFullYear();
        return { start: `${y}-01-01`, end: `${y}-12-31` };
    };

    const acctDates = getAccountingDates();

    // Prepare chart data for payment method pie
    const paymentChartData = paymentMethods?.slice(0, 5).map((pm, i) => ({
        name: pm.name,
        value: pm.value,
        color: CHART_COLORS[i % CHART_COLORS.length],
    })) || [];

    const handleExportOverview = () => {
        if (!summary) return;
        exportToCSV([
            { item: 'Total Pendapatan', jumlah: summary.totalRevenue },
            { item: 'Total Pengeluaran', jumlah: summary.totalExpenses },
            { item: 'Laba Obat', jumlah: summary.totalProfit },
            { item: 'Pendapatan Bersih', jumlah: summary.netIncome },
            { item: 'Jumlah Transaksi', jumlah: summary.transactionCount },
            { item: 'Pertumbuhan (%)', jumlah: summary.revenueGrowth },
        ], 'ringkasan_keuangan', [
            { key: 'item', label: 'Item' },
            { key: 'jumlah', label: 'Nilai' },
        ]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Manajemen Keuangan</h2>
                    <p className="text-sm text-muted-foreground">
                        Dashboard keuangan lengkap dari data SIMRS Khanza.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                        <span>Filter Range:</span>
                    </div>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-[140px]"
                        placeholder="Dari"
                    />
                    <span className="text-muted-foreground">—</span>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-[140px]"
                        placeholder="Sampai"
                    />
                    {isCustomRange && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="text-muted-foreground hover:text-rose-500 px-2 h-8"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-14 h-auto">
                    <TabsTrigger value="overview" className="gap-1.5 text-xs"><BarChart3 className="h-3.5 w-3.5" />Ringkasan</TabsTrigger>
                    <TabsTrigger value="journal" className="gap-1.5 text-xs"><BookOpen className="h-3.5 w-3.5" />Jurnal</TabsTrigger>
                    <TabsTrigger value="ledger" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" />Buku Besar</TabsTrigger>
                    <TabsTrigger value="profit_loss" className="gap-1.5 text-xs"><TrendingUp className="h-3.5 w-3.5" />Laba Rugi</TabsTrigger>
                    <TabsTrigger value="balance_sheet" className="gap-1.5 text-xs"><Scale className="h-3.5 w-3.5" />Neraca</TabsTrigger>
                    <TabsTrigger value="equity" className="gap-1.5 text-xs"><Landmark className="h-3.5 w-3.5" />Modal</TabsTrigger>
                    <TabsTrigger value="cashflow" className="gap-1.5 text-xs"><Wallet className="h-3.5 w-3.5" />Arus Kas</TabsTrigger>
                    <TabsTrigger value="drugs" className="gap-1.5 text-xs"><Pill className="h-3.5 w-3.5" />Obat</TabsTrigger>
                    <TabsTrigger value="payment" className="gap-1.5 text-xs"><CreditCard className="h-3.5 w-3.5" />Cara Bayar</TabsTrigger>
                    <TabsTrigger value="comparison" className="gap-1.5 text-xs"><GitCompareArrows className="h-3.5 w-3.5" />Perbandingan</TabsTrigger>
                    <TabsTrigger value="budget" className="gap-1.5 text-xs text-primary font-bold"><Target className="h-3.5 w-3.5" />Anggaran</TabsTrigger>
                    <TabsTrigger value="ap" className="gap-1.5 text-xs text-rose-600 font-bold"><Receipt className="h-3.5 w-3.5" />Hutang</TabsTrigger>
                    <TabsTrigger value="ar" className="gap-1.5 text-xs text-blue-600 font-bold"><DollarSign className="h-3.5 w-3.5" />Piutang</TabsTrigger>
                    <TabsTrigger value="bpjs" className="gap-1.5 text-xs text-emerald-600 font-bold"><ShieldCheck className="h-3.5 w-3.5" />BPJS</TabsTrigger>
                    <TabsTrigger value="print" className="gap-1.5 text-xs"><Printer className="h-3.5 w-3.5" />Cetak</TabsTrigger>
                </TabsList>

                {/* ===== OVERVIEW TAB ===== */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Revenue */}
                        <Card className="shadow-sm border-none bg-gradient-to-br from-emerald-50 to-emerald-100/50 overflow-hidden relative">
                            <div className="absolute top-2 right-2 p-2 bg-emerald-200/30 rounded-full">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                            </div>
                            <CardHeader className="pb-1">
                                <CardDescription className="text-emerald-600 font-medium text-xs">Total Pendapatan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {summaryLoading ? (
                                    <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                                ) : (
                                    <>
                                        <p className="text-2xl font-black text-emerald-700">{formatRupiah(summary?.totalRevenue ?? 0)}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {(summary?.revenueGrowth ?? 0) >= 0 ? (
                                                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                                            ) : (
                                                <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                                            )}
                                            <span className={`text-xs font-bold ${(summary?.revenueGrowth ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {summary?.revenueGrowth ?? 0}% dari periode sebelumnya
                                            </span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Total Expenses */}
                        <Card className="shadow-sm border-none bg-gradient-to-br from-rose-50 to-rose-100/50 overflow-hidden relative">
                            <div className="absolute top-2 right-2 p-2 bg-rose-200/30 rounded-full">
                                <TrendingDown className="h-5 w-5 text-rose-600" />
                            </div>
                            <CardHeader className="pb-1">
                                <CardDescription className="text-rose-600 font-medium text-xs">Total Pengeluaran</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {expensesLoading ? (
                                    <Loader2 className="h-5 w-5 text-rose-500 animate-spin" />
                                ) : (
                                    <>
                                        <p className="text-2xl font-black text-rose-700">{formatRupiah(expenses?.totalExpenses ?? 0)}</p>
                                        <span className="text-xs text-rose-500">{expenses?.entryCount ?? 0} entri jurnal beban</span>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Net Income */}
                        <Card className="shadow-sm border-none bg-gradient-to-br from-blue-50 to-blue-100/50 overflow-hidden relative">
                            <div className="absolute top-2 right-2 p-2 bg-blue-200/30 rounded-full">
                                <Banknote className="h-5 w-5 text-blue-600" />
                            </div>
                            <CardHeader className="pb-1">
                                <CardDescription className="text-blue-600 font-medium text-xs">Pendapatan Bersih</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {summaryLoading ? (
                                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                ) : (
                                    <>
                                        <p className="text-2xl font-black text-blue-700">{formatRupiah(summary?.netIncome ?? 0)}</p>
                                        <span className="text-xs text-blue-500">Pendapatan - Beban</span>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transaction Count */}
                        <Card className="shadow-sm border-none bg-gradient-to-br from-purple-50 to-purple-100/50 overflow-hidden relative">
                            <div className="absolute top-2 right-2 p-2 bg-purple-200/30 rounded-full">
                                <Receipt className="h-5 w-5 text-purple-600" />
                            </div>
                            <CardHeader className="pb-1">
                                <CardDescription className="text-purple-600 font-medium text-xs">Transaksi Dilayani</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {summaryLoading ? (
                                    <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                                ) : (
                                    <>
                                        <p className="text-2xl font-black text-purple-700">{(summary?.transactionCount ?? 0).toLocaleString()}</p>
                                        <span className="text-xs text-purple-500">Registrasi pasien</span>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Trends Line Chart */}
                        <Card className="lg:col-span-2 shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Tren Pendapatan 6 Bulan Terakhir
                                </CardTitle>
                                <CardDescription>Perbandingan pendapatan BPJS, Umum, dan Asuransi</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {trendsLoading ? (
                                    <div className="flex items-center justify-center h-[300px]">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                    </div>
                                ) : (
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <LineChart data={trends}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="month" fontSize={12} />
                                                <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Jt`} />
                                                <Tooltip
                                                    formatter={(value: number | undefined) => formatRupiah(value ?? 0)}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Legend />
                                                <Line type="monotone" dataKey="bpjs" name="BPJS" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                                <Line type="monotone" dataKey="umum" name="Umum" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                                                <Line type="monotone" dataKey="asuransi" name="Asuransi" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Method Pie Chart */}
                        <Card className="shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <PieChartIcon className="h-5 w-5 text-primary" />
                                    Distribusi Cara Bayar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {paymentChartData.length === 0 ? (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Tidak ada data</div>
                                ) : (
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <PieChart>
                                                <Pie
                                                    data={paymentChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    {paymentChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number | undefined) => formatRupiah(value ?? 0)}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Expenses Bar Chart */}
                    {expenses?.topCategories && expenses.topCategories.length > 0 && (
                        <Card className="shadow-sm border-none">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-primary" />
                                            Top Kategori Pengeluaran
                                        </CardTitle>
                                        <CardDescription>10 kategori beban terbesar</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleExportOverview} className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <BarChart data={expenses.topCategories} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis type="number" fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Jt`} />
                                            <YAxis type="category" dataKey="nm_rek" width={200} fontSize={10} tick={{ fill: '#6b7280' }} />
                                            <Tooltip
                                                formatter={(value: number | undefined) => formatRupiah(value ?? 0)}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="amount" fill="#f43f5e" radius={[0, 6, 6, 0]} name="Jumlah" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* ===== SUB-TABS ===== */}
                <TabsContent value="journal" className="mt-6">
                    <AccountingJournal startDate={acctDates.start} endDate={acctDates.end} />
                </TabsContent>

                <TabsContent value="ledger" className="mt-6">
                    <GeneralLedger startDate={acctDates.start} endDate={acctDates.end} />
                </TabsContent>

                <TabsContent value="profit_loss" className="mt-6">
                    <ProfitLossReport startDate={acctDates.start} endDate={acctDates.end} />
                </TabsContent>

                <TabsContent value="balance_sheet" className="mt-6">
                    <BalanceSheetReport endDate={acctDates.end} />
                </TabsContent>

                <TabsContent value="equity" className="mt-6">
                    <EquityReport startDate={acctDates.start} endDate={acctDates.end} />
                </TabsContent>

                <TabsContent value="cashflow" className="mt-6">
                    <CashFlowReport startDate={acctDates.start} endDate={acctDates.end} />
                </TabsContent>

                <TabsContent value="drugs" className="mt-6">
                    <DrugProfitReport
                        period={period}
                        date={!isCustomRange ? date : undefined}
                        startDate={isCustomRange ? startDate : undefined}
                        endDate={isCustomRange ? endDate : undefined}
                    />
                </TabsContent>

                <TabsContent value="payment" className="mt-6">
                    <PaymentMethodReport
                        period={period}
                        date={!isCustomRange ? date : undefined}
                        startDate={isCustomRange ? startDate : undefined}
                        endDate={isCustomRange ? endDate : undefined}
                    />
                </TabsContent>

                <TabsContent value="comparison" className="mt-6">
                    <PeriodComparison
                        period={period}
                        date={!isCustomRange ? date : undefined}
                        startDate={isCustomRange ? startDate : undefined}
                        endDate={isCustomRange ? endDate : undefined}
                    />
                </TabsContent>

                <TabsContent value="budget" className="mt-6">
                    <BudgetReport
                        period={period}
                        date={date}
                    />
                </TabsContent>

                <TabsContent value="ap" className="mt-6">
                    <AccountsPayableReport {...analyticsProps} />
                </TabsContent>

                <TabsContent value="ar" className="mt-6">
                    <AccountsReceivableReport {...analyticsProps} />
                </TabsContent>

                <TabsContent value="bpjs" className="mt-6">
                    <BPJSPerformanceReport {...analyticsProps} />
                </TabsContent>

                <TabsContent value="print" className="mt-6">
                    <PrintLayout
                        title="Laporan Keuangan"
                        period={period}
                        startDate={isCustomRange ? startDate : acctDates.start}
                        endDate={isCustomRange ? endDate : acctDates.end}
                    >
                        <div className="space-y-4">
                            <h3 style={{ fontSize: '12px', fontWeight: 700, borderLeft: '3px solid #333', paddingLeft: '8px' }}>Ringkasan Keuangan</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', textAlign: 'left', fontSize: '10px' }}>Keterangan</th>
                                        <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', textAlign: 'right', fontSize: '10px' }}>Jumlah (Rp)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px' }}>Total Pendapatan</td><td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{formatRupiah(summary?.totalRevenue ?? 0)}</td></tr>
                                    <tr><td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px' }}>Total Pengeluaran</td><td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px', color: '#dc2626' }}>{formatRupiah(summary?.totalExpenses ?? 0)}</td></tr>
                                    <tr><td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px' }}>Laba Obat</td><td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{formatRupiah(summary?.totalProfit ?? 0)}</td></tr>
                                    <tr><td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px', fontWeight: 700 }}>Laba Bersih</td><td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px', fontWeight: 700 }}>{formatRupiah(summary?.netIncome ?? 0)}</td></tr>
                                    <tr><td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px' }}>Jumlah Transaksi</td><td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{(summary?.transactionCount ?? 0).toLocaleString()}</td></tr>
                                    <tr><td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px' }}>Pertumbuhan Pendapatan</td><td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{summary?.revenueGrowth ?? 0}%</td></tr>
                                </tbody>
                            </table>

                            {paymentMethods && paymentMethods.length > 0 && (
                                <>
                                    <h3 style={{ fontSize: '12px', fontWeight: 700, borderLeft: '3px solid #333', paddingLeft: '8px', marginTop: '16px' }}>Pendapatan Per Cara Bayar</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', textAlign: 'left', fontSize: '10px' }}>Cara Bayar</th>
                                                <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', textAlign: 'right', fontSize: '10px' }}>Total (Rp)</th>
                                                <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', textAlign: 'right', fontSize: '10px' }}>Transaksi</th>
                                                <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', textAlign: 'right', fontSize: '10px' }}>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentMethods.map((pm, i) => (
                                                <tr key={i}>
                                                    <td style={{ border: '1px solid #ddd', padding: '6px 10px', fontSize: '10px' }}>{pm.name}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{formatRupiah(pm.value)}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{pm.transactions.toLocaleString()}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '6px 10px', textAlign: 'right', fontSize: '10px' }}>{Math.round(pm.percentage * 10) / 10}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </PrintLayout>
                </TabsContent>
            </Tabs>
        </div>
    );
};
