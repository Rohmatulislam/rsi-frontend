import React from "react";
import { ServiceGrid } from "~/features/services";

interface Facility {
    icon: React.ElementType;
    title: string;
    description: string;
}

interface GeneralFacilitiesProps {
    facilities: Facility[];
}

export const GeneralFacilities: React.FC<GeneralFacilitiesProps> = ({ facilities }) => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Penunjang</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Tersedia bagi seluruh pasien rawat inap untuk menunjang kenyamanan dan proses pemulihan.
                    </p>
                </div>
                <ServiceGrid columns={3}>
                    {facilities.map((facility) => (
                        <div key={facility.title} className="flex items-center gap-6 bg-card border border-border/40 rounded-[1.5rem] p-7 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                <facility.icon className="h-7 w-7" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">{facility.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{facility.description}</p>
                            </div>
                        </div>
                    ))}
                </ServiceGrid>
            </div>
        </section>
    );
};
