"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateArticle } from "~/features/article/api/createArticle";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateArticlePage() {
    const router = useRouter();
    const createArticle = useCreateArticle();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            // Auto-generate slug from title if slug is empty or was auto-generated
            if (name === "title") {
                // Simple slugify
                const slug = value.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
                // Only update slug if it was matching the previous title (simple heuristic: if previous slug is "empty" or close)
                // Or just always update if user hasn't manually edited slug? Too complex.
                // Behave like WordPress: once manually edited, stop auto-update. For now, simple logic: update if current slug is empty.
                if (!prev.slug || prev.slug === "") {
                    updates.slug = slug;
                }
            }
            return updates;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createArticle.mutateAsync(formData);
            router.push("/admin/articles");
        } catch (error) {
            console.error(error);
            alert("Failed to create article");
        }
    };

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
                    <CardTitle>Create New Article</CardTitle>
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
                                placeholder="Enter article title"
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
                                placeholder="article-url-slug"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                            <p className="text-xs text-muted-foreground">URL to featured image</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                placeholder="Short summary..."
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
                                placeholder="Article content..."
                                rows={12}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createArticle.isPending}>
                                {createArticle.isPending ? "Creating..." : "Create Article"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
