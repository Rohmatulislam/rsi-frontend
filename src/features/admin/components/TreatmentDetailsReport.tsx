"use client";

import { useState } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "~/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
    Search, Download, Loader2, Calendar,
    Stethoscope, User, MapPin, CreditCard,
    Activity, ChevronLeft, ChevronRight,
    Building2, DollarSign, Users, Wallet
} from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "~/components/ui/select";
import {
    Tabs, TabsList, TabsTrigger
} from "~/components/ui/tabs";
import { useTreatmentDetails } from "../api/getFinanceReports";
import { formatRupiah, exportToCSV } from "../utils/exportCSV";
import { Badge } from "~/components/ui/badge";

export const TreatmentDetailsReport = () => {
    const [period, setPeriod] = useState("daily");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(0);
    const limit = 50;

    const isCustomRange = startDate && endDate;

    const { data, isLoading } = useTreatmentDetails({
        period,
        date: !isCustomRange ? date : undefined,
        startDate: isCustomRange ? startDate : undefined,
        endDate: isCustomRange ? endDate : undefined,
        search,
        category,
        limit,
        offset: page * limit
    });

    const handleExport = () => {
        if (!data?.data) return;
        const columns = category === 'farmasi' ? [
            { key: 'no_rawat', label: 'No. Rawat' },
            { key: 'no_rkm_medis', label: 'No. RM' },
            { key: 'nm_pasien', label: 'Pasien' },
            { key: 'nm_perawatan', label: 'Nama Obat' },
            { key: 'tgl_perawatan', label: 'Tanggal' },
            { key: 'jam_rawat', label: 'Jam' },
            { key: 'unitName', label: 'Unit' },
            { key: 'biaya_obat', label: 'Harga' },
            { key: 'jml', label: 'Qty' },
            { key: 'embalase', label: 'Embalase' },
            { key: 'tuslah', label: 'Tuslah' },
            { key: 'total', label: 'Total' },
        ] : [
            { key: 'no_rawat', label: 'No. Rawat' },
            { key: 'no_rkm_medis', label: 'No. RM' },
            { key: 'nm_pasien', label: 'Pasien' },
            { key: 'nm_perawatan', label: 'Tindakan' },
            { key: 'performerName', label: 'Pelaksana' },
            { key: 'tgl_perawatan', label: 'Tanggal' },
            { key: 'jam_rawat', label: 'Jam' },
            { key: 'caraBayar', label: 'Cara Bayar' },
            { key: 'unitName', label: 'Unit/Ruangan' },
            { key: 'jasaSarana', label: 'Jasa Sarana' },
            { key: 'paketBHP', label: 'Paket BHP' },
            { key: 'jmDokter', label: 'JM Dokter' },
            { key: 'jmPetugas', label: 'JM Petugas' },
            { key: 'menejemen', label: 'Manajemen' },
            { key: 'total', label: 'Total' },
        ];

        exportToCSV(data.data as any[], `detail_tindakan_${category}`, columns);
    };

    const getSourceBadge = (source: string) => {
        let color = "bg-slate-100 text-slate-700";
        let label = source;

        switch (source) {
            case 'rawat_jl_dr': color = "bg-blue-100 text-blue-700"; label = "Ralan Dokter"; break;
            case 'rawat_jl_pr': color = "bg-blue-100 text-blue-700"; label = "Ralan Paramedis"; break;
            case 'rawat_jl_drpr': color = "bg-blue-100 text-blue-700"; label = "Ralan Dr & Pr"; break;
            case 'rawat_inap_dr': color = "bg-emerald-100 text-emerald-700"; label = "Ranap Dokter"; break;
            case 'rawat_inap_pr': color = "bg-emerald-100 text-emerald-700"; label = "Ranap Paramedis"; break;
            case 'rawat_inap_drpr': color = "bg-emerald-100 text-emerald-700"; label = "Ranap Dr & Pr"; break;
            case 'operasi': color = "bg-rose-100 text-rose-700"; label = "Operasi & VK"; break;
            case 'periksa_radiologi': color = "bg-purple-100 text-purple-700"; label = "Radiologi"; break;
            case 'periksa_lab': color = "bg-amber-100 text-amber-700"; label = "Laborat"; break;
            case 'detail_periksa_lab': color = "bg-amber-50 text-amber-600"; label = "Detail Lab"; break;
            case 'periksa_utd': color = "bg-red-100 text-red-700"; label = "UTD"; break;
        }

        return <Badge className={`${color} border-none font-normal text-[10px]`}>{label}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Detail Tindakan
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Rincian prosedur medis, jasa sarana, dan jasa pelaksana dari SIMRS Khanza.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[130px] h-9">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Harian</SelectItem>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                        {period === 'daily' && !isCustomRange && (
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-[150px] h-9"
                            />
                        )}
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                            className="w-[140px] h-9"
                            placeholder="Mulai"
                        />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                            className="w-[140px] h-9"
                            placeholder="Selesai"
                        />
                    </div>

                    <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <Tabs value={category} onValueChange={(v) => { setCategory(v); setPage(0); }} className="w-full">
                <TabsList className="bg-slate-100 p-1 w-full lg:w-auto h-auto grid grid-cols-3 md:grid-cols-4 lg:flex lg:flex-nowrap gap-1">
                    <TabsTrigger value="all" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Semua</TabsTrigger>
                    <TabsTrigger value="ralan" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Ralan</TabsTrigger>
                    <TabsTrigger value="ranap" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Ranap</TabsTrigger>
                    <TabsTrigger value="operasi" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Operasi</TabsTrigger>
                    <TabsTrigger value="laborat" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Laborat</TabsTrigger>
                    <TabsTrigger value="radiologi" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Radiologi</TabsTrigger>
                    <TabsTrigger value="utd" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">UTD</TabsTrigger>
                    <TabsTrigger value="farmasi" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Farmasi</TabsTrigger>
                    <TabsTrigger value="tambahan" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Tambahan</TabsTrigger>
                    <TabsTrigger value="potongan" className="text-xs h-9 px-4 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Potongan</TabsTrigger>
                </TabsList>
            </Tabs>

            {data?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-none shadow-sm bg-slate-50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Jasa Sarana</p>
                                <p className="text-lg font-black text-slate-900">{formatRupiah(data.summary.jasaSarana + data.summary.paketBHP)}</p>
                            </div>
                            <div className="bg-slate-200 p-2 rounded-lg">
                                <Building2 className="h-5 w-5 text-slate-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-blue-50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Total JM Dokter</p>
                                <p className="text-lg font-black text-blue-700">{formatRupiah(data.summary.jmDokter)}</p>
                            </div>
                            <div className="bg-blue-200 p-2 rounded-lg">
                                <Stethoscope className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-emerald-50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Total JM Perawat</p>
                                <p className="text-lg font-black text-emerald-700">{formatRupiah(data.summary.jmPetugas)}</p>
                            </div>
                            <div className="bg-emerald-200 p-2 rounded-lg">
                                <Users className="h-5 w-5 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-primary text-white">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-primary-foreground/70 uppercase tracking-wider">Total Pendapatan</p>
                                <p className="text-lg font-black">{formatRupiah(data.summary.total)}</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="pb-0 pt-4 px-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari Nama Pasien, No. RM, atau No. Rawat..."
                            className="pl-10 h-10 border-slate-200 transition-all focus:ring-primary"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="text-xs font-bold w-[120px]">No. Rawat</TableHead>
                                    <TableHead className="text-xs font-bold whitespace-nowrap">Pasien</TableHead>
                                    <TableHead className="text-xs font-bold">{category === 'farmasi' ? 'Nama Obat/Alkes' : 'Tindakan/Perawatan'}</TableHead>
                                    <TableHead className="text-xs font-bold">{category === 'farmasi' ? 'Unit' : 'Unit/Pelaksana'}</TableHead>
                                    {category === 'farmasi' ? (
                                        <>
                                            <TableHead className="text-xs font-bold text-right">Harga</TableHead>
                                            <TableHead className="text-xs font-bold text-right">Qty</TableHead>
                                            <TableHead className="text-xs font-bold text-right">Emb+Tsl</TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead className="text-xs font-bold text-right">Jasa Sarana</TableHead>
                                            <TableHead className="text-xs font-bold text-right">JM Dokter</TableHead>
                                            <TableHead className="text-xs font-bold text-right">JM Perawat</TableHead>
                                        </>
                                    )}
                                    <TableHead className="text-xs font-bold text-right">Total</TableHead>
                                    <TableHead className="text-xs font-bold text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                                <span className="text-sm text-muted-foreground">Menarik data dari Khanza...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : data?.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                            Data tidak ditemukan untuk periode ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.data.map((item, i) => (
                                        <TableRow key={i} className="hover:bg-slate-50/80 transition-colors">
                                            <TableCell className="py-3">
                                                <div className="text-[11px] font-mono text-slate-500">{item.no_rawat}</div>
                                                <div className="text-[10px] text-slate-400">{new Date(item.tgl_perawatan).toLocaleDateString('id-ID')} {item.jam_rawat}</div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="font-bold text-xs">{item.nm_pasien}</div>
                                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <User className="h-3 w-3" /> {item.no_rkm_medis} • <CreditCard className="h-3 w-3 ml-1" /> {item.caraBayar}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="text-xs font-medium">{item.nm_perawatan}</div>
                                                <div className="text-[10px] text-slate-400">{item.kd_jenis_prw}</div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[11px] font-semibold flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-rose-500" /> {item.unitName}
                                                    </div>
                                                    {category !== 'farmasi' && (
                                                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                            <Stethoscope className="h-3 w-3" /> {item.performerName}
                                                            {item.secondaryPerformerName && <span className="text-[9px] text-slate-400">& {item.secondaryPerformerName}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            {category === 'farmasi' ? (
                                                <>
                                                    <TableCell className="text-right py-3 text-xs font-medium">{formatRupiah(item.biaya_obat || 0)}</TableCell>
                                                    <TableCell className="text-right py-3 text-xs font-medium">{item.jml}</TableCell>
                                                    <TableCell className="text-right py-3 text-xs font-medium">{formatRupiah((item.embalase || 0) + (item.tuslah || 0))}</TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="text-right py-3 text-xs font-medium">{formatRupiah(item.jasaSarana + item.paketBHP)}</TableCell>
                                                    <TableCell className="text-right py-3 text-xs font-medium text-blue-600">{formatRupiah(item.jmDokter)}</TableCell>
                                                    <TableCell className="text-right py-3 text-xs font-medium text-emerald-600">{formatRupiah(item.jmPetugas)}</TableCell>
                                                </>
                                            )}
                                            <TableCell className="text-right py-3 text-[13px] font-black text-slate-900">{formatRupiah(item.total)}</TableCell>
                                            <TableCell className="text-center py-3">
                                                {getSourceBadge(item.source)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
                        <p className="text-xs text-muted-foreground">
                            Menampilkan <span className="font-bold">{data?.data.length || 0}</span> dari <span className="font-bold">{data?.total || 0}</span> data
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 0 || isLoading}
                                onClick={() => setPage(p => p - 1)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium px-2">Halaman {page + 1}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!data || (page + 1) * limit >= data.total || isLoading}
                                onClick={() => setPage(p => p + 1)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
