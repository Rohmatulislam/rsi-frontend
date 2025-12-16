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
};
