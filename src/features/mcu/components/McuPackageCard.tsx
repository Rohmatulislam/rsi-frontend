"use client";

import { Database, CheckCircle2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { McuPackage } from "../services/mcuService";
import { McuBookingModal } from "./McuBookingModal";
import { AppointmentBookingModal } from "~/features/appointment/components/AppointmentBookingModal";

interface McuPackageCardProps {
    pkg: any; // Accept both McuPackage and ServiceItemDto
    isPopular?: boolean;
    isFromKhanza?: boolean;
}

export const McuPackageCard = ({ pkg, isPopular = false, isFromKhanza = false }: McuPackageCardProps) => {
    const features = pkg.features ? pkg.features.split(',') : [];

    return (
        <div
            className={`group relative bg-card border rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl overflow-hidden flex flex-col ${isPopular ? "border-primary shadow-xl md:scale-105 z-10" : "border-border/60 hover:border-primary/30"
                }`}
        >
            {isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg">
                    {isFromKhanza ? "Terpopuler" : "PILIHAN UTAMA"}
                </div>
            )}

            <div className="mb-8">
                {isFromKhanza && (
                    <Badge variant="outline" className="mb-4 border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        <Database className="h-3 w-3 mr-1.5" /> Synchronized
                    </Badge>
                )}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {isFromKhanza ? "Paket pemeriksaan kesehatan terstandarisasi SIMRS RSI Siti Hajar." : pkg.description}
                </p>
            </div>

            <div className="mb-10 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1 opacity-60">Estimasi Biaya</p>
                <p className="text-4xl font-black text-primary">
                    {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                </p>
            </div>

            {!isFromKhanza && features.length > 0 && (
                <div className="space-y-4 mb-10 flex-grow">
                    {features.slice(0, 5).map((feature: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{feature.trim()}</span>
                        </div>
                    ))}
                    {features.length > 5 && (
                        <p className="text-xs text-primary font-bold pl-8">+{features.length - 5} Pemeriksaan Lainnya</p>
                    )}
                </div>
            )}

            {isFromKhanza ? (
                <McuBookingModal
                    package={pkg}
                    trigger={
                        <Button
                            className={`w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all ${isPopular ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-slate-900 hover:bg-primary shadow-slate-200"
                                }`}
                        >
                            Pilih Paket Ini
                        </Button>
                    }
                />
            ) : (
                <AppointmentBookingModal
                    serviceItem={{ id: pkg.id, name: pkg.name }}
                    initialPoliId="mcu"
                    trigger={
                        <Button className={`w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all ${isPopular ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-slate-900 hover:bg-primary shadow-slate-200"
                            }`}>
                            Booking Sekarang
                        </Button>
                    }
                />
            )}
        </div>
    );
};
