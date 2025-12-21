// Banner types and interfaces

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    link?: string;
    linkText?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBannerDto {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    link?: string;
    linkText?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> { }

export interface ReorderBannerDto {
    id: string;
    order: number;
}
