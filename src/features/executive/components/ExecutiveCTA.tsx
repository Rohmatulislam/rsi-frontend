import { PhoneCall } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export const ExecutiveCTA = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-500/5 blur-[120px] rounded-full" />

                    <div className="relative text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 italic">Pengalaman Medis Yang Berbeda</h2>
                        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                            Kami percaya bahwa kenyamanan psikologis adalah bagian dari penyembuhan.
                            Tim concierge kami siap mengatur seluruh rangkaian kunjungan Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-10 h-16 text-lg font-bold" asChild>
                                <a href="https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang layanan Poli Executive">
                                    <PhoneCall className="mr-3 h-6 w-6" /> Hubungi Concierge
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-2xl border-white/20 text-white hover:bg-white/10 px-10 h-16 text-lg" asChild>
                                <Link href="/doctors">
                                    Eksplor Dokter Kami
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
