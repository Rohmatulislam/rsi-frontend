"use client";

import { useState, useMemo } from "react";
import { Search, Filter, TestTube, CheckCircle2, ShoppingCart, Trash2, ChevronRight, Wallet, Users, Info, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { useLabTests } from "../api/getLabTests";
import { useLabCategories } from "../api/getLabCategories";
import { useLabGuarantors } from "../api/getLabGuarantors";
import { LabTest } from "../types";
import { labService } from "../services/labService";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LabTemplateDetail } from "./LabTemplateDetail";

export const LabCatalog = () => {
    const [selectedGuarantor, setSelectedGuarantor] = useState<string>("A09"); // Default to UMUM
    const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});
    const [viewingTemplateId, setViewingTemplateId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const { data: guarantors, isLoading: guarsLoading } = useLabGuarantors();
    const { data: tests, isLoading: testsLoading } = useLabTests({ kd_pj: selectedGuarantor });
    const { data: categories, isLoading: catsLoading } = useLabCategories({ kd_pj: selectedGuarantor });
    const { data: doctors } = useGetDoctorsList();

    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

    const pkDoctors = useMemo(() => {
        return doctors?.filter((d: any) =>
            d.specialization?.toLowerCase().includes("patologi klinik") ||
            d.name?.toLowerCase().includes("sp.pk")
        ) || [];
    }, [doctors]);

    const selectedPkDoctor = useMemo(() => {
        if (selectedDoctorId) {
            return pkDoctors.find(d => d.id === selectedDoctorId);
        }
        return pkDoctors[0];
    }, [pkDoctors, selectedDoctorId]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);

    const filteredTests = useMemo(() => {
        if (!tests) return [];
        return tests.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
            const templateMatches = test.template.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
            return (matchesSearch || templateMatches) && matchesCategory;
        });
    }, [tests, searchQuery, selectedCategory]);

    const toggleTest = (test: LabTest) => {
        setSelectedTests(prev => {
            const exists = prev.find(t => t.id === test.id);
            if (exists) {
                return prev.filter(t => t.id !== test.id);
            }
            return [...prev, { ...test, price: labService.calculateEffectivePrice(test) }];
        });
    };

    const totalPrice = useMemo(() => {
        return selectedTests.reduce((sum, test) => sum + test.price, 0);
    }, [selectedTests]);

    const removeTest = (id: string) => {
        setSelectedTests(prev => prev.filter(t => t.id !== id));
    };

    const toggleExpand = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedTests(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const openTemplateDetail = (e: React.MouseEvent, templateId: number) => {
        e.stopPropagation();
        setViewingTemplateId(templateId);
        setIsDetailOpen(true);
    };

    const handleGuarantorChange = (val: string) => {
        setSelectedGuarantor(val);
        setSelectedTests([]);
        setSelectedCategory("All");
        setExpandedTests({});
    };

    if (testsLoading || catsLoading || guarsLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <LabTemplateDetail
                templateId={viewingTemplateId}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />

            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> Jenis Penjamin
                    </h3>
                    <Select value={selectedGuarantor} onValueChange={handleGuarantorChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Penjamin" />
                        </SelectTrigger>
                        <SelectContent>
                            {guarantors?.map(g => (
                                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari pemeriksaan / parameter..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Kategori
                    </h3>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                        <Button
                            variant={selectedCategory === "All" ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            onClick={() => setSelectedCategory("All")}
                        >
                            Semua Kategori
                        </Button>
                        {categories?.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                className="justify-start truncate"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Selected Tests Summary (Desktop) */}
                <div className="hidden lg:block p-4 border rounded-xl bg-muted/30">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" /> Pesanan ({selectedTests.length})
                    </h3>
                    <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-2">
                        {selectedTests.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Belum ada pilihan</p>
                        ) : (
                            selectedTests.map(test => (
                                <div key={test.id} className="flex items-center justify-between gap-2 p-2 bg-background rounded-lg border text-sm">
                                    <span className="truncate">{test.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() => removeTest(test.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedTests.length > 0 && (
                        <div className="pt-3 border-t space-y-3">
                            <div className="flex justify-between font-bold">
                                <span>Total Estimasi:</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            {pkDoctors.length > 1 && (
                                <div className="mb-4">
                                    <Label className="text-xs mb-1 block">Pilih Dokter Spesialis:</Label>
                                    <Select value={selectedDoctorId || pkDoctors[0]?.id} onValueChange={setSelectedDoctorId}>
                                        <SelectTrigger className="w-full h-10">
                                            <SelectValue placeholder="Pilih Dokter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pkDoctors.map((doc: any) => (
                                                <SelectItem key={doc.id} value={doc.id}>
                                                    {doc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <AppointmentBookingModal
                                initialPoliId="U0025" // Kode Poli Laboratorium dari Khanza
                                doctor={selectedPkDoctor}
                                serviceItem={{
                                    id: "LAB-MULTI",
                                    name: `[${guarantors?.find(g => g.id === selectedGuarantor)?.name}] ` + selectedTests.map(t => t.name).join(", ")
                                }}
                                trigger={
                                    <Button className="w-full">
                                        Booking Sekarang <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Tests Grid */}
            <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-3 py-1">
                            <Users className="h-3 w-3 mr-2" />
                            {guarantors?.find(g => g.id === selectedGuarantor)?.name || "Pilih Penjamin"}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            | {filteredTests.length} jenis pemeriksaan
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredTests.map(test => {
                        const isSelected = selectedTests.some(t => t.id === test.id);
                        const isExpanded = expandedTests[test.id] || (searchQuery.length > 2 && test.template.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())));
                        const price = labService.calculateEffectivePrice(test);

                        return (
                            <Card
                                key={test.id}
                                className={`overflow-hidden transition-all border-2 ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-transparent'}`}
                            >
                                <div
                                    className="p-4 cursor-pointer flex items-start justify-between gap-4"
                                    onClick={() => toggleTest(test)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold">
                                                {test.category}
                                            </Badge>
                                        </div>
                                        <h4 className="font-bold text-lg mb-1">{test.name}</h4>
                                        <div className="flex items-center gap-4">
                                            <p className="text-primary font-bold">
                                                Rp {price.toLocaleString('id-ID')}
                                            </p>
                                            {test.template.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs gap-1 hover:bg-primary/10"
                                                    onClick={(e) => toggleExpand(e, test.id)}
                                                >
                                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                    {test.template.length} Parameter
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30 text-transparent'}`}>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* Template Details Accordion */}
                                {isExpanded && test.template.length > 0 && (
                                    <div className="px-4 pb-4 border-t bg-muted/10 animate-in slide-in-from-top-2 duration-200">
                                        <div className="pt-3 space-y-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Daftar Parameter Test (Klik untuk Detail):</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                                {test.template.map((item, idx) => {
                                                    const isMatch = searchQuery.length > 0 && item.name.toLowerCase().includes(searchQuery.toLowerCase());
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={`flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-background cursor-pointer group transition-colors border-b border-muted/30 last:border-0 ${isMatch ? 'bg-yellow-100/50' : ''}`}
                                                            onClick={(e) => openTemplateDetail(e, item.id)}
                                                        >
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <span className="text-[10px] opacity-40 shrink-0">{idx + 1}.</span>
                                                                <span className={`text-xs truncate ${isMatch ? 'font-bold text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                                    {item.name}
                                                                </span>
                                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
                                                            </div>
                                                            <div className="flex items-center gap-3 shrink-0">
                                                                {item.unit && <span className="text-[10px] italic text-muted-foreground">({item.unit})</span>}
                                                                {item.price > 0 && <span className="text-xs font-semibold text-primary/80">Rp {item.price.toLocaleString('id-ID')}</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {filteredTests.length === 0 && (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                        <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold mb-2">Pemeriksaan tidak ditemukan</h3>
                        <p className="text-muted-foreground">Coba gunakan kata kunci pencarian lain atau ganti penjamin</p>
                    </div>
                )}
            </div>

            {/* Sticky Mobile Summary */}
            {selectedTests.length > 0 && (
                <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
                    <Card className="p-4 shadow-2xl border-primary bg-background/95 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase">{selectedTests.length} Pemeriksaan Dipilih</p>
                                <p className="text-lg font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</p>
                            </div>
                            {pkDoctors.length > 1 && (
                                <div className="mb-3">
                                    <Select value={selectedDoctorId || pkDoctors[0]?.id} onValueChange={setSelectedDoctorId}>
                                        <SelectTrigger className="w-full h-9 text-xs">
                                            <SelectValue placeholder="Pilih Dokter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pkDoctors.map((doc: any) => (
                                                <SelectItem key={doc.id} value={doc.id}>
                                                    {doc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <AppointmentBookingModal
                                initialPoliId="U0025"
                                doctor={selectedPkDoctor}
                                serviceItem={{
                                    id: "LAB-MULTI",
                                    name: `[${guarantors?.find(g => g.id === selectedGuarantor)?.name}] ` + selectedTests.map(t => t.name).join(", ")
                                }}
                                trigger={
                                    <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
                                        Booking <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                }
                            />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
