"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
    CheckCircle2,
    ArrowRight,
    MessageCircle,
    Info,
    LucideIcon
} from "lucide-react";
import { cn } from "~/lib/utils";
import { ServiceDetail } from "../services/farmasiService";

export type { ServiceDetail };

interface ServiceDetailModalProps {
    service: ServiceDetail | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ServiceDetailModal = ({
    service,
    isOpen,
    onClose
}: ServiceDetailModalProps) => {
    if (!service) return null;

    const Icon = service.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-[2.5rem]">
                {/* Header with Background Pattern */}
                <div className={cn(
                    "p-8 text-white relative overflow-hidden",
                    service.color === "primary" ? "bg-primary" :
                        service.color === "success" ? "bg-emerald-600" :
                            service.color === "accent" ? "bg-amber-500" : "bg-purple-600"
                )}>
                    <div className="relative z-10">
                        <DialogHeader>
                            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
                                <Icon className="h-7 w-7 text-white" />
                            </div>
                            <DialogTitle className="text-3xl font-bold text-white">{service.title}</DialogTitle>
                            <DialogDescription className="text-white/80 mt-2 text-base leading-relaxed">
                                {service.description}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl" />
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Long Description */}
                    <section className="space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-xs">
                            <Info className="h-4 w-4 text-primary" /> Tentang Layanan
                        </h4>
                        <p className="text-slate-600 leading-relaxed italic">
                            "{service.longDescription}"
                        </p>
                    </section>

                    {/* Features/Benefits */}
                    <section className="space-y-4">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Keunggulan & Fitur</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 italic">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <DialogFooter className="p-8 pt-0 border-t bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
                        {service.whatsappText && (
                            <Button
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl font-bold border-slate-200 hover:bg-white hover:text-green-600 transition-all gap-2"
                                asChild
                            >
                                <a href={`https://wa.me/6281234567890?text=${encodeURIComponent(service.whatsappText)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-5 w-5" /> Tanya Apoteker
                                </a>
                            </Button>
                        )}
                        {service.ctaText && service.ctaAction && (
                            <Button
                                className="flex-1 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 gap-2"
                                onClick={() => {
                                    onClose();
                                    service.ctaAction?.();
                                }}
                            >
                                {service.ctaText} <ArrowRight className="h-5 w-5" />
                            </Button>
                        )}
                        {!service.ctaText && (
                            <Button
                                className="flex-1 h-14 rounded-2xl font-bold"
                                onClick={onClose}
                            >
                                Mengerti
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
