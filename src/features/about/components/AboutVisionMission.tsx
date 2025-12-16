"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Target, Award } from "lucide-react";
import { useGetVision, useGetMission } from "../api/getAboutContent";

const defaultVision = "Menjadi Rumah Sakit Syariah Pilihan Utama Masyarakat dengan Pelayanan Profesional dan Islami di Nusa Tenggara Barat.";

const defaultMission = [
    "Menyelenggarakan pelayanan kesehatan yang paripurna, bermutu, dan terjangkau.",
    "Mewujudkan sumber daya manusia yang profesional, amanah, dan berkarakter Islami.",
    "Menyediakan sarana dan prasarana yang modern, nyaman, dan ramah lingkungan.",
    "Mengembangkan tata kelola rumah sakit yang transparan, akuntabel, dan berkelanjutan.",
    "Berperan aktif dalam meningkatkan derajat kesehatan masyarakat melalui dakwah bil hal."
];

export const AboutVisionMission = () => {
    const { data: visionData } = useGetVision();
    const { data: missionData } = useGetMission();

    const visi = visionData?.value || defaultVision;

    // Parse mission JSON or use default
    let misi = defaultMission;
    if (missionData?.value) {
        try {
            misi = JSON.parse(missionData.value);
        } catch {
            misi = defaultMission;
        }
    }

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Visi */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
                            <Target className="h-4 w-4" /> Visi Kami
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Menjadi Destinasi Kesehatan <br />
                            <span className="text-primary">Terpercaya & Syariah</span>
                        </h2>
                        <Card className="bg-slate-50 dark:bg-slate-950 border-none shadow-lg">
                            <CardContent className="p-8">
                                <p className="text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                                    &quot;{visi}&quot;
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Misi */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
                            <Award className="h-4 w-4" /> Misi Kami
                        </div>
                        <div className="grid gap-4">
                            {misi.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
