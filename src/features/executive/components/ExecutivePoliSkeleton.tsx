import { Skeleton } from "~/components/ui/skeleton";

export const ExecutivePoliSkeleton = () => {
    return (
        <div className="bg-card border border-border/40 rounded-[2rem] p-8 shadow-sm group relative overflow-hidden h-full flex flex-col animate-pulse">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[5rem] -mr-8 -mt-8" />

            <Skeleton className="h-14 w-14 rounded-2xl mb-6" />
            <Skeleton className="h-7 w-3/4 mb-3" />
            <div className="space-y-2 mb-8 flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="space-y-3">
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-6 rounded-md mx-auto max-w-[120px]" />
            </div>
        </div>
    );
};
