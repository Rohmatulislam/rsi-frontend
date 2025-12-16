"use client";

import { ReactNode } from "react";

interface ServiceSectionProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export const ServiceSection = ({
    title,
    subtitle,
    children,
    className,
}: ServiceSectionProps) => {
    return (
        <section className={`py-12 md:py-16 ${className || ""}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
                    {subtitle && (
                        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
};
