"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    Download,
    FileText,
    ChevronRight,
    ChevronDown,
    Loader2,
    AlertCircle,
    FlaskConical
} from "lucide-react";
import { getLabHistory, getLabResultDetails, getLabResultPdfUrl, LabHistory } from "../api/getLabResults";
import { cn } from "~/lib/utils";

interface LabResultsListProps {
    noRM: string;
}

export const LabResultsList = ({ noRM }: LabResultsListProps) => {
    const { data: history = [], isLoading, isError } = useQuery({
        queryKey: ["labHistory", noRM],
        queryFn: () => getLabHistory(noRM),
        enabled: !!noRM,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-muted-foreground">Memuat riwayat laboratorium...</p>
            </div>
        );
    }

    if (isError || !noRM) {
        return (
            <Card className="border-red-100 bg-red-50">
                <CardContent className="py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-red-900">Gagal Memuat Data</h3>
                    <p className="text-red-700 text-sm">
                        Terjadi kesalahan saat mengambil riwayat laboratorium Anda.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (history.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <FlaskConical className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-slate-900">Tidak Ada Hasil Laboratorium</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Belum ada data hasil laboratorium atau MCU digital untuk nomor rekam medis Anda.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((item) => (
                <LabResultItem key={`${item.no_rawat}-${item.kd_jenis_prw}`} item={item} noRM={noRM} />
            ))}
        </div>
    );
};

const LabResultItem = ({ item, noRM }: { item: LabHistory; noRM: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: details = [], isLoading: isLoadingDetails } = useQuery({
        queryKey: ["labDetails", item.no_rawat, item.kd_jenis_prw],
        queryFn: () => getLabResultDetails(item.no_rawat, item.kd_jenis_prw),
        enabled: isExpanded,
    });

    const handleDownload = () => {
        const url = getLabResultPdfUrl(item.no_rawat, item.kd_jenis_prw, noRM);
        window.open(url, "_blank");
    };

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "ring-2 ring-emerald-500/20 shadow-lg" : "hover:shadow-md"
        )}>
            <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">{item.nm_perawatan}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span>{item.tgl_periksa}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{item.nm_dokter}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hidden md:flex text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                    </Button>
                    <div className="p-2 text-slate-400">
                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t bg-slate-50/50">
                    <div className="p-4">
                        {isLoadingDetails ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-2">Pemeriksaan</th>
                                            <th className="px-4 py-2">Hasil</th>
                                            <th className="px-4 py-2">Satuan</th>
                                            <th className="px-4 py-2">Rujukan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {details.map((detail, idx) => (
                                            <tr key={idx} className="bg-white/50">
                                                <td className="px-4 py-3 font-medium text-slate-700">{detail.name}</td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        detail.isAbnormal ? "text-red-600 font-bold" : "text-slate-900"
                                                    )}>
                                                        {detail.nilai}
                                                        {detail.isAbnormal && <Badge variant="destructive" className="ml-2 scale-75 origin-left">!</Badge>}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">{detail.satuan}</td>
                                                <td className="px-4 py-3 text-slate-500 italic">{detail.nilai_rujukan}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4 flex md:hidden">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleDownload}>
                                <Download className="h-4 w-4 mr-2" />
                                Unduh Hasil PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
