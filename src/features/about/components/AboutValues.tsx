"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Heart, CheckCircle2, Users, Target, LucideIcon } from "lucide-react";
import { useGetCoreValues, CoreValue } from "../api/getCoreValues";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Heart,
    CheckCircle2,
    Users,
    Target,
};

const defaultValues: CoreValue[] = [
    { id: "1", title: "Ikhlas", description: "Melayani dengan ketulusan hati semata-mata mengharap ridho Allah SWT.", icon: "Heart", order: 0 },
    { id: "2", title: "Profesional", description: "Bekerja sesuai kompetensi, standar prosedur, dan kode etik profesi.", icon: "CheckCircle2", order: 1 },
    { id: "3", title: "Ukhuwah", description: "Mengutamakan kebersamaan, kerjasama, dan persaudaraan dalam bekerja.", icon: "Users", order: 2 },
    { id: "4", title: "Istiqomah", description: "Konsisten dalam kebaikan dan perbaikan berkelanjutan (continuous improvement).", icon: "Target", order: 3 },
];

export const AboutValues = () => {
    const { data: valuesData } = useGetCoreValues({});

    const values = valuesData?.length ? valuesData : defaultValues;

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge variant="outline" className="mb-4">CORE VALUES</Badge>
                    <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Utama RSI Siti Hajar</h2>
                    <p className="text-muted-foreground">
                        Kami berpegang teguh pada nilai-nilai dasar yang menjadi landasan dalam setiap pelayanan yang kami berikan kepada masyarakat.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((val) => {
                        const IconComponent = iconMap[val.icon] || Heart;
                        return (
                            <Card key={val.id} className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300 bg-white dark:bg-slate-900">
                                <CardContent className="p-6 text-center space-y-4 pt-8">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">{val.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {val.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
