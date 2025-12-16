"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft, FileText, Stethoscope, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { getHealthHistory, HealthRecord } from "../api/getHealthHistory";

export const HealthHistoryPage = () => {
    const { data: healthRecords = [] } = useQuery<HealthRecord[]>({
        queryKey: ["healthHistory"],
        queryFn: getHealthHistory,
    });

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <Button variant="ghost" asChild className="mb-4">
                            <Link href="/profil">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Profil
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900">Riwayat Kesehatan</h1>
                        <p className="text-muted-foreground">Catatan medis dan riwayat kunjungan Anda</p>
                    </div>

                    {healthRecords.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Belum Ada Riwayat</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                    Riwayat kesehatan Anda akan muncul di sini setelah melakukan kunjungan ke RSI Siti Hajar
                                </p>
                                <Button asChild>
                                    <Link href="/doctors">
                                        <Stethoscope className="h-4 w-4 mr-2" />
                                        Lihat Dokter
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {healthRecords.map((record) => (
                                <Card key={record.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                                            <span className="text-sm text-muted-foreground">
                                                {record.date}
                                            </span>
                                        </div>
                                        <CardDescription>{record.doctor}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Card className="mt-8 bg-blue-50 border-blue-200">
                        <CardContent className="py-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-900">Informasi</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Fitur ini akan terintegrasi dengan sistem rekam medis SIMRS Khanza
                                        untuk menampilkan riwayat kesehatan lengkap Anda.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default HealthHistoryPage;
