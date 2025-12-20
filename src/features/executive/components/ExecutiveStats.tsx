import { Crown, Gem, Award } from "lucide-react";

export const ExecutiveStats = () => {
    const stats = [
        { icon: Crown, label: "Layanan Prioritas", desc: "Penanganan tercepat untuk Anda" },
        { icon: Gem, label: "Fasilitas Mewah", desc: "Standar kenyamanan hotel berbintang" },
        { icon: Award, label: "Dokter Senior", desc: "Konsultasi dengan pakar spesialis" },
    ];

    return (
        <div className="container mx-auto px-4 -mt-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((item, idx) => (
                    <div key={idx} className="bg-card border-none shadow-2xl rounded-[2rem] p-8 flex items-center gap-6 group hover:bg-slate-900 hover:text-white transition-all duration-500">
                        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <item.icon className="h-7 w-7" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{item.label}</h4>
                            <p className="text-sm text-muted-foreground group-hover:text-amber-200/60">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
