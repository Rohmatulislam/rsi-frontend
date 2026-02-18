"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    Download,
    FileText,
    ChevronRight,
    ChevronDown,
    Loader2,
    AlertCircle,
    Activity
} from "lucide-react";
import { getRadiologyHistory, getRadiologyResultDetails, getRadiologyResultPdfUrl, RadiologyHistory } from "../api/getRadiologyResults";
import { cn } from "~/lib/utils";

interface RadiologyResultsListProps {
    noRM: string;
}

export const RadiologyResultsList = ({ noRM }: RadiologyResultsListProps) => {
    const { data: history = [], isLoading, isError } = useQuery({
        queryKey: ["radiologyHistory", noRM],
        queryFn: () => getRadiologyHistory(noRM),
        enabled: !!noRM,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-muted-foreground">Memuat riwayat radiologi...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="border-red-100 bg-red-50">
                <CardContent className="py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-red-900">Gagal Memuat Data</h3>
                    <p className="text-red-700 text-sm">
                        Terjadi kesalahan saat mengambil riwayat radiologi Anda.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (!noRM) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-muted-foreground">Memuat data pasien...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-slate-900">Tidak Ada Hasil Radiologi</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Belum ada data hasil rontgen, USG, atau pemeriksaan radiologi lainnya untuk nomor rekam medis Anda.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((item) => (
                <RadiologyResultItem key={`${item.no_rawat}-${item.tgl_periksa}-${item.jam}`} item={item} noRM={noRM} />
            ))}
        </div>
    );
};

const RadiologyResultItem = ({ item, noRM }: { item: RadiologyHistory; noRM: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: expertise, isLoading: isLoadingDetails } = useQuery({
        queryKey: ["radiologyDetails", item.no_rawat, item.tgl_periksa, item.jam],
        queryFn: () => getRadiologyResultDetails(item.no_rawat, item.tgl_periksa, item.jam),
        enabled: isExpanded,
    });

    const handleDownload = () => {
        const url = getRadiologyResultPdfUrl(item.no_rawat, item.tgl_periksa, item.jam, noRM);
        window.open(url, "_blank");
    };

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300 border-l-4 border-l-blue-500",
            isExpanded ? "ring-2 ring-blue-500/20 shadow-lg" : "hover:shadow-md"
        )}>
            <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-700" />
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
                        className="hidden md:flex text-blue-700 hover:text-blue-800 hover:bg-blue-50"
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
                    <div className="p-5">
                        <h5 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Expertise / Bacaan Dokter
                        </h5>

                        {isLoadingDetails ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm whitespace-pre-wrap text-sm text-slate-700 leading-relaxed min-h-[100px]">
                                {expertise || (
                                    <div className="flex flex-col items-center justify-center py-4 text-slate-400 italic">
                                        <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                                        Hasil expertise belum diinput atau tidak ditemukan.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col md:flex-row gap-2">
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownload}>
                                <Download className="h-4 w-4 mr-2" />
                                Unduh Hasil PDF
                            </Button>
                            <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                                <a href="https://wa.me/628113904000" target="_blank" rel="noopener noreferrer">
                                    Konsultasi Dokter
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
