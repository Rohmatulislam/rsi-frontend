"use client";

import { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ServiceGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}

export const ServiceGrid = ({
    children,
    columns = 3,
    className,
}: ServiceGridProps) => {
    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-6",
                gridCols[columns],
                className
            )}
        >
            {children}
        </div>
    );
};
