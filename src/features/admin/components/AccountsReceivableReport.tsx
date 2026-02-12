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
    TrendingUp,
    Calendar,
    Users,
    Search,
    Filter,
    Clock,
    DollarSign,
    ShieldCheck,
    Briefcase,
    Receipt,
    UserCircle2,
    PieChart as PieChartIcon
} from "lucide-react";
import { useAccountsReceivable } from "../api/getFinanceReports";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
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

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f472b6'];

interface ReportProps {
    period?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

export const AccountsReceivableReport = ({ period, date, startDate, endDate }: ReportProps) => {
    const { data, isLoading, error } = useAccountsReceivable(period, date, startDate, endDate);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredDetails = useMemo(() => {
        if (!data?.details) return [];
        return data.details.filter((item: any) =>
            item.nm_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.no_rkm_medis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.no_rawat.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Memuat data piutang...</div>;
    if (error) return <div className="p-8 text-center text-rose-500">Error memuat data piutang.</div>;
    if (!data) return null;

    const agingColors: { [key: string]: string } = {
        'Belum Jatuh Tempo': '#10b981',
        '0-30 Hari': '#3b82f6',
        '31-60 Hari': '#f59e0b',
        '61-90 Hari': '#f97316',
        '90+ Hari': '#ef4444'
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Piutang</p>
                                <h3 className="text-2xl font-bold mt-1 text-blue-900">{formatRupiah(data.totalAR)}</h3>
                            </div>
                            <div className="p-2 bg-blue-200/50 rounded-lg text-blue-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-blue-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>{data.invoiceCount} Tagihan Aktif</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Melewati Tempo</p>
                                <h3 className="text-2xl font-bold mt-1 text-rose-700">{formatRupiah(data.overdueAR)}</h3>
                            </div>
                            <div className="p-2 bg-rose-200/50 rounded-lg text-rose-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-[10px] text-rose-600 mt-4 leading-relaxed">
                            {((data.overdueAR / data.totalAR) * 100).toFixed(1)}% dari total piutang.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Jumlah Pasien</p>
                                <h3 className="text-2xl font-bold mt-1 text-emerald-900">{data.patientCount}</h3>
                            </div>
                            <div className="p-2 bg-emerald-200/50 rounded-lg text-emerald-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-[10px] text-emerald-600 mt-4">
                            Pasien dengan kewajiban pembayaran.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Top Insurance</p>
                                <h3 className="text-lg font-bold mt-1 text-indigo-900 truncate max-w-[140px]">
                                    {data.insuranceSummary[0]?.name || '-'}
                                </h3>
                            </div>
                            <div className="p-2 bg-indigo-200/50 rounded-lg text-indigo-600">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-[10px] text-indigo-600 mt-4">
                            Penanggung jawab terbesar.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aging Chart */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Aging Piutang (AR Aging)
                        </CardTitle>
                        <CardDescription className="text-xs">Distribusi sisa piutang berdasarkan jatuh tempo bill.</CardDescription>
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

                {/* Insurance Distribution */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4 text-primary" />
                            Distribusi Penanggung Jawab
                        </CardTitle>
                        <CardDescription className="text-xs">Proporsi piutang berdasarkan asuransi/perusahaan.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center">
                        <div className="h-[250px] w-full md:w-1/2 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.insuranceSummary}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.insuranceSummary.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: number | string | undefined) => formatRupiah(Number(val) || 0)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-2 mt-4 md:mt-0 font-medium">
                            {data.insuranceSummary.slice(0, 5).map((item: any, index: number) => (
                                <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                                        <span className="truncate max-w-[120px]">{item.name}</span>
                                    </div>
                                    <span className="font-bold">{formatRupiah(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="pb-4 border-b border-muted/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-primary" />
                                Rincian Piutang Pasien
                            </CardTitle>
                            <CardDescription className="text-xs">Daftar tagihan pasien yang belum diselesaikan.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama/RM/rawat..."
                                    className="pl-8 h-9 text-xs w-[220px] bg-muted/50 border-none focus-visible:ring-1"
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
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="text-[10px] font-bold py-3 pl-6">No. Rawat / RM</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Nama Pasien</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Penanggung Jawab</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Tgl. Piutang</TableHead>
                                <TableHead className="text-[10px] font-bold py-3">Jatuh Tempo</TableHead>
                                <TableHead className="text-[10px] font-bold py-3 text-right">Sisa Piutang</TableHead>
                                <TableHead className="text-[10px] font-bold py-3 text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDetails.length > 0 ? (
                                filteredDetails.map((item: any) => (
                                    <TableRow key={item.no_rawat} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="py-3 pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-primary">{item.no_rawat}</span>
                                                <span className="text-[9px] text-muted-foreground">RM: {item.no_rkm_medis}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-2">
                                                <UserCircle2 className="h-4 w-4 text-muted-foreground/50" />
                                                <span className="text-[10px] font-bold">{item.nm_pasien}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[10px] font-medium">{item.penjab}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[10px] py-3">{new Date(item.tgl_piutang).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px]">{new Date(item.tgltempo).toLocaleDateString('id-ID')}</span>
                                                <span className={`text-[9px] font-bold ${item.diffDays > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {item.diffDays > 0 ? `${item.diffDays} hari lewat` : `${Math.abs(item.diffDays)} hari lagi`}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[10px] text-right font-bold text-primary py-3">{formatRupiah(item.balance)}</TableCell>
                                        <TableCell className="text-center py-3">
                                            <Badge variant="outline" className={`text-[9px] px-1.5 h-5 font-medium ${item.diffDays > 30 ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                'bg-blue-50 text-blue-600 border-blue-200'
                                                }`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                                        Tidak ada rincian piutang ditemukan.
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
