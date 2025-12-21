"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LabTest } from "../services/labService";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

interface LabMobileSummaryProps {
    selectedTests: LabTest[];
    totalPrice: number;
    pkDoctors: any[];
    selectedDoctorId: string;
    onDoctorChange: (id: string) => void;
    selectedDoctor: any;
    guarantors: any[];
    selectedGuarantor: string;
}

export const LabMobileSummary = ({
    selectedTests,
    totalPrice,
    pkDoctors,
    selectedDoctorId,
    onDoctorChange,
    selectedDoctor,
    guarantors,
    selectedGuarantor
}: LabMobileSummaryProps) => {
    if (selectedTests.length === 0) return null;

    return (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
            <Card className="p-4 shadow-2xl border-primary bg-background/95 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">{selectedTests.length} Pemeriksaan Dipilih</p>
                        <p className="text-lg font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</p>
                    </div>
                    {pkDoctors.length > 1 && (
                        <div className="mb-3">
                            <Select value={selectedDoctorId || pkDoctors[0]?.id} onValueChange={onDoctorChange}>
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
                        doctor={selectedDoctor}
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
    );
};
