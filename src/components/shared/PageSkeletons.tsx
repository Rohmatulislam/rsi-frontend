"use client";

import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton for Inpatient (Rawat Inap) page with stepper-based selection
 */
export const InpatientPageSkeleton = () => (
    <div className="min-h-screen pb-20">
        {/* Hero Skeleton */}
        <div className="bg-primary/5 py-20">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-6 w-40 mx-auto mb-4" />
                <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
        </div>

        {/* Stepper Skeleton */}
        <div className="container mx-auto px-4 -mt-8 mb-12 relative z-10">
            <div className="bg-card border rounded-2xl p-6 flex justify-between items-center">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-24 hidden md:block" />
                    </div>
                ))}
            </div>
        </div>

        {/* Building Grid Skeleton */}
        <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-5 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-card border rounded-2xl overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <div className="p-6 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/**
 * Skeleton for MCU page with package cards
 */
export const MCUPageSkeleton = () => (
    <div className="min-h-screen pb-24">
        {/* Hero Skeleton */}
        <div className="bg-primary/5 py-20">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-6 w-40 mx-auto mb-4" />
                <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
        </div>

        {/* Highlights Skeleton */}
        <div className="container mx-auto px-4 -mt-10 mb-24 relative z-10">
            <div className="bg-card border rounded-[2.5rem] p-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <Skeleton className="h-16 w-16 rounded-2xl mb-6" />
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Benefits Skeleton */}
        <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card border rounded-3xl p-8 space-y-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ))}
            </div>
        </div>

        {/* Packages Skeleton */}
        <div className="py-24 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-10 w-96 mb-4" />
                <Skeleton className="h-5 w-80 mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border rounded-[2.5rem] p-10 space-y-6">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <div className="p-6 bg-primary/5 rounded-3xl">
                                <Skeleton className="h-10 w-40" />
                            </div>
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton for Lab/Radiology catalog pages
 */
export const CatalogPageSkeleton = () => (
    <div className="min-h-screen pb-20">
        {/* Hero Skeleton */}
        <div className="bg-primary/5 py-20">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-6 w-40 mx-auto mb-4" />
                <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
        </div>

        {/* Benefits Skeleton */}
        <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card border rounded-2xl p-6 space-y-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>

        {/* Catalog Skeleton */}
        <div className="py-16 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-5 w-72 mb-8" />

                {/* Search Bar Skeleton */}
                <Skeleton className="h-12 w-full max-w-md rounded-xl mb-8" />

                {/* Category Tabs Skeleton */}
                <div className="flex gap-3 mb-8 overflow-x-auto">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
                    ))}
                </div>

                {/* Tests Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card border rounded-2xl p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-5 w-3/4" />
                            </div>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
