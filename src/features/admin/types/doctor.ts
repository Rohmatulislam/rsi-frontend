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
  isStudying?: boolean;
  isOnLeave?: boolean;
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
  isStudying?: boolean;
  isOnLeave?: boolean;
}

export interface DoctorScheduleException {
  id: string;
  doctorId: string;
  date: string;
  type: 'LEAVE' | 'RESCHEDULE' | 'EXTRA_QUOTA';
  startTime?: string;
  endTime?: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorScheduleExceptionDto {
  doctorId: string;
  date: string;
  type: 'LEAVE' | 'RESCHEDULE' | 'EXTRA_QUOTA';
  startTime?: string;
  endTime?: string;
  note?: string;
}