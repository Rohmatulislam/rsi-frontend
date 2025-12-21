import { LucideIcon } from "lucide-react";

export interface ServiceDetail {
    title: string;
    description: string;
    longDescription: string;
    icon: LucideIcon;
    color: "primary" | "success" | "accent" | "purple";
    features: string[];
    ctaText?: string;
    ctaAction?: () => void;
    whatsappText?: string;
}

export type PrescriptionStatus = 'MENUNGGU' | 'PROSES' | 'SELESAI' | 'SUBMITTED' | 'VERIFIED' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface PrescriptionStatusDto {
    no_resep: string;
    no_rawat: string;
    no_rm: string;
    nama_pasien: string;
    dokter: string;
    tanggal: string;
    jam: string;
    status: PrescriptionStatus;
    status_label: string;
    tgl_penyerahan?: string;
    jam_penyerahan?: string;
    source: 'SIMRS' | 'WEBSITE';
    delivery_method?: string;
}

export interface SubmitPrescriptionParams {
    patientName: string;
    patientPhone: string;
    patientRM?: string;
    userId?: string;
    prescriptionImage?: string; // Base64
    deliveryMethod: 'PICKUP' | 'DELIVERY';
    address?: string;
    note?: string;
}

export interface PrescriptionResult {
    id: string;
    patientName: string;
    patientPhone: string;
    patientRM?: string;
    prescriptionImageUrl?: string;
    deliveryMethod: string;
    address?: string;
    status: string;
    note?: string;
    createdAt: string;
}
