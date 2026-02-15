import { Skeleton } from "~/components/ui/skeleton";

export const ArticleCardSkeleton = () => {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full shadow-sm">
            <div className="relative aspect-[1.3/1] overflow-hidden">
                <Skeleton className="w-full h-full rounded-none" />
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="space-y-2 mb-6">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
                <div className="mt-auto">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
};
