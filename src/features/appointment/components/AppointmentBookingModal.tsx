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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCreateAppointment } from "../api/createAppointment";

interface AppointmentModalProps {
    doctor: any;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export const AppointmentBookingModal = ({ doctor, trigger }: AppointmentModalProps) => {
    const [step, setStep] = useState(1);
    const [bookingCode, setBookingCode] = useState("");

    const createAppointmentMutation = useCreateAppointment();
    const loading = createAppointmentMutation.isPending;

    // Form State
    const [formData, setFormData] = useState({
        date: "",
        patientType: "new", // new | old
        mrNumber: "", // No RM if old
        nik: "",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        birthDate: "", // Required for new patients
        gender: "" as "L" | "P" | "", // L = Laki-laki, P = Perempuan
        paymentType: "umum", // umum | bpjs
        bpjsNumber: "",
        keluhan: "", // Complaint/reason for visit
        // NEW - Critical fields
        religion: "", // Required for new patients
        consentTerms: false,
        consentPrivacy: false,
        consentFee: false,
        // BPJS additional fields
        bpjsClass: "",
        bpjsFaskes: "",
        bpjsRujukan: "",
    });

    // Patient search state
    const [patientSearch, setPatientSearch] = useState<{
        loading: boolean;
        found: boolean;
        patientData: {
            no_rkm_medis: string;
            no_ktp: string;
            nm_pasien: string;
            jk: string;
            tgl_lahir: string;
            no_tlp: string;
            alamat: string;
            email: string;
        } | null;
        error: string;
    }>({
        loading: false,
        found: false,
        patientData: null,
        error: "",
    });

    // Search patient by RM number
    const searchPatient = async (mrNumber: string) => {
        if (!mrNumber || mrNumber.length < 3) {
            setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
            return;
        }

        console.log('🔍 [SEARCH] Starting patient search for RM:', mrNumber);
        setPatientSearch({ loading: true, found: false, patientData: null, error: "" });

        try {
            const url = `http://localhost:2000/api/appointments/search-patient/${mrNumber}`;
            console.log('🔍 [SEARCH] Fetching URL:', url);

            const response = await fetch(url);
            console.log('🔍 [SEARCH] Response status:', response.status);

            const data = await response.json();
            console.log('🔍 [SEARCH] Response data:', data);

            if (data.found) {
                console.log('✅ [SEARCH] Patient found:', data.patient.nm_pasien);
                setPatientSearch({
                    loading: false,
                    found: true,
                    patientData: data.patient,
                    error: "",
                });
            } else {
                console.warn('⚠️ [SEARCH] Patient not found:', data.message);
                setPatientSearch({
                    loading: false,
                    found: false,
                    patientData: null,
                    error: data.message || "Pasien tidak ditemukan",
                });
            }
        } catch (error) {
            console.error('❌ [SEARCH] Error occurred:', error);
            console.error('❌ [SEARCH] Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            setPatientSearch({
                loading: false,
                found: false,
                patientData: null,
                error: "Gagal mencari data pasien",
            });
        }
    };

