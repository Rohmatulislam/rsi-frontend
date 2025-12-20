"use client";

import { Skeleton } from "~/components/ui/skeleton";

interface ServicePageSkeletonProps {
    variant?: "grid" | "list" | "detail";
    itemCount?: number;
}

/**
 * Reusable skeleton component for service pages
 * Provides consistent loading states across all service pages
 */
export const ServicePageSkeleton = ({
    variant = "grid",
    itemCount = 8
}: ServicePageSkeletonProps) => {
    if (variant === "detail") {
        return (
            <div className="min-h-screen">
                {/* Hero Skeleton */}
                <div className="bg-primary/5 py-20">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-12 w-2/3 mb-4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>

                {/* Info Cards Skeleton */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card border rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Doctor Grid Skeleton */}
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-5 w-64 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card border rounded-2xl p-6 space-y-4">
                                <Skeleton className="h-40 w-full rounded-xl" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "list") {
        return (
            <div className="space-y-4">
                {Array.from({ length: itemCount }).map((_, i) => (
                    <div key={i} className="bg-card border rounded-2xl p-6 flex items-center gap-6">
                        <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-10 w-32 rounded-xl" />
                    </div>
                ))}
            </div>
        );
    }

    // Default: Grid variant
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} className="bg-card border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-14 w-14 rounded-2xl" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <div className="pt-4 space-y-3">
                        <Skeleton className="h-11 w-full rounded-xl" />
                        <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Hero section skeleton for service pages
 */
export const ServiceHeroSkeleton = () => (
    <div className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-6 w-40 mx-auto mb-4" />
            <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
    </div>
);

/**
 * Stats section skeleton
 */
export const ServiceStatsSkeleton = () => (
    <div className="container mx-auto px-4 -mt-10 mb-16 relative z-10">
        <div className="bg-card border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 w-full max-w-lg">
                <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="flex gap-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
