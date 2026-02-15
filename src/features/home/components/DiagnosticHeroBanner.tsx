"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight, Activity, FlaskConical, ClipboardCheck } from "lucide-react";
import { Button } from "~/components/ui/button";

export const DiagnosticHeroBanner = () => {
    return (
        <section className="container mx-auto px-4 md:px-8 py-12">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-2xl shadow-emerald-900/40 group border border-ramadan-gold/20">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-islamic-pattern opacity-[0.05] pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-ramadan-gold/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full -ml-32 -mb-32 blur-2xl" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-14 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <ShoppingCart className="h-4 w-4 text-emerald-200" />
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-100">Layanan Baru</span>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Diagnostic Hub <br />
                                <span className="text-emerald-300">Satu Portal, Semua Tes.</span>
                            </h2>
                            <p className="text-lg text-emerald-100 max-w-lg leading-relaxed font-medium">
                                Pesan paket MCU, tes Laboratorium, dan Radiologi secara bersamaan dalam satu keranjang belanja. Hasil digital langsung ke genggaman Anda.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-black shadow-xl shadow-black/20 group/btn"
                                asChild
                            >
                                <Link href="/layanan/diagnostic-hub">
                                    Mulai Sekarang
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex -space-x-3 items-center ml-2">
                                <div className="h-10 w-10 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center shadow-lg">
                                    <ClipboardCheck className="h-5 w-5 text-white" />
                                </div>
                                <div className="h-10 w-10 rounded-full bg-teal-400 border-2 border-white flex items-center justify-center shadow-lg">
                                    <FlaskConical className="h-5 w-5 text-white" />
                                </div>
                                <div className="h-10 w-10 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center shadow-lg">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <span className="pl-6 text-sm font-bold text-emerald-200 uppercase tracking-widest">MCU • LAB • RAD</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-bold text-xl">Health Basket</h4>
                                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-sm">3</div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: "Paket Premium Executive", type: "MCU", price: "Rp 1.500.000" },
                                    { name: "Cek Kolesterol Lengkap", type: "LAB", price: "Rp 250.000" },
                                    { name: "Rontgen Thorax", type: "RADIO", price: "Rp 350.000" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold">{item.name}</p>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-300">{item.type}</p>
                                        </div>
                                        <p className="text-sm font-black">{item.price}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                <p className="text-sm font-bold opacity-60">Total Estimasi</p>
                                <p className="text-2xl font-black">Rp 2.100.000</p>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-6 -left-6 bg-amber-400 text-amber-950 px-4 py-2 rounded-xl font-black text-xs shadow-xl animate-bounce">
                            HASIL DIGITAL 24 JAM
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