    const handleNext = async () => {
        // Validation before moving to next step
        if (step === 1 && !formData.date) {
            toast.error("Pilih tanggal kunjungan terlebih dahulu");
            return;
        }
        if (step === 2) {
            if (formData.patientType === "old" && !formData.mrNumber) {
                toast.error("Nomor RM wajib diisi untuk pasien lama");
                return;
            }
            if (formData.patientType === "new") {
                if (!formData.nik || !formData.fullName || !formData.phone || !formData.birthDate || !formData.gender || !formData.religion) {
                    toast.error("Semua field wajib diisi untuk pasien baru");
                    return;
                }
                // Validate NIK (16 digits)
                if (formData.nik.length !== 16) {
                    toast.error("NIK harus 16 digit");
                    return;
                }
                // Validate phone number
                if (formData.phone.length < 10) {
                    toast.error("Nomor telepon tidak valid");
                    return;
                }
            }

            // Validate keluhan (required, min 10 characters)
            if (!formData.keluhan || formData.keluhan.trim().length < 10) {
                toast.error("Keluhan minimal 10 karakter");
                return;
            }

            // Search patient data when moving to step 3 (verification)
            if (formData.patientType === "old") {
                await searchPatient(formData.mrNumber);
            }
        }

        // Step 3: Validate consents
        if (step === 3) {
            if (!formData.consentTerms || !formData.consentPrivacy || !formData.consentFee) {
                toast.error("Anda harus menyetujui semua persetujuan");
                return;
            }

            // Validate BPJS if selected
            if (formData.paymentType === 'bpjs') {
                if (!formData.bpjsNumber || !formData.bpjsClass) {
                    toast.error("Data BPJS tidak lengkap (Nomor dan Kelas wajib diisi)");
                    return;
                }
            }
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        // Build payload based on patient type
        const payload: any = {
            doctorId: doctor.id,
            bookingDate: formData.date,
            patientType: formData.patientType,
            paymentType: formData.paymentType,
        };

        // Add fields based on patient type
        if (formData.patientType === 'old') {
            // Old patient - only need mrNumber
            payload.mrNumber = formData.mrNumber;
        } else {
            // New patient - need all registration fields
            payload.nik = formData.nik;
            payload.patientName = formData.fullName;
            payload.patientPhone = formData.phone;
            payload.birthDate = formData.birthDate;
            payload.gender = formData.gender;

            // Optional fields
            if (formData.email) payload.patientEmail = formData.email;
            if (formData.address) payload.patientAddress = formData.address;
        }

        // Add BPJS number if payment type is BPJS
        if (formData.paymentType === 'bpjs' && formData.bpjsNumber) {
            payload.bpjsNumber = formData.bpjsNumber;
        }

        // Add keluhan if provided
        if (formData.keluhan) {
            payload.keluhan = formData.keluhan;
        }

        createAppointmentMutation.mutate(payload, {
            onSuccess: (data: any) => {
                setBookingCode(data.bookingCode || "REG-XXXX");
                setStep(4);
                toast.success(data.message || "Janji temu berhasil dibuat!");
                if (data.isNewPatient) {
                    toast.success(`No. RM Anda: ${data.noRM}`, { duration: 5000 });
                }
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || error?.message || "Gagal membuat janji temu";
                toast.error(errorMessage);
                console.error(error);
            }
        });
    };

    const resetForm = () => {
        setStep(1);
        createAppointmentMutation.reset();
        setBookingCode("");
        setFormData({
            date: "",
            patientType: "new",
            mrNumber: "",
            nik: "",
            fullName: "",
            phone: "",
            email: "",
            address: "",
            birthDate: "",
            gender: "",
            paymentType: "umum",
            bpjsNumber: "",
            keluhan: "",
            religion: "",
            consentTerms: false,
            consentPrivacy: false,
            consentFee: false,
            bpjsClass: "",
            bpjsFaskes: "",
            bpjsRujukan: "",
        });
    }

    // Generate available dates based on doctor schedules
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        const daysMap: Record<number, string> = {
            0: "Minggu",
            1: "Senin",
            2: "Selasa",
            3: "Rabu",
            4: "Kamis",
            5: "Jumat",
            6: "Sabtu",
        };

        // Generate next 14 days
        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Check if doctor has schedule on this day
            const dayOfWeek = date.getDay();
            const hasSchedule = doctor.schedules?.some((s: any) => s.dayOfWeek === dayOfWeek);

            if (hasSchedule) {
                const schedule = doctor.schedules.find((s: any) => s.dayOfWeek === dayOfWeek);
                const dateStr = date.toISOString().split('T')[0];
                const dayName = daysMap[dayOfWeek];
                const dateDisplay = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                dates.push({
                    value: dateStr,
                    label: `${dayName}, ${dateDisplay} (${schedule?.startTime || '08:00'} - ${schedule?.endTime || '14:00'})`,
                });
            }
        }

