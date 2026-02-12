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
    Activity,
    TrendingUp,
    Calendar,
    Users,
    Search,
    ShieldCheck,
    Stethoscope,
    Building2,
    Clock,
    UserCheck,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieChartIcon
} from "lucide-react";
import { useBPJSPerformance } from "../api/getFinanceReports";
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
    Pie,
    AreaChart,
    Area,
    Legend
} from 'recharts';
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

interface ReportProps {
    period?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

export const BPJSPerformanceReport = ({ period, date, startDate, endDate }: ReportProps) => {
    const { data, isLoading, error } = useBPJSPerformance(period, date, startDate, endDate);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredRecent = useMemo(() => {
        if (!data?.recent) return [];
        return data.recent.filter((item: any) =>
            item.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.no_sep.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.no_rawat.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Memuat data performa BPJS...</div>;
    if (error) return <div className="p-8 text-center text-rose-500">Error memuat data performa BPJS.</div>;
    if (!data) return null;

    const { summary, trends, diagnoses, participants, classes, services } = data;

    return (
        <div className="space-y-6">
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total SEP</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.totalSEP.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Seluruh database</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">SEP Periode Ini</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(summary.periodSEP || 0).toLocaleString()}</div>
                        <div className="flex items-center text-xs text-emerald-600 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>Update real-time</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Top Diagnosa</CardTitle>
                        <Stethoscope className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold truncate" title={summary.topDiagnosis}>{summary.topDiagnosis}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-amber-600">Terbanyak bulan ini</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-violet-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Rasio Inap/Jalan</CardTitle>
                        <Activity className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {services.find((s: any) => s.name === "Rawat Inap")?.value || 0} / {services.find((s: any) => s.name === "Rawat Jalan")?.value || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Volume layanan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1: Volume Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Tren Volume SEP
                        </CardTitle>
                        <CardDescription>Pertumbuhan penerbitan SEP 6 bulan terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        name="Jumlah SEP"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-rose-500" />
                            Top 10 Diagnosa ICD-10
                        </CardTitle>
                        <CardDescription>Distribusi penyakit terbanyak</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={diagnoses} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="code"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 600 }}
                                        width={60}
                                    />
                                    <Tooltip
                                        formatter={(value: any, name: any, props: any) => [value, props.payload.name]}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20}>
                                        {diagnoses.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2: Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            Jenis Peserta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={participants}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {participants.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 space-y-1">
                            {participants.slice(0, 3).map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="truncate w-32">{p.name}</span>
                                    </div>
                                    <span className="font-semibold text-blue-600">{p.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            Distribusi Kelas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={classes}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                    >
                                        {classes.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-violet-500" />
                            Jenis Layanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={services}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {services.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : '#ec4899'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent SEP Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>SEP Terbaru</CardTitle>
                        <CardDescription>Rincian data 50 penerbitan SEP terakhir</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari Nama/SEP/No.Rawat..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[180px]">No. SEP</TableHead>
                                    <TableHead>Nama Pasien</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Poli/Unit</TableHead>
                                    <TableHead>Diagnosa</TableHead>
                                    <TableHead className="text-right">No. Rawat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecent.length > 0 ? (
                                    filteredRecent.map((item: any) => (
                                        <TableRow key={item.no_sep}>
                                            <TableCell className="font-mono text-xs font-semibold text-blue-600">
                                                {item.no_sep}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{item.nama_pasien}</div>
                                                <div className="text-xs text-muted-foreground">MR: {item.nomr}</div>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {format(new Date(item.tglsep), "dd MMM yyyy", { locale: id })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-normal">
                                                    {item.poli || '-'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-xs" title={item.diagnosa}>
                                                {item.diagnosa}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs">
                                                {item.no_rawat}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data SEP yang ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
