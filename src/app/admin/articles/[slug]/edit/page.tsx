"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useGetArticleBySlug } from "~/features/article/api/getArticleBySlug";
import { useUpdateArticle } from "~/features/article/api/updateArticle";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: originalSlug } = use(params);
    const router = useRouter();
    const { data: article, isLoading } = useGetArticleBySlug({ slug: originalSlug });
    const updateArticle = useUpdateArticle();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image: "",
    });

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                slug: article.slug,
                content: article.content,
                excerpt: article.excerpt || "",
                image: article.image || "",
            });
        }
    }, [article]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateArticle.mutateAsync({
                slug: originalSlug,
                data: formData
            });
            router.push("/admin/articles");
        } catch (error) {
            console.error(error);
            alert("Failed to update article");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading article data...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" className="pl-0" asChild>
                    <Link href="/admin/articles">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Article</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                            />
                            <p className="text-xs text-muted-foreground">Changing slug will change the URL</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={12}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateArticle.isPending}>
                                {updateArticle.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
