"use client";

import { useCashFlow } from "../api/getAccountingReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, ArrowUpRight, ArrowDownRight, TrendingUp, Banknote, Building, Wallet, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import { exportToCSV, formatRupiah } from "../utils/exportCSV";

interface CashFlowReportProps {
    startDate: string;
    endDate: string;
}

export const CashFlowReport = ({ startDate, endDate }: CashFlowReportProps) => {
    const { data: cashFlow, isLoading, error } = useCashFlow(startDate, endDate);

    const handleExport = () => {
        if (!cashFlow) return;
        exportToCSV([
            { kategori: 'Penerimaan Operasional', jumlah: cashFlow.operating.inflows },
            { kategori: 'Pengeluaran Operasional', jumlah: cashFlow.operating.outflows },
            { kategori: 'Arus Kas Operasi (Bersih)', jumlah: cashFlow.operating.net },
            { kategori: 'Arus Kas Investasi', jumlah: cashFlow.investing.net },
            { kategori: 'Arus Kas Pendanaan', jumlah: cashFlow.financing.net },
            { kategori: 'Saldo Kas Awal', jumlah: cashFlow.openingCash },
            { kategori: 'Perubahan Kas Bersih', jumlah: cashFlow.netChange },
            { kategori: 'Saldo Kas Akhir', jumlah: cashFlow.closingCash },
        ], 'laporan_arus_kas', [
            { key: 'kategori', label: 'Kategori' },
            { key: 'jumlah', label: 'Jumlah (Rp)' },
        ]);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Menghitung arus kas...</p>
            </div>
        );
    }

    if (error || !cashFlow) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-rose-500">
                <p className="text-sm font-medium">Gagal memuat laporan arus kas.</p>
            </div>
        );
    }

    const sections = [
        {
            title: 'Arus Kas dari Aktivitas Operasi',
            icon: <Banknote className="h-5 w-5" />,
            color: 'emerald',
            items: [
                { label: 'Pendapatan yang diterima', value: cashFlow.operating.inflows, type: 'inflow' as const },
                { label: 'Beban operasional dibayar', value: cashFlow.operating.outflows, type: 'outflow' as const },
            ],
            net: cashFlow.operating.net,
        },
        {
            title: 'Arus Kas dari Aktivitas Investasi',
            icon: <Building className="h-5 w-5" />,
            color: 'blue',
            items: [],
            net: cashFlow.investing.net,
        },
        {
            title: 'Arus Kas dari Aktivitas Pendanaan',
            icon: <Wallet className="h-5 w-5" />,
            color: 'purple',
            items: [],
            net: cashFlow.financing.net,
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Laporan Arus Kas</h3>
                    <p className="text-sm text-muted-foreground">Analisis pergerakan kas rumah sakit dari aktivitas operasi, investasi, dan pendanaan.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Opening Cash */}
            <Card className="shadow-sm border-none bg-slate-50">
                <CardContent className="py-5 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-200 rounded-lg">
                            <Wallet className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Saldo Kas Awal Periode</p>
                            <p className="text-xs text-muted-foreground">Per {new Date(startDate).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-slate-700">{formatRupiah(cashFlow.openingCash)}</span>
                </CardContent>
            </Card>

            {/* Cash Flow Sections */}
            <div className="space-y-4">
                {sections.map((section, idx) => (
                    <Card key={idx} className="shadow-sm border-none overflow-hidden">
                        <CardHeader className={`py-4 bg-${section.color}-50/50`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 bg-${section.color}-100 rounded-lg text-${section.color}-600`}>
                                    {section.icon}
                                </div>
                                <CardTitle className="text-sm font-bold">{section.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {section.items.length > 0 && (
                                <div className="divide-y divide-border/30">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                {item.type === 'inflow' ? (
                                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <ArrowDownRight className="h-4 w-4 text-rose-500" />
                                                )}
                                                <span className="text-sm">{item.label}</span>
                                            </div>
                                            <span className={`font-bold font-mono ${item.type === 'inflow' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {item.type === 'outflow' ? '- ' : ''}{formatRupiah(Math.abs(item.value))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className={`px-6 py-4 flex items-center justify-between bg-${section.color}-50/30 border-t`}>
                                <span className="text-sm font-bold">Arus Kas Bersih</span>
                                <span className={`text-lg font-black ${section.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {section.net >= 0 ? '+' : '-'} {formatRupiah(Math.abs(section.net))}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Net Change & Closing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={`shadow-md border-none ${cashFlow.netChange >= 0 ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
                    <CardContent className="py-6 px-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="h-5 w-5 opacity-80" />
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Kenaikan / Penurunan Kas Bersih</p>
                        </div>
                        <p className="text-3xl font-black">
                            {cashFlow.netChange >= 0 ? '+' : '-'} {formatRupiah(Math.abs(cashFlow.netChange))}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-none bg-primary text-primary-foreground">
                    <CardContent className="py-6 px-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className="h-5 w-5 opacity-80" />
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Saldo Kas Akhir Periode</p>
                        </div>
                        <p className="text-3xl font-black">{formatRupiah(cashFlow.closingCash)}</p>
                        <p className="text-xs opacity-70 mt-1">Per {new Date(endDate).toLocaleDateString('id-ID')}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
