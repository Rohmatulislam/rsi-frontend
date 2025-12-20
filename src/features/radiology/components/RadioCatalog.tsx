"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Search, Radio, Filter, Info, ChevronRight, CheckCircle2 } from "lucide-react";
import { useRadioTests } from "../api/getRadioTests";
import { useRadioCategories } from "../api/getRadioCategories";
import { useRadioGuarantors } from "../api/getRadioGuarantors";
import { Skeleton } from "~/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { useGetDoctorsList } from "~/features/doctor/api/getDoctorsList";
import { toast } from "sonner";

interface RadioCatalogProps {
    onSelect?: (testIds: string[]) => void;
    selectedTests?: string[];
}

export const RadioCatalog = ({ onSelect, selectedTests = [] }: RadioCatalogProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedGuarantor, setSelectedGuarantor] = useState<string>("A09"); // Default to UMUM

    const { data: tests, isLoading: testsLoading } = useRadioTests({ kd_pj: selectedGuarantor });
    const { data: categories, isLoading: categoriesLoading } = useRadioCategories({ kd_pj: selectedGuarantor });
    const { data: guarantors } = useRadioGuarantors();
    const { data: doctors } = useGetDoctorsList();

    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

    const radioDoctors = useMemo(() => {
        return doctors?.filter((d: any) =>
            d.specialization?.toLowerCase().includes("radiologi") ||
            d.name?.toLowerCase().includes("rad")
        ) || [];
    }, [doctors]);

    const selectedRadioDoctor = useMemo(() => {
        if (selectedDoctorId) {
            return radioDoctors.find(d => d.id === selectedDoctorId);
        }
        return radioDoctors[0];
    }, [radioDoctors, selectedDoctorId]);

    const filteredTests = useMemo(() => {
        if (!tests) return [];
        return tests.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [tests, searchQuery, selectedCategory]);

    const selectedTestsData = useMemo(() => {
        return tests?.filter(t => selectedTests.includes(t.id)) || [];
    }, [tests, selectedTests]);

    const totalPrice = useMemo(() => {
        return selectedTestsData.reduce((sum, t) => sum + t.price, 0);
    }, [selectedTestsData]);

    const toggleTest = (testId: string) => {
        const newSelected = selectedTests.includes(testId)
            ? selectedTests.filter(id => id !== testId)
            : [...selectedTests, testId];
        onSelect?.(newSelected);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari pemeriksaan (misal: USG, MRI, Rontgen)..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={selectedGuarantor} onValueChange={setSelectedGuarantor}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Penjamin" />
                    </SelectTrigger>
                    <SelectContent>
                        {guarantors?.map((g: any) => (
                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("All")}
                    className="rounded-full"
                >
                    Semua
                </Button>
                {categoriesLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24 rounded-full" />
                    ))
                ) : (
                    categories?.map((cat: string) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className="rounded-full"
                        >
                            {cat}
                        </Button>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testsLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : filteredTests.length > 0 ? (
                    filteredTests.map((test: any) => {
                        const isSelected = selectedTests.includes(test.id);
                        return (
                            <Card
                                key={test.id}
                                className={`group cursor-pointer transition-all duration-300 hover:shadow-md border-2 ${isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'
                                    }`}
                                onClick={() => toggleTest(test.id)}
                            >
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                            {test.category}
                                        </Badge>
                                        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary fill-primary/10" />}
                                    </div>
                                    <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                                        {test.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-lg font-bold text-primary">
                                            Rp {test.price.toLocaleString('id-ID')}
                                        </p>
                                        <Badge variant="outline" className="text-[10px] opacity-70">
                                            {test.class === '-' ? 'Umum' : test.class}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <Radio className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Tidak ada hasil ditemukan</h3>
                        <p className="text-muted-foreground mt-1">
                            Coba ubah kata kunci pencarian atau kategori Anda.
                        </p>
                    </div>
                )}
            </div>

            {/* Selection Summary Bar */}
            {selectedTests.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50">
                    <div className="bg-primary text-primary-foreground rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-90">
                                    {selectedTests.length} Pemeriksaan dipilih
                                </p>
                                <p className="text-xl font-bold">
                                    Total: Rp {totalPrice.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {radioDoctors.length > 1 && (
                                <div className="hidden lg:block min-w-[200px]">
                                    <Select value={selectedDoctorId || radioDoctors[0]?.id} onValueChange={setSelectedDoctorId}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors h-11">
                                            <SelectValue placeholder="Pilih Dokter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {radioDoctors.map((doc: any) => (
                                                <SelectItem key={doc.id} value={doc.id}>
                                                    {doc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                className="text-primary-foreground hover:bg-white/10 hidden md:flex"
                                onClick={() => onSelect?.([])}
                            >
                                Batal
                            </Button>

                            <AppointmentBookingModal
                                doctor={selectedRadioDoctor}
                                initialPoliId="U0026" // Kode Poli Radiologi dari Khanza
                                serviceItem={{
                                    id: selectedTests.join(','),
                                    name: `Pemeriksaan Radiologi: ${selectedTestsData.map(t => t.name).join(', ')}`
                                }}
                                trigger={
                                    <Button className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-6 rounded-xl shadow-lg w-full md:w-auto">
                                        Booking Sekarang <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
