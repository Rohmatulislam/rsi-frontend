import { Skeleton } from "~/components/ui/skeleton";

export const ServiceCardSkeleton = () => {
    return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg h-[140px] w-full flex items-center justify-center animate-pulse">
            <div className="flex flex-col items-center gap-3 text-center w-full">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded" />
            </div>
        </div>
    );
};
