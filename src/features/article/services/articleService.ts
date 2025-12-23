// Article types and interfaces
export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl?: string;
    categoryId?: string;
    category?: ArticleCategory;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ArticleCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export type ArticleDto = {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: string;
    author?: string;
    publishedAt?: string;
    createdAt: string;
    viewCount: number;
    category?: {
        name: string;
        slug: string;
    };
    updatedAt: string;
};
