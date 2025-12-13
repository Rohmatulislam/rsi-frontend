// features/admin/types/doctor.ts

export interface CreateDoctorDto {
  name: string;
  email: string;
  licenseNumber: string;
  phone?: string;
  specialization?: string;
  department?: string;
  imageUrl?: string;
  bio?: string;
  experience_years?: number;
  education?: string;
  certifications?: string;
  consultation_fee?: number;
  specialtyImage_url?: string;
  is_executive?: boolean;
  sip_number?: string;
  bpjs?: boolean;
  slug?: string;
  kd_dokter?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDoctorDto {
  name?: string;
  email?: string;
  licenseNumber?: string;
  phone?: string;
  specialization?: string;
  department?: string;
  imageUrl?: string;
  bio?: string;
  experience_years?: number;
  education?: string;
  certifications?: string;
  consultation_fee?: number;
  specialtyImage_url?: string;
  is_executive?: boolean;
  sip_number?: string;
  bpjs?: boolean;
  slug?: string;
  kd_dokter?: string;
  description?: string;
  isActive?: boolean;
}