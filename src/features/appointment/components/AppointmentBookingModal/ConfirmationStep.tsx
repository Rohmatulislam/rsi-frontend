import { CheckCircle2 } from "lucide-react";
import { AppointmentFormData, PatientSearchState } from "../../services/appointmentService";
import Image from "next/image";
import { Stethoscope } from "lucide-react";

interface ConfirmationStepProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  patientSearch: PatientSearchState;
  doctor: any;
}

export const ConfirmationStep = ({
  formData,
  setFormData,
  patientSearch,
  doctor
}: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Verifikasi Detail Booking</h3>
        <p className="text-muted-foreground">Pastikan jadwal dan data Anda sudah benar</p>
      </div>

      {/* Booking Details Summary */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
            {doctor?.imageUrl ? (
              <Image
                src={doctor.imageUrl}
                alt={doctor?.name || "Dokter"}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                <Stethoscope className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold">{doctor?.name || "Dokter Umum"}</p>
            <p className="text-sm text-muted-foreground">{doctor?.specialization || "Umum"}</p>
            {formData.poliName && (
              <p className="text-sm font-medium text-primary mt-1">→ {formData.poliName}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Tanggal Kunjungan</p>
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
            <p className="text-muted-foreground mb-1">Waktu Kunjungan</p>
            <p className="font-semibold">{formData.time || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Jenis Pembayaran</p>
            <p className="font-semibold uppercase">{formData.paymentName || formData.paymentType}</p>
          </div>
          {formData.serviceItemName && (
            <div className="col-span-2">
              <p className="text-muted-foreground mb-1">Pemeriksaan / Layanan</p>
              <p className="font-semibold text-primary">{formData.serviceItemName}</p>
            </div>
          )}
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

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
          ℹ️ Silakan periksa kembali detail booking Anda sebelum melanjutkan
        </p>
      </div>
    </div>
  );
};