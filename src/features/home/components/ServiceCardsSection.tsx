"use client";
import Link from "next/link";
import {
    Stethoscope,
    Star,
    Crown,
    Activity,
    FlaskConical,
    ScanLine,
    BedDouble,
    Heart,
    Shield,
    FileCheck,
    Clock
} from "lucide-react";
import { useGetServices } from "~/features/services/api/getServices";
import { useTranslations } from "next-intl";
import { ServiceCardSkeleton } from "~/features/services/components/ServiceCardSkeleton";

const iconMap: Record<string, any> = {
    Stethoscope,
    Star,
    Crown,
    Activity,
    FlaskConical,
    ScanLine,
    Bed: BedDouble,
    Heart,
    Shield,
    FileCheck,
    Clock,
};

const ServiceCard = ({
    icon: Icon,
    title,
    href,
    color = "primary",
}: {
    icon: any;
    title: string;
    href?: string;
    color?: string;
}) => {
    const isRamadanAccent = color === "accent";
    const colorClasses = {
        primary: "bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
        accent: "bg-ramadan-gold/10 group-hover:bg-ramadan-gold/20 text-ramadan-gold group-hover:scale-110",
        success: "bg-green-500/10 group-hover:bg-green-500/20 text-green-600 dark:text-green-400",
        purple: "bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400",
        rose: "bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-600 dark:text-rose-400",
        cyan: "bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
    };

    const CardContent = (
        <div
            className={`group bg-card hover:bg-card/80 border ${isRamadanAccent ? 'border-ramadan-gold/50 ramadan-glow' : 'border-border'} rounded-xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer h-full min-h-[140px] flex items-center justify-center`}
        >
            <div className="flex flex-col items-center gap-3 text-center">
                <div className={`p-3 rounded-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
                    <Icon className="h-7 w-7" />
                </div>
                <h3 className={`font-semibold text-xs sm:text-sm ${isRamadanAccent ? 'text-slate-800' : 'group-hover:text-primary'} transition-colors line-clamp-2`}>
                    {title}
                </h3>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href}>
                {CardContent}
            </Link>
        );
    }

    return CardContent;
};

export const ServiceCardsSection = () => {
    const n = useTranslations("Navbar");
    const { data: servicesData, isLoading } = useGetServices();

    const defaultServices = [
        { icon: Stethoscope, title: n("doctors"), href: "/doctors", color: "primary" },
        { icon: Star, title: n("featured_services"), href: "/layanan-unggulan", color: "accent" },
    ];

    const dynamicServices = servicesData?.filter(s =>
        s.isActive &&
        s.slug !== 'rawat-inap' &&
        s.slug !== 'rawat-jalan'
    ).map(service => ({
        icon: iconMap[service.icon || 'Activity'] || Activity,
        title: service.name,
        href: service.slug === 'mcu' ? '/layanan/diagnostic-hub?tab=mcu' :
            service.slug === 'laboratorium' ? '/layanan/diagnostic-hub?tab=lab' :
                service.slug === 'radiologi' ? '/layanan/diagnostic-hub?tab=radio' :
                    `/layanan/${service.slug}`,
        color: service.slug === 'mcu' ? 'rose' :
            service.slug === 'laboratorium' ? 'cyan' :
                service.slug === 'radiologi' ? 'success' :
                    service.slug === 'poli-executive' ? 'accent' : 'primary'
    })) || [];

    const displayServices = [...defaultServices, ...dynamicServices].slice(0, 6);

    return (
        <section className="w-full relative z-10 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-center w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl w-full">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <ServiceCardSkeleton key={i} />
                            ))
                        ) : (
                            displayServices.map((service, index) => (
                                <ServiceCard
                                    key={index}
                                    icon={service.icon}
                                    title={service.title}
                                    href={service.href}
                                    color={service.color}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
