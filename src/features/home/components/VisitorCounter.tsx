"use client";

import { useEffect, useRef } from "react";
import { useGetStats, useTrackVisit } from "../api/useStats";
import { Users, Activity, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";

export const VisitorCounter = ({ className }: { className?: string }) => {
    const { data: stats, isLoading } = useGetStats();
    const trackVisit = useTrackVisit();
    const tracked = useRef(false);

    useEffect(() => {
        // Only track once per component mount (page load)
        if (!tracked.current) {
            trackVisit.mutate();
            tracked.current = true;
        }
    }, []);

    if (isLoading && !stats) {
        return (
            <div className={cn("inline-flex items-center gap-2 text-slate-400 animate-pulse", className)}>
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Memuat statistik...</span>
            </div>
        );
    }

    return (
        <div className={cn("inline-flex flex-col gap-1", className)}>
            <div className="flex items-center gap-2 text-slate-300">
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                    <Users className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Total Pengunjung
                    </span>
                    <span className="text-lg font-black text-white tabular-nums leading-none">
                        {stats?.visitorCount?.toLocaleString('id-ID') || 0}
                    </span>
                </div>
            </div>

            {/* Optional: Simple trend indicator */}
            <div className="flex items-center gap-1 text-[9px] text-green-500 font-medium ml-8">
                <TrendingUp className="h-2.5 w-2.5" />
                <span>Live Tracking</span>
            </div>
        </div>
    );
};
