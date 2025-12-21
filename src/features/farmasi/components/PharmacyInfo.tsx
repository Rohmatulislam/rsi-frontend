"use client";

import { MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

export const PharmacyInfo = () => {
    return (
        <div className="bg-card border rounded-[2.5rem] p-10 shadow-sm sticky top-28">
            <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-8">
                <MapPin className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Lokasi & Kontak</h3>
            <div className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Penempatan</p>
                    <p className="font-semibold text-slate-700 leading-relaxed">
                        Lantai 1, Samping Lobby Utama (Gedung A)<br />
                        Tersedia Akses Drive-Thru
                    </p>
                </div>
                <div className="h-[1px] bg-slate-100" />
                <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Jam Operasional</p>
                    <div className="flex items-center gap-3 text-slate-700 font-bold text-lg">
                        <Clock className="h-5 w-5 text-green-600" /> 24 JAM / 7 HARI
                    </div>
                </div>
                <div className="h-[1px] bg-slate-100" />
                <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Hotline Resep</p>
                    <p className="font-black text-2xl text-slate-900 tracking-tight">0812-3456-7890</p>
                    <p className="text-xs text-muted-foreground mt-1">Konsultasi obat & cek antrean</p>
                </div>
            </div>

            <Button variant="outline" className="w-full mt-10 h-14 rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary/5" asChild>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp Apoteker
                </a>
            </Button>
        </div>
    );
};
