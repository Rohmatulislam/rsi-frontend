export interface CreateArticleDto {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: string;
    category?: string;
    isActive?: boolean;
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> { }
