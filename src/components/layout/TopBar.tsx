"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

// Hospital contact information
const IGD_PHONE = "0370-671011"; // Nomor IGD RSI Siti Hajar
const WHATSAPP_NUMBER = "6287772001011"; // Format: country code + number without +

export const TopBar = () => {
    return (
        <div className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-9 text-xs md:text-sm">
                    {/* Left side - IGD Info */}
                    <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-medium">IGD 24 Jam:</span>
                        <a
                            href={`tel:${IGD_PHONE}`}
                            className="font-bold hover:underline"
                        >
                            {IGD_PHONE}
                        </a>
                    </div>

                    {/* Right side - WhatsApp & Contact */}
                    <div className="flex items-center gap-4">
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:underline transition-colors"
                        >
                            <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                        <Link
                            href="/kontak"
                            className="flex items-center gap-1.5 hover:underline transition-colors"
                        >
                            <Phone className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Hubungi Kami</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
