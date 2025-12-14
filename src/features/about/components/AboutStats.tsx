"use client";

import { History, Stethoscope, Building2, Clock } from "lucide-react";

const stats = [
    { label: "Tahun Mengabdi", value: "19+", icon: History },
    { label: "Dokter Spesialis", value: "50+", icon: Stethoscope },
    { label: "Kapasitas Bed", value: "150+", icon: Building2 },
    { label: "Layanan 24 Jam", value: "IGD", icon: Clock },
];

export const AboutStats = () => {
    return (
        <section className="container mx-auto px-4 -mt-16 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-2">
                        <stat.icon className="h-8 w-8 text-primary mb-2" />
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
