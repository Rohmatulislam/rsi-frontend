"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export const RamadanImsakiyahWidget = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isMounted || !currentTime) {
        return <div className="h-[200px] w-full bg-emerald-900/20 animate-pulse rounded-3xl" />; // Simple placeholder
    }

    const imsakiyah = {
        imsak: "04:52",
        subuh: "05:02",
        dzuhur: "12:32",
        ashar: "15:45",
        maghrib: "18:38",
        isya: "19:48",
    };

    const getNextTime = () => {
        const now = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
        const times = Object.entries(imsakiyah).map(([label, time]) => {
            const [h, m] = time.split(":").map(Number);
            return { label, seconds: h * 3600 + m * 60 };
        });

        const next = times.find(t => t.seconds > now) || times[0];
        const diff = next.seconds > now ? next.seconds - now : (24 * 3600 - now) + next.seconds;

        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;

        return {
            label: next.label,
            countdown: `${h > 0 ? h + 'j ' : ''}${m}m ${s}s`,
            isSoon: diff < 3600 // Less than 1 hour
        };
    };

    const nextPrayer = getNextTime();

    const timeString = currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Makassar'
    });

    return (
        <Card className="border-none bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-islamic-pattern opacity-[0.07] mix-blend-overlay" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-ramadan-gold/10 blur-[100px] rounded-full pointer-events-none" />

            <CardContent className="p-6 md:p-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-ramadan-gold/20 border border-ramadan-gold/30 rounded-full">
                                <span className="text-[10px] font-black text-ramadan-gold-light uppercase tracking-[0.2em]">Mataram, NTB</span>
                            </div>
                            {nextPrayer.isSoon && (
                                <div className="animate-pulse flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-ramadan-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                                    <span className="text-[10px] font-bold text-ramadan-gold">Menuju {nextPrayer.label}</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Jadwal Imsakiyah</h3>
                        <div className="flex items-center gap-3">
                            <p className="text-emerald-100/60 text-sm font-medium">1 Ramadan 1447 H</p>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <p className="text-emerald-100/60 text-sm font-medium">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>
                    </div>

                    <div className="flex-1 max-w-4xl">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center justify-center lg:justify-end gap-3 md:gap-4">
                            <TimeItem label="Imsak" time={imsakiyah.imsak} icon={<Moon size={16} />} isNext={nextPrayer.label === 'imsak'} />
                            <TimeItem label="Subuh" time={imsakiyah.subuh} icon={<Sun size={16} />} isNext={nextPrayer.label === 'subuh'} />
                            <TimeItem label="Dzuhur" time={imsakiyah.dzuhur} icon={<Sun size={16} />} isNext={nextPrayer.label === 'dzuhur'} />
                            <TimeItem label="Ashar" time={imsakiyah.ashar} icon={<Sun size={16} />} isNext={nextPrayer.label === 'ashar'} />
                            <TimeItem label="Maghrib" time={imsakiyah.maghrib} icon={<Moon size={16} />} isNext={nextPrayer.label === 'maghrib'} isMaghrib />
                            <TimeItem label="Isya" time={imsakiyah.isya} icon={<Moon size={16} />} isNext={nextPrayer.label === 'isya'} />
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
                        <div className="space-y-0.5">
                            <div className="text-4xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{timeString}</div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-[10px] font-black text-ramadan-gold uppercase tracking-widest">WITA</span>
                            </div>
                        </div>
                        <div className="text-right lg:mt-2">
                            <div className="text-[10px] font-black text-emerald-300/50 uppercase tracking-tighter">Selanjutnya: {nextPrayer.label}</div>
                            <div className="text-lg font-black text-white tabular-nums">{nextPrayer.countdown}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const TimeItem = ({ label, time, icon, isNext, isMaghrib }: {
    label: string,
    time: string,
    icon: React.ReactNode,
    isNext?: boolean,
    isMaghrib?: boolean
}) => (
    <div className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-700 min-w-[85px] relative group/item ${isNext
        ? "bg-white/10 ring-1 ring-ramadan-gold/50 shadow-[0_0_30px_-5px_rgba(212,175,55,0.3)] scale-110 z-10"
        : "hover:bg-white/5"
        }`}>
        {isNext && (
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ramadan-gold animate-ping" />
        )}
        <span className={`text-[10px] font-black uppercase tracking-widest mb-2 transition-colors duration-500 ${isNext ? "text-ramadan-gold" : "text-emerald-200/30"
            }`}>
            {label}
        </span>
        <div className="flex items-center gap-2">
            <span className={`transition-all duration-500 ${isNext ? "text-ramadan-gold-light scale-110" : "text-white/20 group-hover/item:text-white/40"}`}>{icon}</span>
            <span className={`text-xl font-black tabular-nums tracking-tighter transition-all duration-500 ${isMaghrib ? "text-ramadan-gold" : isNext ? "text-white" : "text-white/60"}`}>
                {time}
            </span>
        </div>
    </div>
);
