import { useEffect, useState } from 'react';
import { Button } from "~/components/ui/button";
import { CheckCircle2, X, Clock, Calendar, Clock4, MapPin, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
// SuccessStep tidak memerlukan tipe dari appointment.ts karena tidak menggunakan prop yang kompleks

interface SuccessStepProps {
  bookingCode: string;
  appointmentDate?: string; // Format: YYYY-MM-DD
  appointmentTime?: string; // Format: HH:MM
  doctorName?: string;
  poliName?: string;
  onClose?: () => void; // Optional callback to close modal
}

export const SuccessStep = ({ bookingCode, appointmentDate, appointmentTime, doctorName, poliName, onClose }: SuccessStepProps) => {
  const [countdown, setCountdown] = useState(10); // Countdown from 10 seconds
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!onClose) return; // Only run if onClose is provided

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsClosing(true); // Set flag to prevent further updates
          // Use setTimeout to prevent state update during render
          setTimeout(() => onClose?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [onClose]);

  if (isClosing) {
    return null; // Don't render anything when closing
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Booking Berhasil!</h3>
        <p className="text-muted-foreground mt-2">
          Pendaftaran janji temu Anda telah berhasil diproses
        </p>
      </div>

      {/* Booking Code Section */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Kode Booking</p>
        <p className="text-3xl font-black font-mono tracking-wider">{bookingCode}</p>
      </div>

      {/* Booking Details Preview */}
      <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 gap-3 text-sm">
          {doctorName && (
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Dokter</p>
                <p className="font-medium">{doctorName}</p>
              </div>
            </div>
          )}

          {poliName && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Poliklinik</p>
                <p className="font-medium">{poliName}</p>
              </div>
            </div>
          )}

          {appointmentDate && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Tanggal Kunjungan</p>
                <p className="font-medium">
                  {new Date(appointmentDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {appointmentTime && (
            <div className="flex items-center gap-3">
              <Clock4 className="h-5 w-5 text-blue-500" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Waktu Kunjungan</p>
                <p className="font-medium">
                  {appointmentTime} WIB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
        <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Petunjuk Kedatangan:</p>
        <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-left">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Datang <span className="font-semibold">15 menit sebelum</span> jadwal praktek</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Bawa <span className="font-semibold">KTP dan kartu BPJS</span> (jika ada)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Tunjukkan <span className="font-semibold">kode booking</span> di loket pendaftaran</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Berikan <span className="font-semibold">keluhan utama</span> Anda saat mendaftar</span>
          </li>
        </ul>
      </div>

      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Modal akan otomatis menutup dalam {countdown} detik
      </div>

      <div className="flex flex-col w-full gap-2">
        <Button
          className="w-full rounded-xl"
          onClick={() => {
            window.print();
            // Prevent auto-close when printing
            setCountdown(9999);
          }}
        >
          Cetak Bukti Booking
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-xl"
          asChild
          onClick={() => {
            setCountdown(0);
            setIsClosing(true);
          }}
        >
          <Link href="/riwayat-booking">
            <ClipboardList className="h-4 w-4 mr-2" />
            Lihat Riwayat Booking
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full rounded-xl"
          onClick={() => {
            setCountdown(0); // Stop countdown
            setIsClosing(true); // Set flag to prevent further updates
            // Use setTimeout to prevent state update during render
            setTimeout(() => onClose?.(), 0);
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Tutup & Lanjutkan
        </Button>
      </div>
    </div>
  );
};