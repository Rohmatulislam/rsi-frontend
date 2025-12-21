// services/doctorService.ts
import { AppointmentFormData } from "~/features/appointment/services/appointmentService";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  department?: string;
  licenseNumber: string;
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
  isActive: boolean;
  schedules: Schedule[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface DoctorImageUpdate {
  imageUrl: string;
}

export const updateDoctorImage = async (doctorId: string, imageData: string): Promise<Doctor> => {
  const response = await fetch(`/api/doctors/${doctorId}/image`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: imageData }),
  });

  if (!response.ok) {
    throw new Error('Gagal memperbarui gambar dokter');
  }

  return response.json();
};

export const uploadDoctorImage = async (doctorId: string, file: File): Promise<Doctor> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`/api/doctors/${doctorId}/upload-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Gagal mengunggah gambar dokter');
  }

  return response.json();
};