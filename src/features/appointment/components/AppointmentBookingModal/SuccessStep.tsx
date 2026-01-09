"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from "~/components/ui/button";
import { CheckCircle2, X, Clock, Calendar, Clock4, MapPin, ClipboardList, Download, Printer, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

interface SuccessStepProps {
  bookingCode: string;
  appointmentDate?: string; // Format: YYYY-MM-DD
  appointmentTime?: string; // Format: HH:MM
  doctorName?: string;
  poliName?: string;
  patientName?: string;
  noRM?: string;
  serviceItemName?: string;
  onClose?: () => void; // Optional callback to close modal
}

export const SuccessStep = ({
  bookingCode,
  appointmentDate,
  appointmentTime,
  doctorName,
  poliName,
  patientName,
  noRM,
  serviceItemName,
  onClose
}: SuccessStepProps) => {
  const [countdown, setCountdown] = useState(30); // Countdown from 30 seconds
  const [isClosing, setIsClosing] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Generate QR data with all booking info
  const qrData = JSON.stringify({
    code: bookingCode,
    date: appointmentDate,
    time: appointmentTime,
    doctor: doctorName,
    poli: poliName,
    patient: patientName,
    rm: noRM,
    service: serviceItemName,
    hospital: "RSI Hospital"
  });

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

  const handleDownloadQR = () => {
    const svg = document.getElementById('booking-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `bukti-booking-${bookingCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShareWhatsApp = () => {
    const message = `*Konfirmasi Booking RSI Siti Hajar*\n\n` +
      `Halo, ini detail booking Rumah Sakit saya:\n\n` +
      `*Kode Booking:* ${bookingCode}\n` +
      `*Pasien:* ${patientName}\n` +
      `*RM:* ${noRM || '-'}\n` +
      `*Dokter:* ${doctorName}\n` +
      `*Poliklinik:* ${poliName}\n` +
      `*Jadwal:* ${appointmentDate ? new Date(appointmentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} | ${appointmentTime} WIB\n\n` +
      `_Tunjukkan pesan ini atau QR Code di loket pendaftaran. Terimakasih._`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  if (isClosing) {
    return null; // Don't render anything when closing
  }

  return (
    <div className="flex flex-col items-center text-center space-y-5 py-4" ref={printRef}>
      {/* Success Header */}
      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Booking Berhasil!</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Pendaftaran janji temu Anda telah berhasil diproses
        </p>
      </div>

      {/* QR Code Section */}
      <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
        <div className="flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <QRCodeSVG
              id="booking-qr-code"
              value={qrData}
              size={160}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/logo.png",
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>

          {/* Booking Code */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Kode Booking</p>
            <p className="text-2xl font-black font-mono tracking-wider text-primary">{bookingCode}</p>
          </div>

          {/* Download QR Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQR}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Simpan QR Code
          </Button>
        </div>
      </div>

      {/* Booking Details */}
      <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Detail Booking</p>
        <div className="grid grid-cols-1 gap-2.5 text-sm">
          {patientName && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                  {patientName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Pasien</p>
                <p className="font-medium">{patientName}</p>
              </div>
            </div>
          )}

          {noRM && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">No. Rekam Medis</p>
                <p className="font-medium font-mono">{noRM}</p>
              </div>
            </div>
          )}

          {doctorName && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Dokter</p>
                <p className="font-medium">{doctorName}</p>
              </div>
            </div>
          )}

          {poliName && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Poliklinik</p>
                <p className="font-medium">{poliName}</p>
              </div>
            </div>
          )}

          {serviceItemName && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-primary/20">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">Pemeriksaan / Layanan</p>
                <p className="font-medium text-primary">{serviceItemName}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {appointmentDate && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="font-medium text-xs">
                    {new Date(appointmentDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {appointmentTime && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <Clock4 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Jam</p>
                  <p className="font-medium text-xs">{appointmentTime} WIB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm">
        <p className="font-medium text-blue-800 dark:text-blue-200 mb-2 text-xs">📌 Petunjuk Kedatangan:</p>
        <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-left text-xs">
          <li>• Datang <b>15 menit sebelum</b> jadwal praktek</li>
          <li>• Bawa <b>KTP dan kartu BPJS</b> (jika ada)</li>
          <li>• Tunjukkan <b>QR code</b> ini di loket pendaftaran</li>
        </ul>
      </div>

      {/* Countdown */}
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <Clock className="h-3 w-3" />
        Menutup dalam {countdown} detik
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col w-full gap-2">
        <Button
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all font-bold"
          onClick={handleShareWhatsApp}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Bagikan ke WhatsApp
        </Button>
        <Button
          className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
          onClick={() => {
            window.print();
            setCountdown(9999);
          }}
        >
          <Printer className="h-4 w-4 mr-2" />
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
          size="sm"
          className="w-full rounded-xl text-muted-foreground"
          onClick={() => {
            setCountdown(0);
            setIsClosing(true);
            setTimeout(() => onClose?.(), 0);
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Tutup
        </Button>
      </div>
    </div>
  );
};