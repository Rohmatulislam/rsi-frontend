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
  doctor: any;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const AppointmentBookingModal = ({ doctor, trigger, onOpenChange }: AppointmentModalProps) => {
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
  } = useAppointmentForm(doctor, user?.id);

  const handleNext = async () => {
    // Validation before moving to next step
    if (step === 1 && !formData.poliId) {
      toast.error("Pilih poliklinik terlebih dahulu");
      return;
    }

    if (step === 2 && (!formData.date || !formData.time)) {
      if (!formData.date) {
        toast.error("Pilih tanggal kunjungan terlebih dahulu");
      } else if (!formData.time) {
        toast.error("Pilih waktu kunjungan terlebih dahulu");
      }
      return;
    }

    // Step 1 (pilih poliklinik) to Step 2 (pilih jadwal)
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2 (pilih jadwal) to Step 3 (data pasien)
    if (step === 2) {
      setStep(3);
      return;
    }

    // Step 3 (data pasien) to Step 4 (konfirmasi)
    if (step === 3) {
      if (formData.patientType === "old") {
        if (!formData.mrNumber) {
          toast.error("Nomor RM wajib diisi untuk pasien lama");
          return;
        }
        // Search patient data saat lanjut ke step 4 dari step 3
        // Ini akan mengisi patientSearch.patientData yang dibutuhkan untuk auto-fill No. BPJS
        await searchPatient(formData.mrNumber);
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

      // Validate payment method selection
      if (!formData.paymentType) {
        toast.error("Pilih metode pembayaran terlebih dahulu");
        return;
      }

      // Search patient data when moving to step 4 (verification)
      if (formData.patientType === "old") {
        await searchPatient(formData.mrNumber);
      }
    }

    // Step 4: Validate consents
    if (step === 4) {
      if (!formData.consentTerms || !formData.consentPrivacy || !formData.consentFee) {
        toast.error("Anda harus menyetujui semua persetujuan");
        return;
      }

      // Validate BPJS if selected (check if paymentName contains BPJS-related keywords)
      const isBpjsPayment = formData.paymentName?.toLowerCase().includes('bpjs') ||
        formData.paymentName?.toLowerCase().includes('jkn') ||
        formData.paymentName?.toLowerCase().includes('kis');
      if (isBpjsPayment) {
        // Cek apakah bpjsNumber sudah diisi (bisa dari input manual atau dari patientData.no_peserta)
        const bpjsNumber = formData.bpjsNumber || patientSearch.patientData?.no_peserta;
        if (!bpjsNumber) {
          toast.error("Nomor BPJS wajib diisi");
          return;
        }
      }
    }
    setStep(step + 1);
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
          <PoliSelectionStep
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
            doctor={doctor}
          />
        );
      case 2:
        return (
          <AppointmentScheduleStep
            formData={formData}
            setFormData={setFormData}
            getAvailableDates={getAvailableDates}
            getAvailableTimesForDate={getAvailableTimesForDate}
            doctor={doctor}
          />
        );
      case 3:
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
      case 4:
        return (
          <ConfirmationStep
            formData={formData}
            setFormData={setFormData}
            patientSearch={patientSearch}
            doctor={doctor}
          />
        );
      case 5:
        return <SuccessStep
          bookingCode={bookingCode}
          appointmentDate={formData.date}
          appointmentTime={formData.time}
          doctorName={doctor.name}
          poliName={formData.poliName}
          patientName={patientSearch.patientData?.nm_pasien || formData.fullName}
          noRM={patientSearch.patientData?.no_rkm_medis || formData.mrNumber}
          onClose={() => {
            // Use setTimeout to prevent update during render
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
              {step === 5 ? (
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" /> Booking Berhasil
                </span>
              ) : (
                "Buat Janji Temu"
              )}
            </DialogTitle>
            <DialogDescription>
              {step === 5
                ? "Pendaftaran Anda telah berhasil diproses ke SIMRS."
                : `Langkah ${step} dari 5 - ${step === 1 ? "Pilih Poliklinik" : step === 2 ? "Pilih Jadwal" : step === 3 ? "Data Pasien" : step === 4 ? "Konfirmasi Booking" : "Selesai"}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {renderStepContent()}
          </div>

          {/* FOOTER ACTIONS */}
          {step < 5 && (
            <DialogFooter className="flex flex-row justify-between gap-2 sm:justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack} disabled={loading} className="w-1/2 sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
              ) : (
                <div /> // Spacer
              )}

              {step < 4 ? (
                <Button onClick={handleNext} disabled={
                  step === 1 ? !formData.poliId :
                    step === 2 ? !formData.date || !formData.time :
                      false
                } className="w-1/2 sm:w-auto">
                  Lanjut <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={loading}
                  className="w-1/2 sm:w-auto min-w-[140px]"
                >
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
            <AlertDialogDescription className="space-y-2">
              <p>Apakah Anda yakin data yang Anda masukkan sudah benar?</p>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Detail Booking:</p>
                <p><span className="text-muted-foreground">Dokter:</span> {doctor.name}</p>
                <p><span className="text-muted-foreground">Poliklinik:</span> {formData.poliName}</p>
                <p><span className="text-muted-foreground">Tanggal:</span> {formData.date ? new Date(formData.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}</p>
                <p><span className="text-muted-foreground">Waktu:</span> {formData.time}</p>
              </div>
              <p className="mt-4 text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠️ Data booking akan langsung diproses ke sistem SIMRS dan tidak dapat diubah.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Consent Checkboxes */}
          <div className="space-y-3 p-4 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm">
              Persetujuan <span className="text-red-500">*</span>
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="alert-consent-terms"
                  checked={formData.consentTerms}
                  onChange={(e) => setFormData({ ...formData, consentTerms: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="alert-consent-terms" className="text-sm text-yellow-900 dark:text-yellow-100">
                  Saya menyetujui Syarat & Ketentuan yang berlaku
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="alert-consent-privacy"
                  checked={formData.consentPrivacy}
                  onChange={(e) => setFormData({ ...formData, consentPrivacy: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="alert-consent-privacy" className="text-sm text-yellow-900 dark:text-yellow-100">
                  Saya menyetujui Kebijakan Privasi rumah sakit
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="alert-consent-fee"
                  checked={formData.consentFee}
                  onChange={(e) => setFormData({ ...formData, consentFee: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="alert-consent-fee" className="text-sm text-yellow-900 dark:text-yellow-100">
                  Saya bersedia membayar biaya konsultasi sebesar{' '}
                  <span className="font-bold">
                    Rp {doctor.consultation_fee?.toLocaleString('id-ID') || '0'}
                  </span>
                  {formData.paymentName?.toLowerCase().includes('bpjs') && ' (ditanggung BPJS)'}
                </label>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Periksa Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!formData.consentTerms || !formData.consentPrivacy || !formData.consentFee) {
                  toast.error("Mohon centang semua persetujuan terlebih dahulu");
                  return;
                }
                console.log('Sebelum submit - formData:', formData);
                setShowConfirm(false);
                handleSubmit();
              }}
              disabled={loading || !formData.consentTerms || !formData.consentPrivacy || !formData.consentFee}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Lanjutkan Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};