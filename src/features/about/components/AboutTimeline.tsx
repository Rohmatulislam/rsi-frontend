"use client";

import { Calendar, Building, Award, Users, Heart, Sparkles, LucideIcon } from "lucide-react";
import { useGetMilestones, Milestone } from "../api/getMilestones";

// Icon mapping from string to Lucide component
const iconMap: Record<string, LucideIcon> = {
    Calendar,
    Building,
    Award,
    Users,
    Heart,
    Sparkles,
};

// Default milestones sebagai fallback jika API tidak mengembalikan data
const defaultMilestones: Milestone[] = [
    { id: "1", year: "1973", title: "Ide Awal Pendirian", description: "dr. Daldiri dari RS Sutomo mencetuskan gagasan pendirian Rumah Sakit Islam di Mataram kepada tokoh masyarakat.", icon: "Sparkles", highlight: false, order: 0 },
    { id: "2", year: "1974", title: "Pembentukan Panitia", description: "Gubernur NTB H.R. Wasita Kusumah memberikan mandat kepada H. Lalu Nuruddin untuk memimpin panitia pendirian.", icon: "Users", highlight: false, order: 1 },
    { id: "3", year: "1978", title: "Peletakan Batu Pertama", description: "Pembangunan fisik dimulai dengan peletakan batu pertama di lokasi yang telah disiapkan.", icon: "Building", highlight: false, order: 2 },
    { id: "4", year: "1985", title: "Soft Opening RSI", description: "RSI Siti Hajar mulai beroperasi dengan fasilitas terbatas untuk melayani masyarakat Mataram.", icon: "Heart", highlight: true, order: 3 },
    { id: "5", year: "1990", title: "Peresmian Resmi", description: "Rumah Sakit Islam Siti Hajar Mataram diresmikan secara penuh dengan berbagai fasilitas lengkap.", icon: "Award", highlight: true, order: 4 },
    { id: "6", year: "2000", title: "Akreditasi Pertama", description: "RSI Siti Hajar meraih akreditasi pertama sebagai bukti komitmen terhadap kualitas pelayanan.", icon: "Award", highlight: false, order: 5 },
    { id: "7", year: "2015", title: "Pengembangan Fasilitas", description: "Penambahan gedung baru dan modernisasi peralatan medis untuk meningkatkan kapasitas layanan.", icon: "Building", highlight: false, order: 6 },
    { id: "8", year: "2024", title: "Era Digital", description: "Implementasi sistem booking online, rekam medis elektronik, dan integrasi dengan SIMRS Khanza.", icon: "Sparkles", highlight: true, order: 7 },
];

export const AboutTimeline = () => {
    const { data: milestonesData } = useGetMilestones({});

    const milestones = milestonesData?.length ? milestonesData : defaultMilestones;

    return (
        <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm justify-center bg-primary/5 py-1 px-4 rounded-full mb-4">
                        <Calendar className="h-4 w-4" /> Perjalanan Waktu
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                        Milestone RSI Siti Hajar
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Perjalanan panjang dedikasi dan pelayanan kesehatan untuk masyarakat Mataram dan NTB.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Center Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 rounded-full hidden md:block"></div>

                    {/* Timeline Items */}
                    <div className="space-y-8 md:space-y-12">
                        {milestones.map((milestone, index) => {
                            const IconComponent = iconMap[milestone.icon] || Sparkles;
                            return (
                                <div
                                    key={milestone.id}
                                    className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                        }`}
                                >
                                    {/* Content Card */}
                                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                        <div
                                            className={`group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${milestone.highlight
                                                ? "bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-lg shadow-primary/10"
                                                : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-lg"
                                                }`}
                                        >
                                            {/* Year Badge */}
                                            <div
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-3 ${milestone.highlight
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                    }`}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                                {milestone.year}
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center Dot */}
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 z-10 hidden md:block ${milestone.highlight
                                            ? "bg-primary ring-4 ring-primary/30"
                                            : "bg-slate-300 dark:bg-slate-600"
                                            }`}
                                    ></div>

                                    {/* Empty Space for Alternating Layout */}
                                    <div className="flex-1 hidden md:block"></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* End Decoration */}
                    <div className="flex justify-center mt-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Terus Bertumbuh & Melayani
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
