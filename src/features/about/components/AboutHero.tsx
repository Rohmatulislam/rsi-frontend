"use client";

import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import heroImage from "~/assets/baner.webp";

export const AboutHero = () => {
    return (
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center">
            <Image
                src={heroImage}
                alt="RSI Siti Hajar Mataram"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-slate-900/70" />
            <div className="relative container mx-auto px-4 z-10 text-center">
                <Badge className="mb-4 bg-primary/20 text-primary-foreground hover:bg-primary/30 text-lg py-1 px-4 border-none backdrop-blur-sm">
                    TENTANG KAMI
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Mengabdi dengan Hati,<br />
                    <span className="text-primary">
                        Melayani dengan Syariah
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                    Rumah Sakit Islam Siti Hajar Mataram hadir sebagai solusi kesehatan terpercaya
                    yang memadukan kecanggihan teknologi medis dengan nilai-nilai Islami.
                </p>
            </div>
        </section>
    );
};
