"use client";

import { Search, Filter, Wallet, ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LabTest } from "../services/labService";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

interface LabFiltersSidebarProps {
    selectedGuarantor: string;
    onGuarantorChange: (val: string) => void;
    guarantors: any[];
    searchQuery: string;
    onSearchChange: (val: string) => void;
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
    categories: string[];
    selectedTests: LabTest[];
    onRemoveTest: (id: string) => void;
    totalPrice: number;
    selectedDoctor: any;
    pkDoctors: any[];
    selectedDoctorId: string;
    onDoctorChange: (id: string) => void;
    hideSummary?: boolean;
}

export const LabFiltersSidebar = ({
    selectedGuarantor,
    onGuarantorChange,
    guarantors,
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    selectedTests,
    onRemoveTest,
    totalPrice,
    selectedDoctor,
    pkDoctors,
    selectedDoctorId,
    onDoctorChange,
    hideSummary
}: LabFiltersSidebarProps) => {
    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Jenis Penjamin
                </h3>
                <Select value={selectedGuarantor} onValueChange={onGuarantorChange}>
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
                    onChange={(e) => onSearchChange(e.target.value)}
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
                        onClick={() => onCategoryChange("All")}
                    >
                        Semua Kategori
                    </Button>
                    {categories?.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            className="justify-start truncate"
                            onClick={() => onCategoryChange(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Selected Tests Summary (Desktop) */}
            {!hideSummary && (
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
                                        onClick={() => onRemoveTest(test.id)}
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
                                    <Select value={selectedDoctorId || pkDoctors[0]?.id} onValueChange={onDoctorChange}>
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
                                initialPoliId="U0025"
                                doctor={selectedDoctor}
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
            )}
        </div>
    );
};
