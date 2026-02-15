"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export const RamadanImsakiyahWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Mock data for Mataram area (WITA)
    const imsakiyah = {
        imsak: "04:52",
        subuh: "05:02",
        dzuhur: "12:32",
        ashar: "15:45",
        maghrib: "18:38",
        isya: "19:48",
    };

    const timeString = currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Makassar'
    });

    return (
        <Card className="border-none bg-gradient-to-br from-emerald-900 to-emerald-800 text-white shadow-2xl overflow-hidden relative group">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-islamic-pattern opacity-10" />

            <CardContent className="p-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-ramadan-gold-light">
                            <MapPin size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mataram, NTB</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">Jadwal Imsakiyah</h3>
                        <p className="text-emerald-100/60 text-xs font-medium">1 Ramadan 1447 H • {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center gap-4">
                        <TimeItem label="Imsak" time={imsakiyah.imsak} icon={<Moon size={16} />} isHighlighted />
                        <TimeItem label="Subuh" time={imsakiyah.subuh} icon={<Sun size={16} />} />
                        <TimeItem label="Dzuhur" time={imsakiyah.dzuhur} icon={<Sun size={16} />} />
                        <TimeItem label="Ashar" time={imsakiyah.ashar} icon={<Sun size={16} />} />
                        <TimeItem label="Maghrib" time={imsakiyah.maghrib} icon={<Moon size={16} />} isHighlighted isMaghrib />
                        <TimeItem label="Isya" time={imsakiyah.isya} icon={<Moon size={16} />} />
                    </div>

                    <div className="hidden lg:flex flex-col items-end">
                        <div className="text-4xl font-black text-white/20 tracking-tighter tabular-nums">{timeString}</div>
                        <span className="text-[10px] font-black text-ramadan-gold uppercase tracking-widest">WITA</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const TimeItem = ({ label, time, icon, isHighlighted, isMaghrib }: {
    label: string,
    time: string,
    icon: React.ReactNode,
    isHighlighted?: boolean,
    isMaghrib?: boolean
}) => (
    <div className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-500 ${isHighlighted
        ? "bg-white/15 ring-2 ring-ramadan-gold ring-offset-2 ring-offset-emerald-900 shadow-2xl shadow-ramadan-gold/20 scale-110 z-10 ramadan-glow"
        : "hover:bg-white/10"
        }`}>
        <span className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isHighlighted ? "text-ramadan-gold shadow-sm" : "text-emerald-200/40"
            }`}>
            {label}
        </span>
        <div className="flex items-center gap-2">
            <span className={`transition-colors duration-300 ${isHighlighted ? "text-ramadan-gold-light" : "text-white/30"}`}>{icon}</span>
            <span className={`text-xl font-black tabular-nums tracking-tight ${isMaghrib ? "text-ramadan-gold" : "text-white"}`}>
                {time}
            </span>
        </div>
    </div>
);
