"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "~/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = (newLocale: "id" | "en") => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => toggleLanguage("id")}
                    className={locale === "id" ? "bg-accent" : ""}
                >
                    <span className="mr-2">🇮🇩</span> Bahasa Indonesia
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => toggleLanguage("en")}
                    className={locale === "en" ? "bg-accent" : ""}
                >
                    <span className="mr-2">🇺🇸</span> English (US)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
