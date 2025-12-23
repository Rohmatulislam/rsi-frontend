// Article types and interfaces
export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl?: string;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    categories: ArticleCategory[];
}

export interface ArticleCategory {
    id: string;
    name: string;
    slug: string;
    type: "ARTICLE_CATEGORY" | "ARTICLE_TAG" | "POLI" | "FEATURED" | "DEPARTMENT";
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
    updatedAt: string;
    viewCount: number;
    categories: Array<{
        id: string;
        name: string;
        slug: string;
        type: string;
    }>;
};
