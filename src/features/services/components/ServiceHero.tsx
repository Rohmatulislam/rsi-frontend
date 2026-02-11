"use client";

import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import heroImage from "~/assets/baner.webp";

interface ServiceHeroProps {
    badge: string;
    title: string;
    subtitle?: string;
    highlightText?: string;
    backgroundImage?: string;
}

export const ServiceHero = ({
    badge,
    title,
    subtitle,
    highlightText,
    backgroundImage,
}: ServiceHeroProps) => {
    return (
        <section className="relative w-full h-[350px] md:h-[450px] overflow-hidden flex items-center justify-center">
            <Image
                src={backgroundImage || heroImage}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                unoptimized
            />
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative container mx-auto px-4 z-10 text-center">
                <Badge className="mb-4 bg-primary/20 text-primary-foreground hover:bg-primary/30 text-sm md:text-base py-1 px-4 border-none backdrop-blur-sm shadow-sm">
                    {badge}
                </Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    {title}
                    {highlightText && (
                        <>
                            <br />
                            <span className="text-primary">{highlightText}</span>
                        </>
                    )}
                </h1>
                {subtitle && (
                    <p className="text-base md:text-lg text-white font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};
