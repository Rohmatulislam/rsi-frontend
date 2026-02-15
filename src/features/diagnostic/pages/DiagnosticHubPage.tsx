"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    Activity,
    FlaskConical,
    Layers,
    ClipboardCheck,
    Search,
    ShoppingCart,
    ChevronRight,
    Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ServiceHero } from "~/features/services";
import { BreadcrumbContainer } from "~/components/shared/Breadcrumb";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useDiagnosticBasket } from "../store/useDiagnosticBasket";
import { DiagnosticCheckoutModal } from "../components/DiagnosticCheckoutModal";

// Lazy-loaded or imported feature pages
import { MCUPage } from "~/features/mcu/pages/MCUPage";
import { LabCatalog } from "~/features/lab/components/LabCatalog";
import { RadioCatalog } from "~/features/radiology/components/RadioCatalog";

export const DiagnosticHubPage = () => {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") || "mcu";
    const [activeTab, setActiveTab] = useState(initialTab);
    const { items, removeItem, getTotalPrice, getItemCount } = useDiagnosticBasket();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && (tab === "mcu" || tab === "lab" || tab === "radio")) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <BreadcrumbContainer
                items={[
                    { label: "Layanan", href: "/layanan" },
                    { label: "Diagnostic Hub" }
                ]}
                className="bg-white/50 dark:bg-slate-900/50 border-b backdrop-blur-sm sticky top-0 z-50"
            />

            <ServiceHero
                badge="DIAGNOSTIC HUB"
                title="Pusat Layanan Diagnostik"
                highlightText="Akurat & Terpercaya"
                subtitle="Satu portal untuk semua kebutuhan MCU, Laboratorium, dan Radiologi Anda dengan hasil digital yang dapat diakses kapan saja."
            />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-3 w-full max-w-2xl mb-8 h-16 p-1 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
                                <TabsTrigger value="mcu" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                                    <ClipboardCheck className="h-4 w-4" />
                                    <span className="hidden md:inline">Paket MCU</span>
                                    <span className="md:hidden">MCU</span>
                                </TabsTrigger>
                                <TabsTrigger value="lab" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                                    <FlaskConical className="h-4 w-4" />
                                    <span className="hidden md:inline">Laboratorium</span>
                                    <span className="md:hidden">Lab</span>
                                </TabsTrigger>
                                <TabsTrigger value="radio" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                                    <Activity className="h-4 w-4" />
                                    <span className="hidden md:inline">Radiologi</span>
                                    <span className="md:hidden">Radio</span>
                                </TabsTrigger>
                            </TabsList>

                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border shadow-sm overflow-hidden p-1">
                                <TabsContent value="mcu" className="m-0 focus-visible:ring-0">
                                    <div className="p-0">
                                        <MCUPage />
                                    </div>
                                </TabsContent>
                                <TabsContent value="lab" className="m-0 focus-visible:ring-0">
                                    <div className="p-6">
                                        <LabCatalog hideSummary />
                                    </div>
                                </TabsContent>
                                <TabsContent value="radio" className="m-0 focus-visible:ring-0">
                                    <div className="p-6">
                                        <RadioCatalog hideSummary />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>

                    {/* Sidebar / Health Basket */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
                                <div className="p-6 bg-primary text-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart className="h-5 w-5" />
                                        <h3 className="font-bold">Health Basket</h3>
                                    </div>
                                    <Badge variant="outline" className="bg-white/20 text-white border-none">{getItemCount()} Item</Badge>
                                </div>

                                <ScrollArea className="flex-grow p-6">
                                    {items.length > 0 ? (
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <div key={item.id} className="group relative flex flex-col gap-1 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className="text-sm font-bold leading-tight line-clamp-2">{item.name}</span>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors text-xs font-bold"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <Badge variant="secondary" className="text-[8px] h-4 py-0 uppercase font-black tracking-widest">{item.type}</Badge>
                                                        <span className="text-xs font-bold text-primary">Rp {item.price.toLocaleString('id-ID')}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 flex flex-col items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                                <ShoppingCart className="h-6 w-6 text-slate-300" />
                                            </div>
                                            <p className="text-xs text-muted-foreground px-4">Belum ada pemeriksaan pilihan. Pilih pemeriksaan di tab sebelah kiri.</p>
                                        </div>
                                    )}
                                </ScrollArea>

                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t mt-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-sm font-bold text-muted-foreground">Total Estimasi</span>
                                        <span className="text-2xl font-black text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                                    </div>
                                    <DiagnosticCheckoutModal />
                                    <p className="text-[10px] text-center text-muted-foreground mt-4 px-4 leading-relaxed">
                                        <Info className="h-3 w-3 inline mr-1 mb-0.5" /> Harga dapat berubah sesuai jenis penjamin yang dipilih saat registrasi ulang.
                                    </p>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-10 -mt-10" />
                                <h4 className="font-bold text-lg mb-2 relative z-10">Hasil Digital</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4 relative z-10">Dapatkan hasil pemeriksaan di portal pasien atau melalui WhatsApp setelah divalidasi dokter.</p>
                                <Button variant="link" className="text-primary p-0 h-auto font-bold text-xs">Cek Portal Hasil <ChevronRight className="h-3 w-3 ml-1" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
