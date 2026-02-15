"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FlaskConical, Activity, Settings2, Info } from "lucide-react";
import { useGetDiagnosticCatalog } from "~/features/admin/api/getDiagnosticCatalog";
import { DiagnosticCatalogTable } from "~/features/admin/components/DiagnosticCatalogTable";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function AdminDiagnosticCatalogPage() {
    const [activeTab, setActiveTab] = useState("lab");

    const { data: labItems, isLoading: labLoading } = useGetDiagnosticCatalog('lab');
    const { data: radioItems, isLoading: radioLoading } = useGetDiagnosticCatalog('radiology');

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings2 className="h-8 w-8 text-primary" />
                        Manajemen Katalog Diagnostik
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Kelola metadata, instruksi persiapan, dan deskripsi pemeriksaan dari SIMRS Khanza.
                    </p>
                </div>
            </div>

            <Alert className="bg-blue-50 border-blue-100 rounded-3xl p-6">
                <Info className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-900 font-black uppercase tracking-widest text-[10px] mb-1">Informasi Sinkronisasi</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm font-medium">
                    Daftar pemeriksaan di bawah ini diambil secara real-time dari SIMRS Khanza. Anda hanya perlu mengisi metadata tambahan agar informasi di halaman pasien lebih lengkap dan informatif.
                </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <TabsList className="grid grid-cols-2 w-full max-w-md h-12 p-1 bg-muted rounded-2xl">
                    <TabsTrigger value="lab" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all gap-2 font-bold">
                        <FlaskConical className="h-4 w-4" /> Laboratorium
                    </TabsTrigger>
                    <TabsTrigger value="radio" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all gap-2 font-bold">
                        <Activity className="h-4 w-4" /> Radiologi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="lab" className="outline-none">
                    <DiagnosticCatalogTable items={labItems} isLoading={labLoading} type="LAB" />
                </TabsContent>

                <TabsContent value="radio" className="outline-none">
                    <DiagnosticCatalogTable items={radioItems} isLoading={radioLoading} type="RADIOLOGY" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
