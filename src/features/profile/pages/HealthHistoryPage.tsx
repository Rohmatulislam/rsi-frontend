"use client";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft, FileText, Stethoscope, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "~/features/auth/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { getHealthHistory, HealthRecord } from "../api/getHealthHistory";
import { getProfile } from "../api/getProfile";
import { LabResultsList } from "../components/LabResultsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Activity, FlaskConical } from "lucide-react";

export const HealthHistoryPage = () => {
    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const { data: healthRecords = [] } = useQuery<HealthRecord[]>({
        queryKey: ["healthHistory"],
        queryFn: getHealthHistory,
    });

    const [activeTab, setActiveTab] = useState("history");

    const noRM = (profile as any)?.noRM;

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

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-white border p-1 rounded-xl h-auto">
                            <TabsTrigger value="history" className="rounded-lg py-2.5">
                                <Activity className="h-4 w-4 mr-2" />
                                Diagnosis & Kunjungan
                            </TabsTrigger>
                            <TabsTrigger value="lab" className="rounded-lg py-2.5">
                                <FlaskConical className="h-4 w-4 mr-2" />
                                Hasil Laboratorium & MCU
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="history" className="space-y-4">
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
                                healthRecords.map((record) => (
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
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="lab">
                            <LabResultsList noRM={noRM} />
                        </TabsContent>
                    </Tabs>

                    <Card className="mt-8 bg-emerald-50 border-emerald-200">
                        <CardContent className="py-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-emerald-900">Digitalisasi Rekam Medis</h4>
                                    <p className="text-sm text-emerald-700 mt-1">
                                        Hasil pemeriksaan di atas ditarik langsung dari SIMRS Khanza RSI Siti Hajar Mataram.
                                        Pastikan data NIK Anda di profil sudah sesuai untuk validasi rekam medis.
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
