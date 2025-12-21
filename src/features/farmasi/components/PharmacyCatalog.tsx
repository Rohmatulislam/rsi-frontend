"use client";

import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ServiceDetail } from "../services/farmasiService";

interface PharmacyCatalogProps {
    services: ServiceDetail[];
    onSelectService: (service: ServiceDetail) => void;
}

export const PharmacyCatalog = ({ services, onSelectService }: PharmacyCatalogProps) => {
    return (
        <section>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Katalog Layanan</h2>
                    <p className="text-muted-foreground">Fasilitas farmasi unggulan untuk menunjang kebutuhan Anda.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                    <div key={idx} className="group bg-card border rounded-[2rem] p-8 hover:shadow-xl transition-all border-slate-100 hover:border-primary/20">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all`}>
                            <service.icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            {service.description}
                        </p>
                        <Button
                            variant="ghost"
                            className="p-0 h-auto font-bold text-primary gap-2 group-hover:translate-x-1 transition-transform"
                            onClick={() => onSelectService(service)}
                        >
                            Selengkapnya <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};
