export interface ServiceDto {
    id: string;
    name: string;
    slug: string;
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    image?: string;
    isActive: boolean;
    isFeatured: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    items?: ServiceItemDto[];
    faqs?: ServiceFaqDto[];
    _count?: {
        items: number;
        faqs: number;
    };
}

export interface ServiceItemDto {
    id: string;
    serviceId: string;
    category?: string;
    name: string;
    description?: string;
    price?: number;
    features?: string;
    icon?: string;
    imageUrl?: string;
    videoUrl?: string | null;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceFaqDto {
    id: string;
    serviceId: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
}
