import { Zap, UserCheck, Coffee, PhoneCall } from "lucide-react";
import { ServiceSection, ServiceGrid } from "~/features/services";

export const ExecutiveBenefits = () => {
    const benefits = [
        {
            icon: Zap,
            title: "Waktu Tunggu Efisien",
            description: "Prioritas waktu tunggu minimal dengan sistem appointment yang ketat dan terjadwal.",
        },
        {
            icon: UserCheck,
            title: "Privasi Eksklusif",
            description: "Ruang tunggu dan konsultasi yang didesain khusus untuk kenyamanan dan privasi Anda.",
        },
        {
            icon: Coffee,
            title: "Executive Lounge",
            description: "Nikmati fasilitas lounge premium dengan snack dan minuman selama menunggu giliran.",
        },
        {
            icon: PhoneCall,
            title: "Personal Assistant",
            description: "Pendampingan khusus mulai dari pendaftaran hingga pengambilan obat oleh staf kami.",
        },
    ];

    return (
        <ServiceSection
            title="Keunggulan Poli Executive"
            subtitle="Didesain untuk memenuhi kebutuhan Anda yang mengutamakan waktu dan kualitas pelayanan."
        >
            <ServiceGrid columns={4}>
                {benefits.map((benefit) => (
                    <div key={benefit.title} className="bg-card border border-border/60 p-8 rounded-3xl hover:border-amber-500/30 transition-all group shadow-sm hover:shadow-xl">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <benefit.icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                ))}
            </ServiceGrid>
        </ServiceSection>
    );
};
