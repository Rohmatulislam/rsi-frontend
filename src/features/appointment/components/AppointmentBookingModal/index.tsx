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
        if (!formData.bpjsNumber || !formData.bpjsClass) {
          toast.error("Data BPJS tidak lengkap (Nomor dan Kelas wajib diisi)");
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
              {step === 4 ? (
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
                <Button onClick={() => {
                  console.log('Sebelum submit - formData:', formData);
                  handleSubmit();
                }} disabled={loading || !formData.consentTerms || !formData.consentPrivacy || !formData.consentFee} className="w-1/2 sm:w-auto min-w-[140px]">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {loading ? "Memproses Booking..." : "Konfirmasi Booking"}
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};