export interface Partner {
    id: string;
    name: string;
    imageUrl: string;
    link?: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePartnerPayload {
    name: string;
    imageUrl: string;
    link?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdatePartnerPayload extends Partial<CreatePartnerPayload> {
    id: string;
}
