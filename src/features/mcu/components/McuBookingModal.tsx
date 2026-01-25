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
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { McuPackage, McuBookingFormData, MCU_TIME_SLOTS } from "../services/mcuService";
import { McuDateStep, McuPatientStep, McuConfirmStep, McuSuccessStep } from "./booking";
import { PatientSearchState, PatientData } from "~/features/appointment/services/appointmentService";
import { useCreateMcuBooking } from "../api";



interface McuBookingModalProps {
    package: McuPackage;
    trigger?: React.ReactNode;
    selectedExams?: string[];
}

type Step = "exams" | "date" | "patient" | "confirm" | "success";

export const McuBookingModal = ({ package: pkg, trigger, selectedExams }: McuBookingModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>("date");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<McuBookingFormData>({
        date: undefined,
        timeSlot: "",
        patientType: "old",
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

    const [patientSearch, setPatientSearch] = useState<PatientSearchState>({
        loading: false,
        found: false,
        patientData: null,
        error: "",
    });

    const createBookingMutation = useCreateMcuBooking();


    const resetForm = () => {
        setStep("exams");
        setFormData({
            date: undefined,
            timeSlot: "",
            patientType: "old",
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
        setPatientSearch({
            loading: false,
            found: false,
            patientData: null,
            error: "",
        });
    };


    const handleClose = (open: boolean) => {
        if (!open) {
            resetForm();
        }
        setIsOpen(open);
    };

    const canProceedFromDate = formData.date && formData.timeSlot;
    const canProceedFromPatient =
        formData.patientType === "old"
            ? (formData.mrNumber && patientSearch.found)
            : (formData.nik.length === 16 && formData.fullName && formData.phone && formData.birthDate && formData.gender && formData.religion);

    const searchPatient = async (mrNumber: string) => {
        if (!mrNumber || mrNumber.length < 3) {
            setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
            return;
        }

        setPatientSearch({ loading: true, found: false, patientData: null, error: "" });

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";
            const response = await fetch(`${baseUrl}/appointments/search-patient/${mrNumber}`);
            const data = await response.json();

            if (data.found) {
                const p = data.patient as PatientData;
                setPatientSearch({
                    loading: false,
                    found: true,
                    patientData: p,
                    error: "",
                });

                // Sync found data to formData
                setFormData(prev => ({
                    ...prev,
                    fullName: p.nm_pasien,
                    phone: p.no_tlp || prev.phone,
                    nik: p.no_ktp || prev.nik,
                    address: p.alamat || prev.address,
                    email: p.email || prev.email,
                    gender: (p.jk === 'L' || p.jk === 'P') ? p.jk : prev.gender,
                    birthDate: p.tgl_lahir ? new Date(p.tgl_lahir).toISOString().split('T')[0] : prev.birthDate,
                    motherName: p.nm_ibu || prev.motherName,
                    birthPlace: p.tmp_lahir || prev.birthPlace,
                    bloodType: p.gol_darah || prev.bloodType,
                    occupation: p.pekerjaan || prev.occupation,
                    education: p.pnd || prev.education,
                }));
            } else {
                setPatientSearch({
                    loading: false,
                    found: false,
                    patientData: null,
                    error: data.message || "Pasien tidak ditemukan",
                });
            }
        } catch (error) {
            setPatientSearch({
                loading: false,
                found: false,
                patientData: null,
                error: "Gagal mencari data pasien",
            });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                packageId: pkg.id,
                packageName: pkg.name,
                date: format(formData.date!, "yyyy-MM-dd"),
                timeSlot: formData.timeSlot,
                patientType: formData.patientType,
                mrNumber: formData.patientType === "old" ? formData.mrNumber : undefined,
                nik: formData.nik,
                patientName: formData.fullName,
                patientPhone: formData.phone,
                patientEmail: formData.email || undefined,
                birthDate: formData.birthDate || undefined,
                gender: (formData.gender as "L" | "P") || undefined,
                patientAddress: formData.address || undefined,
                religion: formData.religion || undefined,
                notes: formData.notes || undefined,
                motherName: formData.motherName || undefined,
                birthPlace: formData.birthPlace || undefined,
                maritalStatus: formData.maritalStatus || undefined,
                occupation: formData.occupation || undefined,
                education: formData.education || undefined,
                bloodType: formData.bloodType || undefined,
                penanggungJawab: formData.penanggungJawab || undefined,
                hubunganPenanggungJawab: formData.hubunganPenanggungJawab || undefined,
            };

            await createBookingMutation.mutateAsync(payload);

            toast.success("Reservasi MCU berhasil!", {
                description: `Paket: ${pkg.name} pada ${format(formData.date!, "dd MMMM yyyy", { locale: localeId })}`,
            });
            setStep("success");
        } catch (error: any) {
            toast.error("Gagal membuat reservasi", {
                description: error?.response?.data?.message || "Silakan coba lagi atau hubungi kami via WhatsApp",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                {trigger || <Button>Booking MCU</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Reservasi {pkg.name}
                    </DialogTitle>
                    <DialogDescription>
                        Harga: <span className="font-bold text-primary">Rp {pkg.price?.toLocaleString('id-ID')}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 py-4">
                    {["exams", "date", "patient", "confirm"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s || (step === "success" && s === "confirm")
                                    ? "bg-primary text-white"
                                    : i < ["exams", "date", "patient", "confirm"].indexOf(step)
                                        ? "bg-green-500 text-white"
                                        : "bg-slate-200 text-slate-500"
                                    }`}
                            >
                                {i < ["exams", "date", "patient", "confirm"].indexOf(step) ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 3 && <div className="w-8 h-0.5 bg-slate-200" />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {step === "exams" && (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <h4 className="font-bold text-sm">Daftar Pemeriksaan</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10">
                            {(selectedExams || (pkg.features ? pkg.features.split(',') : [])).map((item: string, idx: number) => {
                                const name = item.split('|')[0].trim();
                                return (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/40">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-sm font-medium">{name}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary/80 leading-relaxed font-medium">
                            Catatan: Daftar di atas adalah item pemeriksaan utama yang termasuk dalam paket ini. Konsultasikan dengan petugas kami jika Anda memerlukan tambahan item pemeriksaan.
                        </div>
                    </div>
                )}
                {step === "date" && (
                    <McuDateStep formData={formData} setFormData={setFormData} />
                )}
                {step === "patient" && (
                    <McuPatientStep
                        formData={formData}
                        setFormData={setFormData}
                        patientSearch={patientSearch}
                        setPatientSearch={setPatientSearch}
                        searchPatient={searchPatient}
                    />
                )}

                {step === "confirm" && (
                    <McuConfirmStep formData={formData} packageInfo={pkg} />
                )}
                {step === "success" && (
                    <McuSuccessStep formData={formData} packageInfo={pkg} />
                )}

                {/* Footer Navigation */}
                <DialogFooter className="flex-row gap-2 sm:gap-2">
                    {step !== "exams" && step !== "success" && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                const steps: Step[] = ["exams", "date", "patient", "confirm"];
                                const currentIdx = steps.indexOf(step);
                                if (currentIdx > 0) setStep(steps[currentIdx - 1]);
                            }}
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali
                        </Button>
                    )}

                    {step === "exams" && (
                        <Button
                            className="flex-1"
                            onClick={() => setStep("date")}
                        >
                            Lanjut Pilih Tanggal
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}

                    {step === "date" && (
                        <Button
                            className="flex-1"
                            onClick={() => setStep("patient")}
                            disabled={!canProceedFromDate}
                        >
                            Lanjut
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}

                    {step === "patient" && (
                        <Button
                            className="flex-1"
                            onClick={() => setStep("confirm")}
                            disabled={!canProceedFromPatient}
                        >
                            Lanjut
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}

                    {step === "confirm" && (
                        <Button
                            className="flex-1"
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
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Konfirmasi Reservasi
                                </>
                            )}
                        </Button>
                    )}

                    {step === "success" && (
                        <Button className="flex-1" onClick={() => handleClose(false)}>
                            Selesai
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
