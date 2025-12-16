"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ServiceCardProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    href?: string;
    color?: "primary" | "accent" | "success" | "purple" | "rose" | "cyan";
    className?: string;
}

const colorClasses = {
    primary: "bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
    accent: "bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    success: "bg-green-500/10 group-hover:bg-green-500/20 text-green-600 dark:text-green-400",
    purple: "bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400",
    rose: "bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-600 dark:text-rose-400",
    cyan: "bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
};

export const ServiceCard = ({
    title,
    description,
    icon: Icon,
    href,
    color = "primary",
    className,
}: ServiceCardProps) => {
    const CardContent = (
        <div
            className={cn(
                "group bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer h-full flex flex-col",
                className
            )}
        >
            {Icon && (
                <div className={cn("p-3 rounded-full w-fit mb-4 transition-all duration-300", colorClasses[color])}>
                    <Icon className="h-6 w-6" />
                </div>
            )}
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {title}
            </h3>
            {description && (
                <p className="text-muted-foreground text-sm flex-1">{description}</p>
            )}
            {href && (
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                    Selengkapnya
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            )}
        </div>
    );

    if (href) {
        return <Link href={href}>{CardContent}</Link>;
    }

    return CardContent;
};
