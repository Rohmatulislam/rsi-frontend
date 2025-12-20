"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "~/lib/utils";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

/**
 * Breadcrumb navigation component for contextual navigation
 * Shows the current page's location in the site hierarchy
 */
export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center text-sm text-muted-foreground", className)}
        >
            <ol className="flex items-center gap-1.5 flex-wrap">
                {/* Home link */}
                <li className="flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Beranda</span>
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-1.5">
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            {isLast || !item.href ? (
                                <span
                                    className={cn(
                                        "font-medium",
                                        isLast ? "text-foreground" : "text-muted-foreground"
                                    )}
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

/**
 * Breadcrumb wrapper with container styling
 * Use this when placing breadcrumb at the top of a page section
 */
export const BreadcrumbContainer = ({ items, className }: BreadcrumbProps) => {
    return (
        <div className={cn("container mx-auto px-4 py-4", className)}>
            <Breadcrumb items={items} />
        </div>
    );
};
