import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDisplayPoliName, normalizePoliName } from "~/lib/utils/naming";
import { ExecutivePoliSkeleton } from "./ExecutivePoliSkeleton";

interface ExecutiveClinicsGridProps {
    items: any[];
    isLoading?: boolean;
}

export const ExecutiveClinicsGrid = ({ items, isLoading }: ExecutiveClinicsGridProps) => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-border/40">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <Badge className="mb-4 bg-amber-500 text-white border-none uppercase tracking-widest px-4">Spesialisasi Tersedia</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Poliklinik Eksekutif</h2>
                        <p className="text-muted-foreground">Berbagai pilihan poli kini tersedia dengan standar pelayanan eksekutif untuk janji temu yang lebih fleksibel.</p>
                    </div>
                    <Button variant="outline" className="rounded-full border-amber-500/30 text-amber-600 hover:bg-amber-500 hover:text-white transition-all px-8" asChild>
                        <Link href="/doctors?type=executive">
                            Lihat Semua Jadwal <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <ExecutivePoliSkeleton key={i} />
                        ))
                    ) : items.filter(item => item.isActive).map((item, idx) => {
                        const normalizedName = formatDisplayPoliName(item.name);
                        const baseSpecialty = normalizePoliName(item.name);
                        return (
                            <div key={item.id} className="bg-card border border-border/40 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:border-amber-500/20 transition-all group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[5rem] -mr-8 -mt-8" />

                                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 font-black text-xl italic group-hover:bg-amber-500 group-hover:text-white transition-all">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">{normalizedName}</h3>
                                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                                    {item.description || `Layanan unggulan spesialis ${normalizedName} dengan waktu konsultasi yang lebih luas dan pendampingan personal.`}
                                </p>

                                <div className="space-y-3">
                                    <Button className="w-full bg-slate-900 hover:bg-amber-600 text-white rounded-xl h-12 shadow-lg transition-all" variant="default" asChild>
                                        <Link href={`/doctors?specialty=${encodeURIComponent(baseSpecialty)}&type=executive`}>
                                            Booking Sekarang
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-amber-600 transition-colors" asChild>
                                        <Link href={`/layanan/poli/${item.id}`}>
                                            Detail Layanan Klinik
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
