"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Heart, CheckCircle2, Users, Target } from "lucide-react";

const values = [
    {
        icon: Heart,
        title: "Ikhlas",
        description: "Melayani dengan ketulusan hati semata-mata mengharap ridho Allah SWT."
    },
    {
        icon: CheckCircle2,
        title: "Profesional",
        description: "Bekerja sesuai kompetensi, standar prosedur, dan kode etik profesi."
    },
    {
        icon: Users,
        title: "Ukhuwah",
        description: "Mengutamakan kebersamaan, kerjasama, dan persaudaraan dalam bekerja."
    },
    {
        icon: Target,
        title: "Istiqomah",
        description: "Konsisten dalam kebaikan dan perbaikan berkelanjutan (continuous improvement)."
    }
];

export const AboutValues = () => {
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
                    {values.map((val, idx) => (
                        <Card key={idx} className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300 bg-white dark:bg-slate-900">
                            <CardContent className="p-6 text-center space-y-4 pt-8">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <val.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">{val.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {val.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
