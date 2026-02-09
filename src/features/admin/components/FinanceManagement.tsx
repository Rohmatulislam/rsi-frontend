"use client";

import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, FileText, Download, LayoutDashboard, Pill, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { DrugProfitReport } from "./DrugProfitReport";
import { PaymentMethodReport } from "./PaymentMethodReport";
import { useFinanceSummary } from "../api/getFinanceReports";
import { AccountingJournal } from "./AccountingJournal";
import { ProfitLossReport } from "./ProfitLossReport";
import { BalanceSheetReport } from "./BalanceSheetReport";
import { GeneralLedger } from "./GeneralLedger";
import { EquityReport } from "./EquityReport";
import { Input } from "~/components/ui/input";
import { Book, Scale, Landmark, History, Coins } from "lucide-react";


export const FinanceManagement = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [period, setPeriod] = useState<string>("daily");
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isCustomRange, setIsCustomRange] = useState(false);

    const { data: summary, isLoading } = useFinanceSummary(
        isCustomRange ? "custom" : period,
        date,
        isCustomRange ? startDate : undefined,
        isCustomRange ? endDate : undefined
    );

    // Helper to get effective start/end date based on selected period
    const getEffectiveDates = () => {
        if (isCustomRange) {
            return { effectiveStart: startDate, effectiveEnd: endDate };
        }

        const d = new Date(date);
        if (isNaN(d.getTime())) return { effectiveStart: date, effectiveEnd: date };

        const year = d.getFullYear();
        const month = d.getMonth();

        if (period === "daily") {
            return { effectiveStart: date, effectiveEnd: date };
        } else if (period === "monthly") {
            const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            const lastDayDate = new Date(year, month + 1, 0);
            const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;
            return { effectiveStart: firstDay, effectiveEnd: lastDay };
        } else if (period === "yearly") {
            return { effectiveStart: `${year}-01-01`, effectiveEnd: `${year}-12-31` };
        }

        return { effectiveStart: date, effectiveEnd: date };
    };

    const { effectiveStart, effectiveEnd } = getEffectiveDates();

    // Mock data for the overview (replacing with real data where available)
    const stats = [
        {
            title: "Total Pendapatan",
            value: isLoading ? "..." : `Rp ${summary?.totalRevenue.toLocaleString() || 0}`,
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Total Pengeluaran",
            value: "Rp 0", // Pengeluaran might need another query
            icon: TrendingDown,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            title: "Estimasi Laba",
            value: isLoading ? "..." : `Rp ${summary?.totalProfit.toLocaleString() || 0}`,
            icon: DollarSign,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Transaksi Dilayani",
            value: "124",
            icon: PieChart,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
    ];

    const recentReports = [
        { name: "Laporan Bulanan Januari 2024", date: "31 Jan 2024", status: "Selesai", type: "Bulanan" },
        { name: "Laporan Mingguan Ke-4", date: "28 Jan 2024", status: "Selesai", type: "Mingguan" },
        { name: "Laporan Arus Kas Q4 2023", date: "15 Jan 2024", status: "Arsip", type: "Tahunan" },
    ];

    const tabs = [
        { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
        { id: "journal", label: "Jurnal", icon: Book },
        { id: "ledger", label: "Buku Besar", icon: History },
        { id: "profit_loss", label: "Laba Rugi", icon: TrendingUp },
        { id: "balance_sheet", label: "Neraca", icon: Scale },
        { id: "equity", label: "Modal", icon: Landmark },
        { id: "drugs", label: "Obat", icon: Pill },
        { id: "payment", label: "Cara Bayar", icon: CreditCard },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Keuangan</h2>
                    <p className="text-muted-foreground">
                        Sistem pelaporan dan analisis finansial rumah sakit (Real-time SIMRS Khanza)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={(val) => {
                        setPeriod(val);
                        setIsCustomRange(val === "custom");
                    }}>
                        <SelectTrigger className="w-[150px] bg-white border-border/50 shadow-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Harian</SelectItem>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                            <SelectItem value="custom">Rentang Kustom</SelectItem>
                        </SelectContent>
                    </Select>

                    {period !== "custom" ? (
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setIsCustomRange(false);
                            }}
                            className="w-[160px] bg-white border-border/50 shadow-sm"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setIsCustomRange(true);
                                }}
                                className="w-[150px] bg-white border-border/50 shadow-sm"
                            />
                            <span className="text-muted-foreground text-xs font-medium">s/d</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setIsCustomRange(true);
                                }}
                                className="w-[150px] bg-white border-border/50 shadow-sm"
                            />
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex shadow-sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                        </Button>
                        <Button size="sm" className="shadow-sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Buat Laporan
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl w-fit border border-border/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-white text-primary shadow-sm ring-1 ring-border/50"
                                : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                                }`}
                        >
                            <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area Based on Active Tab */}
            <div className="min-h-[500px]">
                {activeTab === "overview" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <Card key={index} className="overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                            <div className={`${stat.bg} p-2 rounded-lg`}>
                                                <Icon className={`h-4 w-4 ${stat.color}`} />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stat.value}</div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                <span className="text-emerald-500 font-medium">+12.5%</span> dari periode lalu
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                        {/* ... Rest of the overview ... */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 shadow-sm border-none">
                                <CardHeader>
                                    <CardTitle>Laporan Terbaru</CardTitle>
                                    <CardDescription>Daftar laporan keuangan yang baru saja dibuat atau diperbarui</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentReports.map((report, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{report.name}</p>
                                                        <p className="text-xs text-muted-foreground">{report.date} • {report.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={report.status === "Selesai" ? "default" : "secondary"}>
                                                        {report.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-none">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wallet className="h-5 w-5 text-primary" />
                                        Info Akun
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                                        <p className="text-sm text-primary font-medium mb-1">Saldo Tersedia (Rekening RS)</p>
                                        <p className="text-2xl font-bold">Rp 2.450.000.000</p>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Budget Terpakai</span>
                                            <span className="font-medium">65%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t space-y-3">
                                        <Button className="w-full justify-start text-muted-foreground hover:text-primary" variant="ghost" onClick={() => setActiveTab("payment")}>
                                            <PieChart className="mr-2 h-4 w-4" />
                                            Analisis Anggaran
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "drugs" && (
                    <DrugProfitReport
                        period={isCustomRange ? "custom" : period}
                        date={date}
                        startDate={isCustomRange ? startDate : undefined}
                        endDate={isCustomRange ? endDate : undefined}
                    />
                )}
                {activeTab === "payment" && (
                    <PaymentMethodReport
                        period={isCustomRange ? "custom" : period}
                        date={date}
                        startDate={isCustomRange ? startDate : undefined}
                        endDate={isCustomRange ? endDate : endDate}
                    />
                )}
                {activeTab === "journal" && (
                    <AccountingJournal
                        startDate={effectiveStart}
                        endDate={effectiveEnd}
                    />
                )}
                {activeTab === "ledger" && (
                    <GeneralLedger
                        startDate={effectiveStart}
                        endDate={effectiveEnd}
                    />
                )}
                {activeTab === "profit_loss" && (
                    <ProfitLossReport
                        startDate={effectiveStart}
                        endDate={effectiveEnd}
                    />
                )}
                {activeTab === "balance_sheet" && (
                    <BalanceSheetReport
                        endDate={effectiveEnd}
                    />
                )}
                {activeTab === "equity" && (
                    <EquityReport
                        startDate={effectiveStart}
                        endDate={effectiveEnd}
                    />
                )}
            </div>
        </div>
    );
};
