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
      paymentType: "umum", // umum | bpjs
      bpjsNumber: "",
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
      createAppointmentMutation.mutate({
          doctorId: doctor.id, // using doctor.id not code for now, mapping handled in backend
          bookingDate: formData.date,
          patientType: formData.patientType as any,
          mrNumber: formData.mrNumber,
          nik: formData.nik,
          fullName: formData.fullName,
          phone: formData.phone,
          paymentType: formData.paymentType as any,
          bpjsNumber: formData.bpjsNumber,
      }, {
          onSuccess: (data: any) => {
               setBookingCode(data.bookingCode || "REG-XXXX");
               setStep(4);
               toast.success("Janji temu berhasil dibuat!");
          },
          onError: (error) => {
              toast.error("Gagal membuat janji temu. Silakan coba lagi.");
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
        paymentType: "umum",
        bpjsNumber: "",
    });
  }

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
                        <Select onValueChange={(val) => setFormData({...formData, date: val})}>
                            <SelectTrigger className="w-full h-12 rounded-xl">
                                <SelectValue placeholder="Pilih Tanggal Tersedia" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Mock Generated Dates based on doctor schedules */}
                                <SelectItem value="2024-03-25">Senin, 25 Maret 2024 (09:00 - 14:00)</SelectItem>
                                <SelectItem value="2024-03-27">Rabu, 27 Maret 2024 (09:00 - 14:00)</SelectItem>
                                <SelectItem value="2024-03-29">Jumat, 29 Maret 2024 (09:00 - 14:00)</SelectItem>
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
                                onClick={() => setFormData({...formData, patientType: 'new'})}
                                className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${formData.patientType === 'new' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientType === 'new' ? 'border-primary' : 'border-slate-400'}`}>
                                    {formData.patientType === 'new' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </div>
                                <span className="font-medium">Pasien Baru</span>
                            </div>
                            <div 
                                onClick={() => setFormData({...formData, patientType: 'old'})}
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
                         <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Nomor Rekam Medis (No. RM)</Label>
                            <Input 
                                placeholder="Contoh: 123456" 
                                value={formData.mrNumber} 
                                onChange={(e) => setFormData({...formData, mrNumber: e.target.value})}
                                className="h-12 rounded-xl"
                            />
                         </div>
                     ) : (
                         <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                             <div className="space-y-2">
                                <Label>NIK</Label>
                                <Input 
                                    placeholder="Nomor Induk Kependudukan" 
                                    value={formData.nik}
                                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                                    className="rounded-xl"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input 
                                    placeholder="Sesuai KTP" 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="rounded-xl"
                                />
                             </div>
                         </div>
                     )}

                     <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Label>Metode Pembayaran</Label>
                        <Select onValueChange={(val) => setFormData({...formData, paymentType: val})}>
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
                         <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Nomor Kartu BPJS</Label>
                            <Input 
                                placeholder="000123456789" 
                                value={formData.bpjsNumber}
                                onChange={(e) => setFormData({...formData, bpjsNumber: e.target.value})}
                                className="h-12 rounded-xl"
                            />
                         </div>
                     )}
                </div>
            )}

            {/* STEP 3: KONFIRMASI */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                        Mohon periksa kembali data pendaftaran Anda sebelum melanjutkan.
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-muted-foreground">Dokter Tujuan</span>
                            <span className="font-semibold">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-muted-foreground">Tanggal</span>
                            <span className="font-semibold">{formData.date}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-muted-foreground">Pasien</span>
                            <span className="font-semibold">
                                {formData.patientType === 'new' ? formData.fullName : `Pasien Lama (RM: ${formData.mrNumber})`}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-muted-foreground">Penjamin</span>
                            <span className="font-semibold uppercase">{formData.paymentType}</span>
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
                            Silakan datang 15 jam sebelum jadwal praktek dan tunjukkan kode booking ini di loket.
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
