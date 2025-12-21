import { LucideIcon } from "lucide-react";

export interface TherapyService {
    icon: LucideIcon | string;
    title: string;
    description: string;
}

export interface JourneyStep {
    icon: LucideIcon;
    title: string;
    desc: string;
}

export interface Specialty {
    title: string;
    desc: string;
    icon: LucideIcon;
}

export interface RehabProgram {
    tanggal: string;
    program: string;
    keterangan: string;
}

export interface RehabProgress {
    no_rawat: string;
    no_rm: string;
    nama_pasien: string;
    dokter: string;
    tanggal_terakhir: string;
    diagnosa: string;
    tatalaksana: string;
    evaluasi: string;
    status_program: string;
    programs: RehabProgram[];
}

export interface RehabTherapy {
    id: string;
    name: string;
    price: number;
    category: string;
}

export interface RehabDoctor {
    id: string;
    name: string;
    specialization: string;
}
