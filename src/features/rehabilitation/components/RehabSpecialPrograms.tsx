"use client";

import { Badge } from "~/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { Specialty } from "../services/rehabilitationService";

interface RehabSpecialProgramsProps {
    specialties: Specialty[];
}

export const RehabSpecialPrograms = ({ specialties }: RehabSpecialProgramsProps) => {
    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-5">
                        <Badge className="bg-primary text-white border-none mb-6">RS Standard Modern</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Program Khusus & Berkelanjutan</h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Kami menyediakan program rehabilitasi yang dirancang khusus sesuai dengan kebutuhan klinis pasien pasca perawatan intensif di rumah sakit.
                        </p>
                        <div className="space-y-6">
                            {[
                                "Peralatan Terapi Robotik (Segera)",
                                "E-Evaluasi Progres Pasien (Mobile App)",
                                "Terapi Komunitas Pasca Stroke",
                                "Tele-Rehab Consultation"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {specialties.map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/20 transition-colors">
                                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
