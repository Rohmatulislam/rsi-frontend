// features/admin/types/category.ts

export type CategoryType = "ARTICLE_CATEGORY" | "ARTICLE_TAG" | "POLI" | "FEATURED" | "DEPARTMENT";

export interface Category {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
    description?: string;
    icon?: string;
    color?: string;
    order?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCategoryDto {
    name: string;
    slug: string;
    type: CategoryType;
    description?: string;
    icon?: string;
    color?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateCategoryDto {
    name?: string;
    slug?: string;
    type?: CategoryType;
    description?: string;
    icon?: string;
    color?: string;
    order?: number;
    isActive?: boolean;
}
