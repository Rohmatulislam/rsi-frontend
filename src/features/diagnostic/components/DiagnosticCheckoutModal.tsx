"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "~/components/ui/dialog";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, ShoppingCart, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useDiagnosticBasket } from "../store/useDiagnosticBasket";
import { DiagnosticDateStep, DiagnosticPatientStep, DiagnosticConfirmStep, DiagnosticSuccessStep } from "./booking/index";

type Step = "date" | "patient" | "confirm" | "success";

interface DiagnosticCheckoutModalProps {
    trigger?: React.ReactNode;
}

export const DiagnosticCheckoutModal = ({ trigger }: DiagnosticCheckoutModalProps) => {
    const { items, clearBasket, getTotalPrice } = useDiagnosticBasket();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>("date");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingResponse, setBookingResponse] = useState<any>(null);

    const [formData, setFormData] = useState({
        date: undefined as Date | undefined,
        timeSlot: "",
        patientType: "old" as "new" | "old",
        mrNumber: "",
        nik: "",
        fullName: "",
        phone: "",
        email: "",
        birthDate: "",
        gender: "",
        address: "",
        religion: "ISLAM",
        notes: "",
        motherName: "",
        birthPlace: "",
        maritalStatus: "BELUM MENIKAH",
        occupation: "",
        education: "-",
        bloodType: "-",
        penanggungJawab: "",
        hubunganPenanggungJawab: "DIRI SENDIRI",
    });

    const [patientSearch, setPatientSearch] = useState({
        loading: false,
        found: false,
        patientData: null as any,
        error: "",
    });

    const searchPatient = async (mrNumber: string) => {
        if (!mrNumber || mrNumber.length < 3) return;
        setPatientSearch(prev => ({ ...prev, loading: true, error: "" }));
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";
            const response = await fetch(`${baseUrl}/appointments/search-patient/${mrNumber}`);
            const data = await response.json();

            if (data.found) {
                const p = data.patient;
                setPatientSearch({ loading: false, found: true, patientData: p, error: "" });
                setFormData(prev => ({
                    ...prev,
                    fullName: p.nm_pasien,
                    phone: p.no_tlp || prev.phone,
                    nik: p.no_ktp || prev.nik,
                    address: p.alamat || prev.address,
                    email: p.email || prev.email,
                    gender: p.jk || prev.gender,
                    birthDate: p.tgl_lahir ? new Date(p.tgl_lahir).toISOString().split('T')[0] : prev.birthDate,
                    penanggungJawab: p.nm_pasien, // Default to self
                }));
            } else {
                setPatientSearch({ loading: false, found: false, patientData: null, error: "Pasien tidak ditemukan" });
            }
        } catch (error) {
            setPatientSearch({ loading: false, found: false, patientData: null, error: "Gagal mencari data pasien" });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Placeholder for real API call
            // await new Promise(resolve => setTimeout(resolve, 2000));

            const payload = {
                items: items,
                date: format(formData.date!, "yyyy-MM-dd"),
                timeSlot: formData.timeSlot,
                patient: {
                    ...formData,
                    mrNumber: formData.patientType === 'old' ? formData.mrNumber : undefined
                }
            };

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";
            const response = await fetch(`${baseUrl}/diagnostic/booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Gagal membuat reservasi");

            const result = await response.json();
            setBookingResponse(result);

            toast.success("Checkout Berhasil!", {
                description: `Reservasi diagnostic Anda telah dijadwalkan.`,
            });

            clearBasket();
            setStep("success");
        } catch (error: any) {
            toast.error("Gagal Checkout", {
                description: error.message || "Silakan coba lagi atau hubungi via WhatsApp",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (open: boolean) => {
        if (!open && step === "success") {
            setStep("date");
        }
        setIsOpen(open);
    };

    const canProceed = () => {
        if (step === "date") return formData.date && formData.timeSlot;
        if (step === "patient") {
            if (formData.patientType === "old") return formData.mrNumber && patientSearch.found;
            return formData.nik.length === 16 && formData.fullName && formData.phone;
        }
        return true;
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button disabled={items.length === 0} className="w-full rounded-2xl h-14 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary-hover transition-all group">
                        Checkout Sekarang
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[95vh] p-0 rounded-[2.5rem] border-none shadow-2xl flex flex-col overflow-hidden">
                <div className="bg-primary p-8 text-white relative flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[5rem] -mr-10 -mt-10" />
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <HeartPulse className="h-7 w-7" />
                            Diagnostic Checkout
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/70 font-medium">
                            {items.length} Layanan Terpilih • Total Rp {getTotalPrice().toLocaleString('id-ID')}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mt-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -z-0" />
                        {["date", "patient", "confirm", "success"].map((s, i) => (
                            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${step === s ? "bg-white text-primary scale-125 shadow-lg" :
                                    (i < ["date", "patient", "confirm", "success"].indexOf(step) || step === "success") ? "bg-green-400 text-white" : "bg-primary/50 text-white/50 border border-white/20"
                                    }`}>
                                    {(i < ["date", "patient", "confirm", "success"].indexOf(step) || step === "success" && i < 3) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${step === s ? "text-white" : "text-white/40"}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 pb-4">
                        {step === "date" && <DiagnosticDateStep formData={formData} setFormData={setFormData} />}
                        {step === "patient" && (
                            <DiagnosticPatientStep
                                formData={formData}
                                setFormData={setFormData}
                                patientSearch={patientSearch}
                                setPatientSearch={setPatientSearch}
                                searchPatient={searchPatient}
                            />
                        )}
                        {step === "confirm" && <DiagnosticConfirmStep formData={formData} />}
                        {step === "success" && <DiagnosticSuccessStep formData={formData} bookingResponse={bookingResponse} />}
                    </div>
                </div>

                <div className="p-8 pt-0 flex gap-3 flex-shrink-0">
                    {step !== "date" && step !== "success" && (
                        <Button
                            variant="outline"
                            className="h-12 rounded-xl px-6 font-bold"
                            onClick={() => {
                                const steps: Step[] = ["date", "patient", "confirm"];
                                setStep(steps[steps.indexOf(step) - 1]);
                            }}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    )}

                    {step !== "confirm" && step !== "success" && (
                        <Button
                            className="flex-1 h-12 rounded-xl font-bold"
                            onClick={() => {
                                const steps: Step[] = ["date", "patient", "confirm"];
                                setStep(steps[steps.indexOf(step) + 1]);
                            }}
                            disabled={!canProceed()}
                        >
                            Lanjut
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}

                    {step === "confirm" && (
                        <Button
                            className="flex-1 h-12 rounded-xl font-bold bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Konfirmasi & Pesan Layanan
                                    <CheckCircle2 className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    )}

                    {step === "success" && (
                        <Button className="flex-1 h-12 rounded-xl font-bold" onClick={() => handleClose(false)}>
                            Tutup
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
