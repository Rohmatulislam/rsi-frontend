// MCU types and interfaces
export interface MCUPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    isActive: boolean;
    items: MCUItem[];
}

export interface MCUItem {
    id: string;
    name: string;
    description?: string;
    category: string;
}

export interface MCUBooking {
    id: string;
    packageId: string;
    packageName: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    bookingDate: string;
    bookingTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    totalPrice: number;
    createdAt: string;
}

export interface MCUResult {
    id: string;
    bookingId: string;
    patientId: string;
    patientName: string;
    packageName: string;
    results: MCUItemResult[];
    overallStatus: 'NORMAL' | 'ABNORMAL' | 'PENDING';
    completedAt?: string;
    verifiedAt?: string;
}

export interface MCUItemResult {
    itemName: string;
    result: string;
    unit?: string;
    normalRange?: string;
    status: 'NORMAL' | 'ABNORMAL' | 'PENDING';
}

/**
 * MCU (Medical Check Up) Feature Types
 */

// MCU Package from SIMRS Khanza or Local DB
export interface McuPackage {
    id: string;
    name: string;
    price: number;
    category: string;
    poliCode?: string;
    features?: string;
    source?: 'local' | 'simrs';
    description?: string;
}

// API Response wrapper
export interface McuPackagesResponse {
    success: boolean;
    data: McuPackage[];
    message: string;
}

// Booking Form Data
export interface McuBookingFormData {
    date: Date | undefined;
    timeSlot: string;
    patientType: 'new' | 'old';
    mrNumber: string;
    nik: string;
    fullName: string;
    phone: string;
    email: string;
    birthDate: string;
    gender: 'L' | 'P' | '';
    address: string;
    religion: string;
    notes: string;
    motherName?: string;
    birthPlace?: string;
    maritalStatus?: string;
    occupation?: string;
    education?: string;
    bloodType?: string;
    penanggungJawab?: string;
    hubunganPenanggungJawab?: string;
}

// Booking Request DTO
export interface CreateMcuBookingDto {
    packageId: string;
    packageName: string;
    date: string;
    timeSlot: string;
    patientType: 'new' | 'old';
    mrNumber?: string;
    nik: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    birthDate?: string;
    gender?: 'L' | 'P';
    patientAddress?: string;
    religion?: string;
    notes?: string;
    motherName?: string;
    birthPlace?: string;
    maritalStatus?: string;
    occupation?: string;
    education?: string;
    bloodType?: string;
    penanggungJawab?: string;
    hubunganPenanggungJawab?: string;
}

// Time Slot Definition
export interface McuTimeSlot {
    id: string;
    label: string;
    time: string;
}

// Available MCU Time Slots
export const MCU_TIME_SLOTS: McuTimeSlot[] = [
    { id: "pagi", label: "Pagi (07.00 - 10.00)", time: "07:00" },
    { id: "siang", label: "Siang (10.00 - 14.00)", time: "10:00" },
];
