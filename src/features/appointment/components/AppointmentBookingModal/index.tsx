"use client";

import { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppointmentForm } from "../../hooks/useAppointmentForm";
import { AppointmentScheduleStep } from "./AppointmentScheduleStep";
import { PatientDataStep } from "./PatientDataStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { SuccessStep } from "./SuccessStep";
import { PoliSelectionStep } from "./PoliSelectionStep";
import { useAuth } from "~/features/auth/hook/useAuth";
import { LoginPromptModal } from "~/features/auth/components/LoginPromptModal";

interface AppointmentModalProps {
  doctor?: any; // Now optional
  serviceItem?: { id: string; name: string }; // Optional pre-selected package
  initialPoliId?: string; // Optional pre-selected poli
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const AppointmentBookingModal = ({
  doctor,
  serviceItem,
  initialPoliId,
  trigger,
  onOpenChange
}: AppointmentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [shouldResetAfterClose, setShouldResetAfterClose] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { isAuthenticated, isLoading: authLoading, user } = useAuth();


  const {
    step,
    setStep,
    bookingCode,
    setBookingCode,
    formData,
    setFormData,
    patientSearch,
    setPatientSearch,
    searchPatient,
    getAvailableDates,
    getAvailableTimesForDate,
    resetForm,
    handleSubmit,
    loading
  } = useAppointmentForm(doctor, user, serviceItem, initialPoliId);

  const handleNext = async () => {
    // Validation before moving to next step
    if (step === 1) {
      if (!formData.poliId) {
        toast.error("Pilih poliklinik terlebih dahulu");
        return;
      }
      if (!formData.date || !formData.time) {
        if (!formData.date) {
          toast.error("Pilih tanggal kunjungan terlebih dahulu");
        } else if (!formData.time) {
          toast.error("Pilih waktu kunjungan terlebih dahulu");
        }
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 (data pasien & konfirmasi) to Step 3 (post/submit)
    if (step === 2) {
      if (formData.patientType === "old") {
        if (!formData.mrNumber) {
          toast.error("Nomor RM wajib diisi untuk pasien lama");
          return;
        }
        await searchPatient(formData.mrNumber);
      } else {
        if (!formData.nik || !formData.fullName || !formData.phone || !formData.birthDate || !formData.gender || !formData.religion) {
          toast.error("Semua field wajib diisi untuk pasien baru");
          return;
        }
        if (formData.nik.length !== 16) {
          toast.error("NIK harus 16 digit");
          return;
        }
        if (formData.phone.length < 10) {
          toast.error("Nomor telepon tidak valid");
          return;
        }
      }

      if (!formData.keluhan || formData.keluhan.trim().length < 10) {
        toast.error("Keluhan minimal 10 karakter");
        return;
      }

      if (!formData.paymentType) {
        toast.error("Pilih metode pembayaran terlebih dahulu");
        return;
      }

      const isBpjsPayment = formData.paymentName?.toLowerCase().includes('bpjs') ||
        formData.paymentName?.toLowerCase().includes('jkn') ||
        formData.paymentName?.toLowerCase().includes('kis');
      if (isBpjsPayment) {
        const bpjsNumber = formData.bpjsNumber || patientSearch.patientData?.no_peserta;
        if (!bpjsNumber) {
          toast.error("Nomor BPJS wajib diisi");
          return;
        }
      }

      if (!formData.consentTerms || !formData.consentPrivacy || !formData.consentFee) {
        toast.error("Anda harus menyetujui semua persetujuan");
        return;
      }

      // Show final confirm before submit
      setShowConfirm(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <AppointmentScheduleStep
            formData={formData}
            setFormData={setFormData}
            getAvailableDates={getAvailableDates}
            getAvailableTimesForDate={getAvailableTimesForDate}
            doctor={doctor}
          />
        );
      case 2:
        return (
          <PatientDataStep
            formData={formData}
            setFormData={setFormData}
            patientSearch={patientSearch}
            setPatientSearch={setPatientSearch}
            searchPatient={searchPatient}
            doctor={doctor}
          />
        );
      case 3:
        return <SuccessStep
          bookingCode={bookingCode}
          appointmentDate={formData.date}
          appointmentTime={formData.time}
          doctorName={doctor?.name || 'Dokter Umum'}
          poliName={formData.poliName}
          patientName={patientSearch.patientData?.nm_pasien || formData.fullName}
          noRM={patientSearch.patientData?.no_rkm_medis || formData.mrNumber}
          serviceItemName={formData.serviceItemName}
          onClose={() => {
            setTimeout(() => {
              setShouldResetAfterClose(true);
              setIsOpen(false);
            }, 0);
          }}
        />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Reset form when modal is closed and reset flag is set
    if (!isOpen && shouldResetAfterClose) {
      resetForm(doctor);
      setShouldResetAfterClose(false); // Reset the flag
    }
  }, [isOpen, shouldResetAfterClose, doctor, resetForm]);

  // Handler untuk trigger click - cek auth dulu
  const handleTriggerClick = () => {
    if (authLoading) return; // Tunggu auth selesai loading

    if (!isAuthenticated) {
      // Belum login, tampilkan prompt login
      setShowLoginPrompt(true);
    } else {
      // Sudah login, buka booking modal
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        title="Login untuk Booking"
        description={`Silakan login terlebih dahulu untuk membuat janji temu dengan ${doctor?.name || 'dokter'}.`}
      />

      {/* Booking Modal */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          // Only set reset flag if modal is being closed (not opened)
          if (!open) {
            setShouldResetAfterClose(true);
          }
          onOpenChange?.(open);
        }}
      >
        {/* Custom trigger that checks auth first */}
        <div onClick={handleTriggerClick} className="cursor-pointer">
          {trigger}
        </div>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {step === 3 ? (
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" /> Booking Berhasil
                </span>
              ) : (
                "Buat Janji Temu"
              )}
            </DialogTitle>
            <DialogDescription>
              {step === 3
                ? "Pendaftaran Anda telah berhasil diproses ke SIMRS."
                : `Langkah ${step} dari 2 - ${step === 1 ? "Pilih Jadwal" : "Data Pasien & Konfirmasi"}`
              }
            </DialogDescription>
            {step < 3 && (
              <div className="flex items-center gap-2 mt-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary' : 'bg-muted'
                      }`}
                  />
                ))}
              </div>
            )}
          </DialogHeader>

          <div className="py-6">
            {renderStepContent()}
          </div>

          {/* FOOTER ACTIONS */}
          {step < 3 && (
            <DialogFooter className="flex flex-row justify-between gap-2 sm:justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack} disabled={loading} className="w-1/2 sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
              ) : (
                <div /> // Spacer
              )}

              {step === 1 ? (
                <Button onClick={handleNext} disabled={!formData.poliId || !formData.date || !formData.time} className="w-1/2 sm:w-auto">
                  Lanjut <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="w-1/2 sm:w-auto min-w-[140px]"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Konfirmasi Booking
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Booking</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Apakah Anda yakin data yang Anda masukkan sudah benar?</p>
                <div className="mt-4 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ringkasan Janji Temu</p>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    {/* Sesi & Dokter */}
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Dokter</p>
                        <p className="font-semibold">{doctor?.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Unit / Poli</p>
                        <p className="font-semibold">{formData.poliName}</p>
                      </div>
                    </div>

                    {/* Waktu & Jadwal */}
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Jadwal</p>
                        <p className="font-semibold">
                          {formData.date ? new Date(formData.date).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Waktu Kedatangan</p>
                        <p className="font-semibold">{formData.time} WIB</p>
                      </div>
                    </div>

                    {/* Pasien & Kontak */}
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Pasien</p>
                        <p className="font-semibold truncate">
                          {formData.patientType === 'old'
                            ? (patientSearch.patientData?.nm_pasien || formData.mrNumber)
                            : formData.fullName}
                        </p>
                        <p className="text-[10px] text-primary font-medium">{formData.patientType === 'old' ? 'Pasien Lama' : 'Pasien Baru'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Kontak</p>
                        <p className="font-semibold">{formData.phone || '-'}</p>
                      </div>
                    </div>

                    {/* Pembayaran & Keluhan */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Metode Pembayaran</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formData.paymentName || 'Belum dipilih'}</p>
                      </div>
                      {formData.keluhan && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Keluhan / Catatan</p>
                          <p className="text-xs italic text-slate-600 dark:text-slate-400 line-clamp-2">"{formData.keluhan}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-yellow-600 dark:text-yellow-400 font-medium leading-relaxed bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  ⚠️ Data booking akan langsung diproses ke sistem SIMRS dan tidak dapat diubah kembali. Pastikan semua data di atas sudah benar.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Periksa Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirm(false);
                handleSubmit();
              }}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Buat Janji Temu Sekarang"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};