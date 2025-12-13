import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { AppointmentFormData, PatientSearchState } from "../../types/appointment";
import Image from "next/image";
import { Stethoscope } from "lucide-react";

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
        <Select onValueChange={(val: 'umum' | 'bpjs') => setFormData({ ...formData, paymentType: val })}>
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
                onValueChange={(val: string) => setFormData({ ...formData, bpjsClass: val })}
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
  );
};