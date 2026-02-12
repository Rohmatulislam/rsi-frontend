import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import {
    AlertCircle,
    TrendingDown,
    Calendar,
    Truck,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    DollarSign,
    CheckCircle2,
    XCircle,
    Receipt
} from "lucide-react";
import { useAccountsPayable } from "../api/getFinanceReports";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

interface ReportProps {
    period?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

export const AccountsPayableReport = ({ period, date, startDate, endDate }: ReportProps) => {
    const { data, isLoading, error } = useAccountsPayable(period, date, startDate, endDate);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredDetails = useMemo(() => {
        if (!data?.details) return [];
        return data.details.filter((item: any) =>
            item.nama_suplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.no_faktur.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Memuat data hutang...</div>;
    if (error) return <div className="p-8 text-center text-rose-500">Error memuat data hutang.</div>;
    if (!data) return null;

    const agingColors: { [key: string]: string } = {
        'Belum Jatuh Tempo': '#10b981',
        '0-30 Hari': '#f59e0b',
        '31-60 Hari': '#f97316',
        '61-90 Hari': '#ef4444',
        '90+ Hari': '#991b1b'
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Total Hutang</p>
                                <h3 className="text-2xl font-bold mt-1">{formatRupiah(data.totalDebt)}</h3>
                            </div>
                            <div className="p-2 bg-rose-200/50 rounded-lg text-rose-600">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-rose-600">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            <span>{data.invoiceCount} Invoice Belum Lunas</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Jatuh Tempo</p>
                                <h3 className="text-2xl font-bold mt-1 text-orange-700">{formatRupiah(data.overdueDebt)}</h3>
                            </div>
                            <div className="p-2 bg-orange-200/50 rounded-lg text-orange-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-[10px] text-orange-600 mt-4 leading-relaxed">
                            Segera lakukan pembayaran untuk menjaga supply chain medis.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Supplier</p>
                                <h3 className="text-2xl font-bold mt-1">{data.supplierSummary.length}</h3>
                            </div>
                            <div className="p-2 bg-blue-200/50 rounded-lg text-blue-600">
                                <Truck className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-[10px] text-blue-600 mt-4">
                            Aktif transaksi pengadaan obat & BHP.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Aging Chart */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-primary" />
                            Analisis Umur Hutang (Aging AP)
                        </CardTitle>
                        <CardDescription className="text-xs">Distribusi penumpukan hutang berdasarkan jatuh tempo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.agingSummary}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => `Rp${val / 1000000}jt`}
                                    />
                                    <Tooltip
                                        formatter={(val: number | string | undefined) => formatRupiah(Number(val) || 0)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {data.agingSummary.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={agingColors[entry.name] || '#6366f1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Suppliers */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Truck className="h-4 w-4 text-primary" />
                            Hutang Terbesar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="px-6 pb-6 space-y-4">
                            {data.supplierSummary.slice(0, 5).map((sup: any, i: number) => (
                                <div key={sup.kode_suplier} className="flex items-center justify-between group cursor-pointer">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold truncate max-w-[140px]">{sup.nama_suplier}</p>
                                        <p className="text-[10px] text-muted-foreground">{sup.invoiceCount} Invoices</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-rose-600">{formatRupiah(sup.totalDebt)}</p>
                                        <div className="flex justify-end mt-1">
                                            <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-rose-500"
                                                    style={{ width: `${Math.min(100, (sup.totalDebt / data.totalDebt) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-primary" />
                                Rincian Invoice Hutang
                            </CardTitle>
                            <CardDescription className="text-xs">Daftar semua faktur pembelian yang belum lunas.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari supplier/faktur..."
                                    className="pl-8 h-9 text-xs w-[200px] bg-muted/50 border-none"
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button size="sm" variant="outline" className="h-9 gap-1 text-[10px]">
                                <Filter className="h-3 w-3" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-bold py-3 pl-6">No. Faktur</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Supplier</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Tgl. Faktur</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Jatuh Tempo</TableHead>
                                <TableHead className="text-[10px] font-bold py-3 text-right">Total</TableHead>
                                <TableHead className="text-[10px] font-bold py-3 text-right">Sisa Hutang</TableHead>
                                <TableHead className="text-[10px] font-bold py-3 text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDetails.length > 0 ? (
                                filteredDetails.map((item: any) => (
                                    <TableRow key={item.no_faktur} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="text-[10px] font-medium py-3 pl-6">{item.no_faktur}</TableCell>
                                        <TableCell className="py-3">
                                            <p className="text-[10px] font-bold">{item.nama_suplier}</p>
                                        </TableCell>
                                        <TableCell className="text-[10px] py-3">{new Date(item.tgl_faktur).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px]">{new Date(item.tgl_tempo).toLocaleDateString('id-ID')}</span>
                                                <span className={`text-[9px] font-bold ${item.diffDays > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {item.diffDays > 0 ? `${item.diffDays} hari lewat` : `${Math.abs(item.diffDays)} hari lagi`}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[10px] text-right py-3">{formatRupiah(item.totalAmount)}</TableCell>
                                        <TableCell className="text-[10px] text-right font-bold text-rose-600 py-3">{formatRupiah(item.balance)}</TableCell>
                                        <TableCell className="text-center py-3">
                                            <Badge variant="outline" className={`text-[9px] px-1.5 h-5 font-medium ${item.status === 'Belum Dibayar' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                'bg-orange-50 text-orange-600 border-orange-200'
                                                }`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                                        Tidak ada rincian hutang ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
