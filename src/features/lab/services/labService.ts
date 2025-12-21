// Lab types and interfaces
export interface LabTemplate {
    id: number;
    name: string;
    unit: string;
    ref_ld: string;
    ref_la: string;
    ref_pd: string;
    ref_pa: string;
    price: number;
}

export interface LabTest {
    id: string;
    name: string;
    price: number;
    category: string;
    class: string;
    status: string;
    template: LabTemplate[];
}

export interface LabGuarantor {
    id: string;
    name: string;
}

export type LabTemplateWithParent = LabTemplate & {
    parent_name: string;
    kategori: string;
};

export interface LabTestCategory {
    id: string;
    name: string;
    description?: string;
}

export interface LabResult {
    id: string;
    testId: string;
    testName: string;
    patientId: string;
    patientName: string;
    result: string;
    unit?: string;
    normalRange?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
    testedAt?: string;
    verifiedAt?: string;
    createdAt: string;
}

export interface LabOrder {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    tests: LabTest[];
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    totalPrice: number;
    orderedAt: string;
    completedAt?: string;
}
