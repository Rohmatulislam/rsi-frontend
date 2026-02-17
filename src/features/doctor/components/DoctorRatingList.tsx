"use client";

import { useGetRatings, RatingDto } from "../api/getRatings";
import { Star, MessageSquare, User, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DoctorRatingListProps {
    doctorId: string;
}

export const DoctorRatingList = ({ doctorId }: DoctorRatingListProps) => {
    const { data: ratings, isLoading, error } = useGetRatings({
        doctorId,
        status: 'APPROVED'
    });

    if (isLoading) {
        return <RatingListSkeleton />;
    }

    if (error) {
        return null; // Fail silently or show minimal error
    }

    if (!ratings || ratings.length === 0) {
        return (
            <div className="bg-card rounded-3xl p-10 border border-dashed border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Belum ada ulasan</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                    Jadilah yang pertama memberikan ulasan setelah kunjungan Anda selesai.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    Ulasan Pasien
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {ratings.length} Feedback
                    </span>
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {ratings.map((rating) => (
                    <RatingCard key={rating.id} rating={rating} />
                ))}
            </div>
        </div>
    );
};

const RatingCard = ({ rating }: { rating: RatingDto }) => {
    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                        {rating.user.image ? (
                            <AvatarImage src={rating.user.image} alt={rating.user.name} />
                        ) : (
                            <AvatarFallback className="bg-primary/5 text-primary text-lg font-bold">
                                {rating.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">{rating.user.name}</h4>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                <CheckCircle2 className="h-3 w-3" /> Pasien Terverifikasi
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(rating.createdAt), "dd MMMM yyyy", { locale: id })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-2xl">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">{rating.rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="pl-0 md:pl-16">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-4 py-1">
                    "{rating.comment || "Pasien tidak memberikan ulasan tertulis."}"
                </p>
            </div>
        </div>
    );
};

const RatingListSkeleton = () => {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48 rounded-full" />
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-card rounded-3xl p-6 border border-border">
                        <div className="flex items-center gap-4 mb-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
};
