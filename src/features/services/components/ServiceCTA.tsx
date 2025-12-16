"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Phone, MessageCircle, Calendar, ArrowRight } from "lucide-react";

interface ServiceCTAProps {
    title?: string;
    subtitle?: string;
    primaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
        icon?: "phone" | "whatsapp" | "calendar";
    };
    secondaryAction?: {
        label: string;
        href: string;
    };
}

const iconMap = {
    phone: Phone,
    whatsapp: MessageCircle,
    calendar: Calendar,
};

export const ServiceCTA = ({
    title = "Butuh Bantuan?",
    subtitle = "Tim kami siap membantu Anda",
    primaryAction,
    secondaryAction,
}: ServiceCTAProps) => {
    const PrimaryIcon = primaryAction?.icon ? iconMap[primaryAction.icon] : ArrowRight;

    return (
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
                    <p className="text-muted-foreground mb-8">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {primaryAction && (
                            primaryAction.href ? (
                                <Button size="lg" asChild>
                                    <Link href={primaryAction.href}>
                                        <PrimaryIcon className="h-5 w-5 mr-2" />
                                        {primaryAction.label}
                                    </Link>
                                </Button>
                            ) : (
                                <Button size="lg" onClick={primaryAction.onClick}>
                                    <PrimaryIcon className="h-5 w-5 mr-2" />
                                    {primaryAction.label}
                                </Button>
                            )
                        )}

                        {secondaryAction && (
                            <Button size="lg" variant="outline" asChild>
                                <Link href={secondaryAction.href}>
                                    {secondaryAction.label}
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
