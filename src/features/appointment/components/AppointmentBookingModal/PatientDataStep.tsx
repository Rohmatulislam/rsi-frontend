import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import { AppointmentFormData, PatientSearchState } from "../../services/appointmentService";
import Image from "next/image";
import { Stethoscope, Calendar, Clock, MapPin, Wallet, ClipboardCheck, CheckCircle2, AlertCircle, User, Phone, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { useGetPaymentMethods } from "~/features/doctor/api/getPaymentMethods";
import { useState } from "react";

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
  const [subStep, setSubStep] = useState(1);
  // Fetch payment methods from Khanza
  const { data: paymentMethods, isLoading: isLoadingPayments } = useGetPaymentMethods();

  // Helper function to check if selected payment is BPJS-related
  const isBpjsPayment = (paymentName: string) => {
    const bpjsKeywords = ['bpjs', 'jkn', 'kis'];
    return bpjsKeywords.some(keyword => paymentName.toLowerCase().includes(keyword));
  };

  return (
    <div className="space-y-6">
      {/* Step Header: Booking Summary Dashboard */}
      <div className="bg-primary/5 rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
        <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" /> Ringkasan Pesanan
          </span>
          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Sudah Benar?
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-primary/20">
              {doctor?.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor?.name || "Dokter"}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{doctor?.name || "Dokter Umum"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{doctor?.specialization || "Umum"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 md:pt-0 md:border-l md:pl-4 border-primary/10">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                <MapPin className="h-3 w-3" /> Unit/Poli
              </div>
              <p className="text-xs font-semibold text-foreground truncate">{formData.poliName || '-'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                <Calendar className="h-3 w-3" /> Jadwal
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {formData.date ? new Date(formData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}, {formData.time}
              </p>
            </div>
          </div>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Cari Data Pasien</Label>
              <div className="flex bg-muted p-1 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
                  }}
                  className={`px-3 py-1 rounded-md transition-all ${!formData.mrNumber.startsWith('NIK-') ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  No. RM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
                  }}
                  className={`px-3 py-1 rounded-md transition-all ${formData.mrNumber.startsWith('NIK-') ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  NIK KTP
                </button>
              </div>
            </div>

            <div className="relative group">
              <Input
                placeholder={formData.nik && formData.nik.length > 0 && formData.patientType === 'old' ? "Masukkan 16 digit NIK" : "Masukkan Nomor Rekam Medis (RM)"}
                value={formData.patientType === 'old' && formData.nik && formData.nik.length > 0 ? formData.nik : formData.mrNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 16) {
                    // Jika 16 digit, kita asumsikan ini NIK
                    if (val.length === 16 && /^\d+$/.test(val)) {
                      setFormData({ ...formData, nik: val, mrNumber: "" });
                    } else {
                      setFormData({ ...formData, mrNumber: val, nik: "" });
                    }
                  }

                  // Reset search state saat nilai berubah
                  if (patientSearch.found || patientSearch.error) {
                    setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
                  }
                }}
                onBlur={() => {
                  const identifier = formData.nik || formData.mrNumber;
                  if (identifier && identifier.length >= 3 && !patientSearch.found && !patientSearch.loading) {
                    searchPatient(identifier);
                  }
                }}
                className="h-12 rounded-xl pr-12 text-lg font-medium tracking-wide"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {patientSearch.loading && (
              <div className="flex items-center gap-2 p-2 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Mencari data di database SIMRS...</p>
              </div>
            )}

            {patientSearch.found && patientSearch.patientData && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 animate-in zoom-in-95 duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
                    <span className="text-emerald-700 dark:text-emerald-300 font-black text-xl">
                      {patientSearch.patientData.nm_pasien?.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight truncate">{patientSearch.patientData.nm_pasien}</p>
                      <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black">
                        <CheckCircle2 className="h-2.5 w-2.5" /> AKTIF
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2 border-t border-emerald-200/50 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest">No. RM</span>
                        <span className="text-xs font-mono font-bold text-emerald-950 dark:text-emerald-50">{patientSearch.patientData.no_rkm_medis}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest">NIK KTP</span>
                        <span className="text-xs font-mono font-bold text-emerald-950 dark:text-emerald-50">{patientSearch.patientData.no_ktp || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest">Tgl Lahir</span>
                        <span className="text-xs font-bold">{new Date(patientSearch.patientData.tgl_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      {patientSearch.patientData.no_tlp && (
                        <div className="flex flex-col">
                          <span className="text-[8px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest">Kontak</span>
                          <span className="text-xs font-bold">{patientSearch.patientData.no_tlp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {patientSearch.error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-xs font-bold uppercase tracking-wide">{patientSearch.error}</p>
              </div>
            )}

            {!patientSearch.loading && !patientSearch.found && !patientSearch.error && (
              <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-dashed border-muted">
                <div className="mt-0.5 p-1 bg-muted rounded-md shrink-0">
                  <Stethoscope className="h-3 w-3" />
                </div>
                <p className="leading-relaxed">
                  Gunakan <span className="font-bold text-foreground">NIK KTP (16 digit)</span> atau <span className="font-bold text-foreground">Nomor RM</span> Anda. Data akan terisi otomatis jika sudah pernah terdaftar di RSI Siti Hajar.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          {/* Sub-step indicator */}
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${subStep >= i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  {i === 1 && <User className="h-4 w-4" />}
                  {i === 2 && <Phone className="h-4 w-4" />}
                  {i === 3 && <ShieldCheck className="h-4 w-4" />}
                </div>
                {i < 3 && <div className={`h-1 w-8 sm:w-16 rounded-full ${subStep > i ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2 italic">
              {subStep === 1 && "Langkah 1: Identitas Dasar"}
              {subStep === 2 && "Langkah 2: Kontak & Alamat"}
              {subStep === 3 && "Langkah 3: Data Administrasi"}
            </h3>

            {subStep === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="space-y-2">
                  <Label>NIK <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 16) {
                        setFormData({ ...formData, nik: value });
                      }
                    }}
                    onBlur={() => {
                      if (formData.nik && formData.nik.length === 16 && !patientSearch.found && !patientSearch.loading) {
                        searchPatient(formData.nik);
                      }
                    }}
                    className="rounded-xl h-11"
                    maxLength={16}
                  />
                  {formData.nik && formData.nik.length !== 16 && (
                    <p className="text-[10px] text-red-500 font-medium">NIK harus 16 digit angka</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Sesuai KTP"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanggal Lahir <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="rounded-xl h-11"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin <span className="text-red-500">*</span></Label>
                    <Select value={formData.gender} onValueChange={(val: 'L' | 'P' | '') => setFormData({ ...formData, gender: val })}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {subStep === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="space-y-2">
                  <Label>Agama <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.religion}
                    onValueChange={(val: string) => setFormData({ ...formData, religion: val })}
                  >
                    <SelectTrigger className="rounded-xl h-11">
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
                    className="rounded-xl h-11"
                    type="tel"
                  />
                  {formData.phone && formData.phone.length < 10 && (
                    <p className="text-[10px] text-red-500 font-medium">Minimal 10 digit</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl h-11"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat Lengkap <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Alamat lengkap"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            )}

            {subStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Penanggung Jawab <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="Nama"
                      value={formData.penanggungJawab}
                      onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hubungan <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.hubunganPenanggungJawab}
                      onValueChange={(val: string) => setFormData({ ...formData, hubunganPenanggungJawab: val })}
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Hubungan" />
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
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 text-[11px] text-amber-800 dark:text-amber-200 italic">
                  Data penanggung jawab diperlukan untuk keperluan administrasi rumah sakit dan keadaan darurat.
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-primary/10">
              {subStep > 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubStep(subStep - 1)}
                  className="text-primary hover:bg-primary/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
                </Button>
              ) : <div />}

              {subStep < 3 ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    if (subStep === 1) {
                      if (!formData.nik || formData.nik.length !== 16 || !formData.fullName || !formData.birthDate || !formData.gender) {
                        toast.error("Lengkapi identitas wajib di Langkah 1");
                        return;
                      }
                    }
                    if (subStep === 2) {
                      if (!formData.religion || !formData.phone || formData.phone.length < 10 || !formData.email || !formData.address) {
                        toast.error("Lengkapi kontak, email, dan alamat wajib di Langkah 2");
                        return;
                      }
                    }
                    setSubStep(subStep + 1);
                  }}
                  className="bg-primary text-white shadow-sm"
                >
                  Lanjut <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                  <CheckCircle2 className="h-4 w-4" /> Data Lengkap
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Label>Keluhan Utama <span className="text-red-500">*</span></Label>
        <Textarea
          placeholder="Jelaskan keluhan Anda secara singkat (minimal 10 karakter)"
          value={formData.keluhan}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, keluhan: e.target.value })}
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
          <div className="space-y-4 p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-xl animate-in slide-in-from-left-2 duration-300">
            <h4 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2 text-sm">
              <div className="w-1.5 h-4 bg-green-500 rounded-full" />
              Data BPJS Kesehatan
            </h4>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">No. Kartu BPJS <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="0001234567890"
                  value={displayValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 13) {
                      setFormData({ ...formData, bpjsNumber: value });
                    }
                  }}
                  className="h-10 rounded-xl text-sm"
                  maxLength={13}
                />
                {isAutoFilled ? (
                  <p className="text-[10px] text-green-600 dark:text-green-400 font-medium">✓ Terisi otomatis ({noPesertaDariPasien})</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground italic">Masukkan 13 digit nomor kartu</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">No. Rujukan (Opsional)</Label>
                <Input
                  placeholder="Nomor rujukan dari faskes"
                  value={formData.bpjsRujukan}
                  onChange={(e) => setFormData({ ...formData, bpjsRujukan: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* PERSETUJUAN SEBAGAI BAGIAN DARI FORM */}
      <div className="space-y-4 p-5 border-2 border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl animate-in fade-in duration-500">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 bg-yellow-400 rounded-full" />
          <h4 className="font-bold text-yellow-900 dark:text-yellow-100 text-sm italic">
            Konfirmasi Akhir & Persetujuan
          </h4>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-4 p-3 rounded-xl hover:bg-yellow-100/50 transition-colors cursor-pointer group">
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={formData.consentTerms}
                onChange={(e) => setFormData({ ...formData, consentTerms: e.target.checked })}
                className="h-5 w-5 rounded-md border-yellow-400 text-primary focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 group-hover:text-primary transition-colors">Syarat & Ketentuan</p>
              <p className="text-[11px] text-yellow-800/70 dark:text-yellow-200/50 italic">Saya menyetujui seluruh aturan pendaftaran di RSI Siti Hajar.</p>
            </div>
          </label>

          <label className="flex items-start gap-4 p-3 rounded-xl hover:bg-yellow-100/50 transition-colors cursor-pointer group">
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={formData.consentPrivacy}
                onChange={(e) => setFormData({ ...formData, consentPrivacy: e.target.checked })}
                className="h-5 w-5 rounded-md border-yellow-400 text-primary focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 group-hover:text-primary transition-colors">Kebijakan Privasi</p>
              <p className="text-[11px] text-yellow-800/70 dark:text-yellow-200/50 italic">Data saya akan dijaga kerahasiaannya dengan standar medis.</p>
            </div>
          </label>

          <label className="flex items-start gap-4 p-3 rounded-xl hover:bg-yellow-100/50 transition-colors cursor-pointer group border border-dashed border-yellow-400/30">
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={formData.consentFee}
                onChange={(e) => setFormData({ ...formData, consentFee: e.target.checked })}
                className="h-5 w-5 rounded-md border-yellow-400 text-primary focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 group-hover:text-primary transition-colors">Biaya Pemeriksaan</p>
              <p className="text-[11px] text-yellow-800/70 dark:text-yellow-200/50">
                Bersedia membayar biaya konsultasi estimasi <span className="font-bold text-yellow-900">
                  Rp {(() => {
                    // Temukan tarif dari scheduleDetails berdasarkan poli yang dipilih
                    const selectedSchedule = doctor?.scheduleDetails?.find((s: any) => s.kd_poli === formData.poliId);
                    const fee = selectedSchedule?.consultation_fee || doctor?.consultation_fee || 0;
                    return fee.toLocaleString('id-ID');
                  })()}
                </span>
                {formData.paymentName?.toLowerCase().includes('bpjs') && ' (Ditanggung BPJS)'}
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};