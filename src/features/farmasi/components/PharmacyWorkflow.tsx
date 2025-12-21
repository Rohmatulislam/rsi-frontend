"use client";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Step {
    title: string;
    desc: string;
    icon: LucideIcon;
}

interface PharmacyWorkflowProps {
    steps: Step[];
    onOpenModal: () => void;
}

export const PharmacyWorkflow = ({ steps, onOpenModal }: PharmacyWorkflowProps) => {
    return (
        <div className="container mx-auto px-4 -mt-12 relative z-10 mb-20">
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <Badge className="mb-4 bg-primary text-primary-foreground border-none">Workflow Digital</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">Alur Layanan Farmasi</h2>
                    </div>
                    <Button
                        onClick={onOpenModal}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 px-8 font-bold text-lg gap-2 shadow-lg shadow-primary/20"
                    >
                        <Upload className="h-5 w-5" /> Kirim Resep Sekarang
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative">
                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-full w-full h-[1px] bg-white/20 -translate-x-12 z-0" />
                            )}
                            <div className="relative z-10 flex flex-col">
                                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/5 shadow-inner group hover:bg-primary transition-colors cursor-default">
                                    <step.icon className="h-7 w-7 text-primary group-hover:text-white" />
                                </div>
                                <h4 className="font-bold text-xl mb-2">{idx + 1}. {step.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
