import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { McuBookingFormData } from "../../types";
import { PatientSearchState } from "../../../appointment/types/appointment";

interface McuPatientStepProps {
    formData: McuBookingFormData;
    setFormData: React.Dispatch<React.SetStateAction<McuBookingFormData>>;
    patientSearch: PatientSearchState;
    setPatientSearch: React.Dispatch<React.SetStateAction<PatientSearchState>>;
    searchPatient: (mrNumber: string) => Promise<void>;
}

export const McuPatientStep = ({
    formData,
    setFormData,
    patientSearch,
    setPatientSearch,
    searchPatient
}: McuPatientStepProps) => {
    return (
        <div className="space-y-6 py-4">
            <div className="space-y-3">
                <Label className="text-base font-semibold">Jenis Pasien</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        onClick={() => setFormData({ ...formData, patientType: 'new' })}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${formData.patientType === 'new' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                    >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientType === 'new' ? 'border-primary' : 'border-slate-400'}`}>
                            {formData.patientType === 'new' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="font-medium">Pasien Baru</span>
                    </div>
                    <div
                        onClick={() => setFormData({ ...formData, patientType: 'old' })}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${formData.patientType === 'old' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                    >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.patientType === 'old' ? 'border-primary' : 'border-slate-400'}`}>
                            {formData.patientType === 'old' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="font-medium">Pasien Lama</span>
                    </div>
                </div>
            </div>

            {formData.patientType === 'old' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <Label htmlFor="mrNumber">Nomor Rekam Medis (No. RM) <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2">
                            <Input
                                id="mrNumber"
                                placeholder="Contoh: 123456"
                                value={formData.mrNumber}
                                onChange={(e) => {
                                    setFormData({ ...formData, mrNumber: e.target.value });
                                    if (patientSearch.found || patientSearch.error) {
                                        setPatientSearch({ loading: false, found: false, patientData: null, error: "" });
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        searchPatient(formData.mrNumber);
                                    }
                                }}
                                className="h-11 rounded-xl"
                            />
                            <button
                                onClick={() => searchPatient(formData.mrNumber)}
                                disabled={patientSearch.loading || !formData.mrNumber}
                                className="px-4 py-2 bg-primary text-white rounded-xl disabled:opacity-50 text-sm font-medium"
                            >
                                Cari
                            </button>
                        </div>
                        {patientSearch.loading && (
                            <p className="text-sm text-muted-foreground animate-pulse">🔍 Mencari data pasien...</p>
                        )}
                        {patientSearch.found && patientSearch.patientData && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">✓ Pasien ditemukan: {patientSearch.patientData.nm_pasien}</p>
                            </div>
                        )}
                        {patientSearch.error && (
                            <p className="text-sm text-red-500">⚠️ {patientSearch.error}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <Label htmlFor="nik">NIK <span className="text-red-500">*</span></Label>
                        <Input
                            id="nik"
                            placeholder="16 digit NIK"
                            value={formData.nik}
                            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                            className="h-11 rounded-xl"
                            maxLength={16}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Nama Lengkap <span className="text-red-500">*</span></Label>
                        <Input
                            id="fullName"
                            placeholder="Sesuai KTP"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="h-11 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="motherName">Nama Ibu Kandung <span className="text-red-500">*</span></Label>
                        <Input
                            id="motherName"
                            placeholder="Nama ibu kandung"
                            value={formData.motherName}
                            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                            className="h-11 rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="birthPlace">Tempat Lahir</Label>
                            <Input
                                id="birthPlace"
                                placeholder="Kota lahir"
                                value={formData.birthPlace}
                                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Tanggal Lahir <span className="text-red-500">*</span></Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                className="h-11 rounded-xl"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Jenis Kelamin <span className="text-red-500">*</span></Label>
                            <Select value={formData.gender} onValueChange={(val: 'L' | 'P') => setFormData({ ...formData, gender: val })}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Laki-laki</SelectItem>
                                    <SelectItem value="P">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodType">Golongan Darah</Label>
                            <Select value={formData.bloodType} onValueChange={(val: string) => setFormData({ ...formData, bloodType: val })}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-">-</SelectItem>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="AB">AB</SelectItem>
                                    <SelectItem value="O">O</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="religion">Agama <span className="text-red-500">*</span></Label>
                            <Select value={formData.religion} onValueChange={(val: string) => setFormData({ ...formData, religion: val })}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih" />
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
                            <Label htmlFor="maritalStatus">Status Nikah</Label>
                            <Select value={formData.maritalStatus} onValueChange={(val: string) => setFormData({ ...formData, maritalStatus: val })}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BELUM MENIKAH">Belum Menikah</SelectItem>
                                    <SelectItem value="MENIKAH">Menikah</SelectItem>
                                    <SelectItem value="JANDA">Janda</SelectItem>
                                    <SelectItem value="DUDA">Duda</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Pekerjaan</Label>
                            <Input
                                id="occupation"
                                placeholder="Contoh: Karyawan"
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="education">Pendidikan</Label>
                            <Select value={formData.education} onValueChange={(val: string) => setFormData({ ...formData, education: val })}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-">-</SelectItem>
                                    <SelectItem value="SD">SD</SelectItem>
                                    <SelectItem value="SMP">SMP</SelectItem>
                                    <SelectItem value="SMA">SMA</SelectItem>
                                    <SelectItem value="D3">D3</SelectItem>
                                    <SelectItem value="S1">S1</SelectItem>
                                    <SelectItem value="S2">S2</SelectItem>
                                    <SelectItem value="S3">S3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat <span className="text-red-500">*</span></Label>
                        <Input
                            id="address"
                            placeholder="Alamat lengkap saat ini"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="h-11 rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor HP/WhatsApp <span className="text-red-500">*</span></Label>
                            <Input
                                id="phone"
                                placeholder="08xxxxxxxxxx"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="space-y-2">
                            <Label htmlFor="penanggungJawab">Penanggung Jawab <span className="text-red-500">*</span></Label>
                            <Input
                                id="penanggungJawab"
                                placeholder="Nama penanggung jawab"
                                value={formData.penanggungJawab}
                                onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                                className="h-10 rounded-lg text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hubunganPenanggungJawab">Hubungan <span className="text-red-500">*</span></Label>
                            <Select value={formData.hubunganPenanggungJawab} onValueChange={(val: string) => setFormData({ ...formData, hubunganPenanggungJawab: val })}>
                                <SelectTrigger className="h-10 rounded-lg text-sm">
                                    <SelectValue placeholder="Pilih" />
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

                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan Tambahan (Alergi, keluhan, dll)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Tuliskan jika ada alergi atau instruksi khusus"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
