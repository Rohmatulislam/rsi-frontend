"use client";

import { Skeleton } from "~/components/ui/skeleton";

/**
 * Executive-specific skeleton with premium gold/amber styling
 */
export const ExecutivePageSkeleton = () => {
    return (
        <div className="min-h-screen pb-20">
            {/* Premium Hero Skeleton */}
            <div className="relative overflow-hidden bg-slate-950 text-white py-20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="container mx-auto px-4 text-center">
                    <Skeleton className="h-6 w-40 mx-auto mb-4 bg-amber-500/20" />
                    <Skeleton className="h-12 w-2/3 mx-auto mb-4 bg-white/10" />
                    <Skeleton className="h-6 w-1/2 mx-auto bg-white/10" />
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="container mx-auto px-4 -mt-12 relative z-10">
                <div className="bg-card border border-amber-500/20 rounded-3xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-2xl bg-amber-500/10" />
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-20 bg-amber-500/10" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Skeleton */}
            <div className="container mx-auto px-4 py-16">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card border rounded-2xl p-6 space-y-4">
                            <Skeleton className="h-12 w-12 rounded-xl bg-amber-500/10" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Clinics Grid Skeleton */}
            <div className="bg-slate-50 dark:bg-slate-900/40 py-16">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-6 w-32 mb-4 bg-amber-500/20" />
                    <Skeleton className="h-10 w-64 mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-card border border-border/40 rounded-[2rem] p-8 space-y-4">
                                <Skeleton className="h-14 w-14 rounded-2xl bg-amber-500/10" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="pt-4 space-y-3">
                                    <Skeleton className="h-12 w-full rounded-xl bg-slate-900/50" />
                                    <Skeleton className="h-8 w-full rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
