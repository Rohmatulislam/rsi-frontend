export interface AppointmentFormData {
  poliId?: string; // Tambahkan field untuk memilih poliklinik
  poliName?: string; // Nama poliklinik yang dipilih
  date: string;
  time: string;
  patientType: 'new' | 'old';
  mrNumber: string;
  nik: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  birthDate: string;
  gender: 'L' | 'P' | '';
  paymentType: string; // kd_pj dari Khanza (contoh: "A01", "BPJ", dll)
  paymentName?: string; // png_jawab dari Khanza (contoh: "UMUM/TUNAI", "BPJS KESEHATAN", dll)
  bpjsNumber: string;
  keluhan: string;
  religion: string;
  consentTerms: boolean;
  consentPrivacy: boolean;
  consentFee: boolean;
  bpjsClass: string;
  bpjsFaskes: string;
  bpjsRujukan: string;
  penanggungJawab: string;
  hubunganPenanggungJawab: string;
  serviceItemId?: string;   // Untuk menyimpan ID paket (MCU/dll)
  serviceItemName?: string; // Nama paket yang dipilih
}

export interface PatientData {
  no_rkm_medis: string;
  no_ktp: string;
  nm_pasien: string;
  jk: string;
  tgl_lahir: string;
  no_tlp: string;
  alamat: string;
  email: string;
  no_peserta?: string; // No. BPJS dari data pasien
  nm_ibu?: string;
  tmp_lahir?: string;
  gol_darah?: string;
  pekerjaan?: string;
  pnd?: string;
}

export interface PatientSearchState {
  loading: boolean;
  found: boolean;
  patientData: PatientData | null;
  error: string;
}

export interface AppointmentStepProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  handleNext: () => void;
  handleBack: () => void;
  step: number;
  loading: boolean;
  doctor: any;
  patientSearch: PatientSearchState;
  setPatientSearch: React.Dispatch<React.SetStateAction<PatientSearchState>>;
  searchPatient: (mrNumber: string) => Promise<void>;
  getAvailableDates?: () => AvailableDate[];
  getAvailableTimesForDate?: (selectedDate: string) => string[];
}

export interface AvailableDate {
  value: string;
  label: string;
}