"use client";

import { ServiceSection } from "~/features/services";
import { TherapyService } from "../services/rehabilitationService";

interface RehabTherapyCatalogProps {
    services: TherapyService[];
}

export const RehabTherapyCatalog = ({ services }: RehabTherapyCatalogProps) => {
    return (
        <ServiceSection
            title="Layanan Terapi Unggulan"
            subtitle="Dukungan alat modern dan terapis berpengalaman untuk berbagai kebutuhan rehabilitasi."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service) => (
                    <div key={service.title} className="group bg-card border hover:border-primary/20 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all hover:-translate-y-2">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                            {typeof service.icon === 'string' ? (
                                <span className="text-2xl font-bold">{service.icon}</span>
                            ) : (
                                <service.icon className="h-8 w-8" />
                            )}
                        </div>
                        <h4 className="text-xl font-bold mb-4">{service.title}</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                    </div>
                ))}
            </div>
        </ServiceSection>
    );
};
