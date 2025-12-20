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
