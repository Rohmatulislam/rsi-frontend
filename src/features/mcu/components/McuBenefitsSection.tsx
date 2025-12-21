"use client";

import { Shield, Heart, FileCheck, Clock } from "lucide-react";

const benefits = [
    {
        icon: Shield,
        title: "Deteksi Dini",
        description: "Mengidentifikasi faktor risiko kesehatan sebelum berkembang menjadi penyakit serius.",
        color: "primary" as const,
    },
    {
        icon: Heart,
        title: "Kesehatan Optimal",
        description: "Memastikan seluruh fungsi organ vital Anda bekerja dengan performa terbaik.",
        color: "rose" as const,
    },
    {
        icon: FileCheck,
        title: "Rekam Medis",
        description: "Memiliki riwayat kesehatan yang terperinci sebagai referensi medis masa depan.",
        color: "success" as const,
    },
    {
        icon: Clock,
        title: "Efisiensi Waktu",
        description: "Seluruh rangkaian pemeriksaan dilakukan dalam satu lokasi dan waktu yang terjadwal.",
        color: "accent" as const,
    },
];

export const McuBenefitsSection = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-card border border-border/60 rounded-3xl p-8 hover:shadow-xl transition-all group hover:-translate-y-1">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                        <benefit.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
            ))}
        </div>
    );
};
