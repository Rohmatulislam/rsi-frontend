export interface CreateArticleDto {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: string;
    categoryIds?: string[];
    isActive?: boolean;
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> { }
