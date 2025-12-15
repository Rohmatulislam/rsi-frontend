import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { AppointmentFormData, PatientSearchState } from "../../types/appointment";
import Image from "next/image";
import { Stethoscope } from "lucide-react";
import { useGetPaymentMethods } from "~/features/doctor/api/getPaymentMethods";

interface PatientDataStepProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  patientSearch: PatientSearchState;
  setPatientSearch: React.Dispatch<React.SetStateAction<PatientSearchState>>;
  searchPatient: (mrNumber: string) => Promise<void>;
  doctor: any;
}

export const PatientDataStep = ({
  formData,
  setFormData,
  patientSearch,
  setPatientSearch,
  searchPatient,
  doctor
}: PatientDataStepProps) => {
  // Fetch payment methods from Khanza
  const { data: paymentMethods, isLoading: isLoadingPayments } = useGetPaymentMethods();

  // Helper function to check if selected payment is BPJS-related
  const isBpjsPayment = (paymentName: string) => {
    const bpjsKeywords = ['bpjs', 'jkn', 'kis'];
    return bpjsKeywords.some(keyword => paymentName.toLowerCase().includes(keyword));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
          {doctor.imageUrl ? (
            <Image
              src={doctor.imageUrl}
              alt={doctor.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
              <Stethoscope className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{doctor.name}</p>
          <p className="text-sm text-muted-foreground">{doctor.specialization || "Dokter"}</p>
          {formData.poliName && (
            <p className="text-sm font-medium text-primary mt-1">→ {formData.poliName}</p>
          )}
          {formData.date && formData.time && (
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(formData.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} | {formData.time}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Jenis Pasien</Label>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setFormData({ ...formData, patientType: 'new' })}
            className={` p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${formData.patientType === 'new' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientType === 'new' ? 'border-primary' : 'border-slate-400'}`}>
              {formData.patientType === 'new' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <span className="font-medium">Pasien Baru</span>
          </div>
          <div
            onClick={() => setFormData({ ...formData, patientType: 'old' })}
            className={` p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${formData.patientType === 'old' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
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
                // Reset search state saat nilai berubah
                if (patientSearch.found || patientSearch.error) {
                  setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
                }
              }}
              onBlur={() => {
                // Auto-search saat input kehilangan focus (jika sudah ada minimal 3 karakter)
                if (formData.mrNumber && formData.mrNumber.length >= 3 && !patientSearch.found && !patientSearch.loading) {
                  searchPatient(formData.mrNumber);
                }
              }}
              className="h-12 rounded-xl"
            />
            {patientSearch.loading && (
              <p className="text-sm text-muted-foreground">🔍 Mencari data pasien...</p>
            )}
            {patientSearch.found && patientSearch.patientData && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">✓ Pasien ditemukan: {patientSearch.patientData.nm_pasien}</p>
                {patientSearch.patientData.no_peserta && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">No. BPJS: {patientSearch.patientData.no_peserta}</p>
                )}
              </div>
            )}
            {patientSearch.error && (
              <p className="text-sm text-red-500">⚠️ {patientSearch.error}</p>
            )}
            {!patientSearch.loading && !patientSearch.found && !patientSearch.error && (
              <p className="text-sm text-muted-foreground mt-1">
                Masukkan nomor rekam medis Anda untuk mencari data
              </p>
            )}
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
              <Select value={formData.gender} onValueChange={(val: 'L' | 'P' | '') => setFormData({ ...formData, gender: val })}>
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
              onValueChange={(val: string) => setFormData({ ...formData, religion: val })}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Penanggung Jawab <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Nama penanggung jawab"
                value={formData.penanggungJawab}
                onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Hubungan <span className="text-red-500">*</span></Label>
              <Select
                value={formData.hubunganPenanggungJawab}
                onValueChange={(val: string) => setFormData({ ...formData, hubunganPenanggungJawab: val })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih hubungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRI SENDIRI">Diri Sendiri</SelectItem>
                  <SelectItem value="ORANG TUA">Orang Tua</SelectItem>
                  <SelectItem value="SUAMI">Suami</SelectItem>
                  <SelectItem value="ISTRI">Istri</SelectItem>
                  <SelectItem value="ANAK">Anak</SelectItem>
                  <SelectItem value="SAUDARA">Saudara</SelectItem>
                  <SelectItem value="LAINNYA">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <Label>Metode Pembayaran <span className="text-red-500">*</span></Label>
        {isLoadingPayments ? (
          <div className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Memuat metode pembayaran...</span>
          </div>
        ) : (
          <Select
            value={formData.paymentType}
            onValueChange={(val: string) => {
              const selectedPayment = paymentMethods?.find(pm => pm.kd_pj === val);
              const paymentName = selectedPayment?.png_jawab || val;

              // Auto-fill No. BPJS jika pasien lama, memilih BPJS, dan punya no_peserta
              let bpjsNumber = formData.bpjsNumber;
              if (isBpjsPayment(paymentName) && formData.patientType === 'old' && patientSearch.patientData?.no_peserta) {
                bpjsNumber = patientSearch.patientData.no_peserta;
              }

              setFormData({
                ...formData,
                paymentType: val,
                paymentName,
                bpjsNumber
              });
            }}
          >
            <SelectTrigger className="w-full h-12 rounded-xl">
              <SelectValue placeholder="Pilih Metode Bayar" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods?.map((pm) => (
                <SelectItem key={pm.kd_pj} value={pm.kd_pj}>
                  {pm.png_jawab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {formData.paymentName && (
          <p className="text-xs text-muted-foreground">
            Kode: {formData.paymentType}
          </p>
        )}
      </div>

      {formData.paymentName && isBpjsPayment(formData.paymentName) && (() => {
        // Dapatkan No. BPJS - prioritas: formData.bpjsNumber, lalu dari patientData jika pasien lama
        const noPesertaDariPasien = formData.patientType === 'old' && patientSearch.patientData?.no_peserta
          ? patientSearch.patientData.no_peserta
          : '';
        const displayValue = formData.bpjsNumber || noPesertaDariPasien;
        const isAutoFilled = !formData.bpjsNumber && noPesertaDariPasien;

        return (
          <div className="space-y-4 p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <h4 className="font-semibold text-green-900 dark:text-green-100">Data BPJS</h4>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>No. Kartu BPJS <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="0001234567890"
                  value={displayValue}
                  onChange={(e) => setFormData({ ...formData, bpjsNumber: e.target.value })}
                  className="h-12 rounded-xl"
                  maxLength={13}
                />
                {isAutoFilled ? (
                  <p className="text-xs text-green-600 dark:text-green-400">✓ Diambil dari data pasien ({noPesertaDariPasien})</p>
                ) : (
                  <p className="text-xs text-muted-foreground">13 digit nomor kartu BPJS Kesehatan</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>No. Rujukan (Opsional)</Label>
                <Input
                  placeholder="Nomor surat rujukan dari faskes tingkat 1"
                  value={formData.bpjsRujukan}
                  onChange={(e) => setFormData({ ...formData, bpjsRujukan: e.target.value })}
                  className="h-12 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Nomor rujukan dari Puskesmas/Klinik</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};