        return dates;
    };

    const availableDates = getAvailableDates();

    return (
        <Dialog onOpenChange={(open) => !open && resetForm()}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {step === 4 ? (
                            <span className="text-green-600 flex items-center gap-2">
                                <CheckCircle2 className="h-6 w-6" /> Booking Berhasil
                            </span>
                        ) : (
                            "Buat Janji Temu"
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 4
                            ? "Pendaftaran Anda telah berhasil diproses ke SIMRS."
                            : `Langkah ${step} dari 3 - ${step === 1 ? "Pilih Jadwal" : step === 2 ? "Data Pasien" : "Konfirmasi"}`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {/* STEP 1: PILIH JADWAL */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                                    {/* Simple Avatar Placeholder */}
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold">DR</div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{doctor.name}</p>
                                    <p className="text-sm text-muted-foreground">{doctor.specialization || "Dokter"}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Pilih Tanggal Kunjungan</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, date: val })}>
                                    <SelectTrigger className="w-full h-12 rounded-xl">
                                        <SelectValue placeholder="Pilih Tanggal Tersedia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Mock Generated Dates based on doctor schedules */}
                                        <SelectItem value="2026-03-25">Senin, 25 Maret 2026 (09:00 - 14:00)</SelectItem>
                                        <SelectItem value="2026-03-27">Rabu, 27 Maret 2026 (09:00 - 14:00)</SelectItem>
                                        <SelectItem value="2026-03-29">Jumat, 29 Maret 2026 (09:00 - 14:00)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">*Jadwal disesuaikan dengan praktek dokter.</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DATA PASIEN */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label>Jenis Pasien</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setFormData({ ...formData, patientType: 'new' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${formData.patientType === 'new' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientType === 'new' ? 'border-primary' : 'border-slate-400'}`}>
                                            {formData.patientType === 'new' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                        <span className="font-medium">Pasien Baru</span>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, patientType: 'old' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${formData.patientType === 'old' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientType === 'old' ? 'border-primary' : 'border-slate-400'}`}>
                                            {formData.patientType === 'old' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                        <span className="font-medium">Pasien Lama</span>
                                    </div>
                                </div>
                            </div>

                            {formData.patientType === 'old' ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label>Nomor Rekam Medis (No. RM)</Label>
                                        <Input
                                            placeholder="Contoh: 123456"
                                            value={formData.mrNumber}
                                            onChange={(e) => {
                                                setFormData({ ...formData, mrNumber: e.target.value });
                                                // Reset search state
                                                setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
                                            }}
                                            className="h-12 rounded-xl"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Masukkan nomor rekam medis Anda, lalu klik "Lanjut" untuk verifikasi
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label>NIK <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="16 digit NIK"
                                            value={formData.nik}
                                            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                            className="rounded-xl"
                                            maxLength={16}
                                        />
                                        {formData.nik && formData.nik.length !== 16 && (
                                            <p className="text-xs text-red-500">NIK harus 16 digit</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="Sesuai KTP"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tanggal Lahir <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                                className="rounded-xl"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jenis Kelamin <span className="text-red-500">*</span></Label>
                                            <Select value={formData.gender} onValueChange={(val: any) => setFormData({ ...formData, gender: val })}>
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="L">Laki-laki</SelectItem>
                                                    <SelectItem value="P">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Agama <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.religion}
                                            onValueChange={(val) => setFormData({ ...formData, religion: val })}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Pilih agama" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ISLAM">Islam</SelectItem>
                                                <SelectItem value="KRISTEN">Kristen</SelectItem>
                                                <SelectItem value="KATOLIK">Katolik</SelectItem>
                                                <SelectItem value="HINDU">Hindu</SelectItem>
                                                <SelectItem value="BUDDHA">Buddha</SelectItem>
                                                <SelectItem value="KONGHUCU">Konghucu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>No. Telepon <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="08xxxxxxxxxx"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="rounded-xl"
                                            type="tel"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email (Opsional)</Label>
                                        <Input
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="rounded-xl"
                                            type="email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Alamat (Opsional)</Label>
                                        <Input
                                            placeholder="Alamat lengkap"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>

                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Label>Keluhan Utama <span className="text-red-500">*</span></Label>
                                <Textarea
                                    placeholder="Jelaskan keluhan Anda secara singkat (minimal 10 karakter)"
                                    value={formData.keluhan}
                                    onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                                    className="rounded-xl min-h-[100px]"
                                    required
                                />
                                {formData.keluhan && formData.keluhan.length < 10 && formData.keluhan.length > 0 && (
                                    <p className="text-xs text-red-500">
                                        Minimal 10 karakter ({formData.keluhan.length}/10)
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Label>Metode Pembayaran</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, paymentType: val })}>
                                    <SelectTrigger className="w-full h-12 rounded-xl">
                                        <SelectValue placeholder="Pilih Metode Bayar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="umum">Umum / Tunai / Asuransi Lain</SelectItem>
                                        <SelectItem value="bpjs">BPJS Kesehatan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.paymentType === 'bpjs' && (
                                <div className="space-y-4 p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <h4 className="font-semibold text-green-900 dark:text-green-100">Data BPJS</h4>

                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label>No. Kartu BPJS <span className="text-red-500">*</span></Label>
                                            <Input
                                                placeholder="0001234567890"
                                                value={formData.bpjsNumber}
                                                onChange={(e) => setFormData({ ...formData, bpjsNumber: e.target.value })}
                                                className="h-12 rounded-xl"
                                                maxLength={13}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Kelas Perawatan <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.bpjsClass}
                                                onValueChange={(val) => setFormData({ ...formData, bpjsClass: val })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl">
                                                    <SelectValue placeholder="Pilih kelas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Kelas 1</SelectItem>
                                                    <SelectItem value="2">Kelas 2</SelectItem>
                                                    <SelectItem value="3">Kelas 3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Faskes Tingkat 1</Label>
                                            <Input
                                                placeholder="Nama Puskesmas/Klinik"
                                                value={formData.bpjsFaskes}
                                                onChange={(e) => setFormData({ ...formData, bpjsFaskes: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>No. Rujukan (jika ada)</Label>
                                            <Input
                                                placeholder="Nomor surat rujukan"
                                                value={formData.bpjsRujukan}
                                                onChange={(e) => setFormData({ ...formData, bpjsRujukan: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: KONFIRMASI */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Verifikasi Detail Booking</h3>
                                <p className="text-muted-foreground">Pastikan jadwal dan data Anda sudah benar</p>
                            </div>

                            {/* Booking Details Summary */}
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center text-xs font-bold">
                                        DR
                                    </div>
                                    <div>
                                        <p className="font-bold">{doctor.name}</p>
                                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Jadwal Kunjungan</p>
                                        <p className="font-semibold">
                                            {formData.date ? new Date(formData.date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Jenis Pembayaran</p>
                                        <p className="font-semibold uppercase">{formData.paymentType}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground mb-1">Keluhan Utama</p>
                                        <p className="font-medium italic">"{formData.keluhan}"</p>
                                    </div>
                                </div>
                            </div>

                            {formData.patientType === "old" ? (
                                <>
                                    {/* Loading State */}
                                    {patientSearch.loading && (
                                        <div className="flex flex-col items-center gap-4 py-12">
                                            <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full" />
                                            <div className="text-center">
                                                <p className="font-medium text-lg">Mencari Data Pasien</p>
                                                <p className="text-sm text-muted-foreground">Mohon tunggu sebentar...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Success State - Patient Found */}
                                    {patientSearch.found && !patientSearch.loading && (
                                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full flex-shrink-0">
                                                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-green-900 dark:text-green-100 mb-1">
                                                            ✓ Pasien Ditemukan
                                                        </h4>
                                                        <p className="text-sm text-green-700 dark:text-green-300">
                                                            Data pasien berhasil diverifikasi dari sistem SIMRS
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-green-200 dark:border-green-700">
                                                        <div>
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">No. Rekam Medis</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">{patientSearch.patientData?.no_rkm_medis}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">NIK</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">{patientSearch.patientData?.no_ktp || '-'}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Nama Lengkap</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">{patientSearch.patientData?.nm_pasien}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Tanggal Lahir</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">{patientSearch.patientData?.tgl_lahir || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Jenis Kelamin</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">
                                                                {patientSearch.patientData?.jk === 'L' ? 'Laki-laki' : patientSearch.patientData?.jk === 'P' ? 'Perempuan' : '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">No. Telepon</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">{patientSearch.patientData?.no_tlp || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Email</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100 text-sm break-all">{patientSearch.patientData?.email || '-'}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Alamat</p>
                                                            <p className="font-semibold text-green-900 dark:text-green-100 text-sm">{patientSearch.patientData?.alamat || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error State - Patient Not Found */}
                                    {patientSearch.error && !patientSearch.loading && (
                                        <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full flex-shrink-0">
                                                    <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-red-900 dark:text-red-100 mb-1">
                                                            ✗ Pasien Tidak Ditemukan
                                                        </h4>
                                                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                                                            {patientSearch.error}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-red-100/50 dark:bg-red-800/30 rounded-xl">
                                                        <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                                                            Silakan lakukan salah satu dari berikut:
                                                        </p>
                                                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                                                            <li>Periksa kembali No. RM yang Anda masukkan</li>
                                                            <li>Klik "Kembali" untuk memperbaiki No. RM</li>
                                                            <li>Atau daftar sebagai Pasien Baru jika belum terdaftar</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* New Patient Verification */
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl shadow-sm">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full flex-shrink-0">
                                            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-1">
                                                Data Pendaftaran Pasien Baru
                                            </h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Pastikan data di bawah ini sudah benar
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">NIK</p>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100">{formData.nik}</p>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Nama Lengkap</p>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100">{formData.fullName}</p>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Tanggal Lahir</p>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100">{formData.birthDate}</p>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Jenis Kelamin</p>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100">
                                                {formData.gender === "L" ? "Laki-laki" : "Perempuan"}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">No. Telepon</p>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100">{formData.phone}</p>
                                        </div>
                                        {formData.email && (
                                            <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Email</p>
                                                <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm break-all">{formData.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Consent Section */}
                            <div className="space-y-4 p-4 border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mt-6">
                                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                                    Persetujuan <span className="text-red-500">*</span>
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="consent-terms"
                                            checked={formData.consentTerms}
                                            onChange={(e) => setFormData({ ...formData, consentTerms: e.target.checked })}
                                            className="mt-1 h-4 w-4 rounded border-gray-300"
                                        />
                                        <label htmlFor="consent-terms" className="text-sm text-yellow-900 dark:text-yellow-100">
                                            Saya menyetujui Syarat & Ketentuan yang berlaku
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="consent-privacy"
                                            checked={formData.consentPrivacy}
                                            onChange={(e) => setFormData({ ...formData, consentPrivacy: e.target.checked })}
                                            className="mt-1 h-4 w-4 rounded border-gray-300"
                                        />
                                        <label htmlFor="consent-privacy" className="text-sm text-yellow-900 dark:text-yellow-100">
                                            Saya menyetujui Kebijakan Privasi rumah sakit
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="consent-fee"
                                            checked={formData.consentFee}
                                            onChange={(e) => setFormData({ ...formData, consentFee: e.target.checked })}
                                            className="mt-1 h-4 w-4 rounded border-gray-300"
                                        />
                                        <label htmlFor="consent-fee" className="text-sm text-yellow-900 dark:text-yellow-100">
                                            Saya bersedia membayar biaya konsultasi sebesar{' '}
                                            <span className="font-bold">
                                                Rp {doctor.consultation_fee?.toLocaleString('id-ID') || '0'}
                                            </span>
                                            {formData.paymentType === 'bpjs' && ' (ditanggung BPJS)'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUKSES */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Pendaftaran Berhasil!</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto">
                                    Silakan datang 15 menit sebelum jadwal praktek dan tunjukkan kode booking ini di loket.
                                </p>
                            </div>

                            <div className="w-full bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Kode Booking</p>
                                <p className="text-3xl font-black font-mono tracking-wider">{bookingCode}</p>
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <Button className="w-full rounded-xl" onClick={() => window.print()}>
                                    Cetak Bukti Pendaftaran
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER ACTIONS */}
                {step < 4 && (
                    <DialogFooter className="flex flex-row justify-between gap-2 sm:justify-between">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack} disabled={loading} className="w-1/2 sm:w-auto">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        ) : (
                            <div /> // Spacer
                        )}

                        {step < 3 ? (
                            <Button onClick={handleNext} disabled={!formData.date} className="w-1/2 sm:w-auto">
                                Lanjut <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} className="w-1/2 sm:w-auto min-w-[140px]">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {loading ? "Memproses..." : "Konfirmasi Booking"}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};
