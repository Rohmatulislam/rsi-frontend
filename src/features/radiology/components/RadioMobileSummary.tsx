"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

interface RadioMobileSummaryProps {
    selectedTests: string[];
    totalPrice: number;
    selectedTestsData: any[];
    radioDoctors: any[];
    selectedDoctorId: string;
    onDoctorChange: (id: string) => void;
    selectedRadioDoctor: any;
    onClearSelection: () => void;
}

export const RadioMobileSummary = ({
    selectedTests,
    totalPrice,
    selectedTestsData,
    radioDoctors,
    selectedDoctorId,
    onDoctorChange,
    selectedRadioDoctor,
    onClearSelection
}: RadioMobileSummaryProps) => {
    if (selectedTests.length === 0) return null;

    return (
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
                            <Select value={selectedDoctorId || radioDoctors[0]?.id} onValueChange={onDoctorChange}>
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
                        onClick={onClearSelection}
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
    );
};
