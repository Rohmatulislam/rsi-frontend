"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";

interface RadioFiltersSidebarProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    selectedGuarantor: string;
    onGuarantorChange: (val: string) => void;
    guarantors: any[];
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
    categories: string[];
    categoriesLoading: boolean;
}

export const RadioFiltersSidebar = ({
    searchQuery,
    onSearchChange,
    selectedGuarantor,
    onGuarantorChange,
    guarantors,
    selectedCategory,
    onCategoryChange,
    categories,
    categoriesLoading
}: RadioFiltersSidebarProps) => {
    return (
        <div className="space-y-6">
            {/* Search and Guarantor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari pemeriksaan (misal: USG, MRI, Rontgen)..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Select value={selectedGuarantor} onValueChange={onGuarantorChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Penjamin" />
                    </SelectTrigger>
                    <SelectContent>
                        {guarantors?.map((g: any) => (
                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange("All")}
                    className="rounded-full"
                >
                    Semua
                </Button>
                {categoriesLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24 rounded-full" />
                    ))
                ) : (
                    categories?.map((cat: string) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => onCategoryChange(cat)}
                            className="rounded-full"
                        >
                            {cat}
                        </Button>
                    ))
                )}
            </div>
        </div>
    );
};
