"use client";

import { Info, Clock, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export const McuInfoSection = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Informasi Pemeriksaan</h2>
                        <div className="space-y-6">
                            <div className="flex gap-6 p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                                    <Info className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Persiapan Puasa</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Pasien diharapkan berpuasa selama 10-12 jam sebelum pengambilan darah (hanya diperbolehkan minum air putih).</p>
                                </div>
                            </div>
                            <div className="flex gap-6 p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Jam Kedatangan</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Layanan MCU tersedia setiap Senin - Sabtu mulai pukul 07.30 - 12.00 WITA untuk pendaftaran.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary/5 rounded-[3rem] p-10 md:p-14 border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10" />
                        <h3 className="text-2xl font-bold mb-6">Paket Perusahaan?</h3>
                        <p className="text-muted-foreground mb-8 leading-relaxed">Dapatkan penawaran khusus untuk pemeriksaan kesehatan karyawan (Annual Medical Checkup) dengan fasilitas Mobile Lab atau pemeriksaan On-Site.</p>
                        <Button className="rounded-xl h-14 px-8 font-bold" variant="default" asChild>
                            <a href="https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang paket MCU Corporate">
                                Hubungi Tim Corporate <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
