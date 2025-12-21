"use client";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";
import { JourneyStep } from "../services/rehabilitationService";

interface RehabJourneyProps {
    steps: JourneyStep[];
}

export const RehabJourney = ({ steps }: RehabJourneyProps) => {
    return (
        <div className="container mx-auto px-4 -mt-16 relative z-10 mb-28">
            <div className="bg-white dark:bg-slate-900 border rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-full -mr-20 hidden lg:block" />

                <div className="relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-none px-4 py-1 font-bold">Patient Journey</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Alur Layanan Kami</h2>
                        <p className="text-muted-foreground text-lg">
                            Proses rehabilitasi yang terstruktur memastikan setiap pasien mendapatkan penanganan yang tepat sasaran.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        {/* Connector line for large screens */}
                        <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 shadow-xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform bg-gradient-to-br from-white to-slate-50">
                                    <step.icon className="h-10 w-10" />
                                </div>
                                <h4 className="font-bold text-xl mb-3 tracking-tight">{step.title}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-center gap-8">
                        <AppointmentBookingModal
                            initialPoliId="rehab-medik"
                            trigger={
                                <Button size="lg" className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-lg font-bold gap-3 shadow-xl shadow-primary/20">
                                    Jadwalkan Asesmen <ArrowRight className="h-5 w-5" />
                                </Button>
                            }
                        />
                        <div className="flex items-center gap-3 font-bold text-slate-500">
                            <Clock className="h-5 w-5 text-blue-500" /> Estimasi Asesmen: 30-45 Menit
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
