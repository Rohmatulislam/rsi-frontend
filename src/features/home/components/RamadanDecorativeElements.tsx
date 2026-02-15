"use client";

import React from "react";
import { Moon } from "lucide-react";

export const RamadanDecorativeElements = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
            {/* Hanging Lantern Left */}
            <div className="absolute top-0 left-[5%] md:left-[10%] animate-bounce duration-[3000ms] opacity-80">
                <svg width="40" height="120" viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="0" x2="20" y2="40" stroke="#D4AF37" strokeWidth="1" />
                    <path d="M10 40H30L35 50V90L30 100H10L5 90V50L10 40Z" fill="#D4AF37" fillOpacity="0.2" stroke="#D4AF37" strokeWidth="1" />
                    <rect x="15" y="55" width="10" height="30" rx="2" fill="#D4AF37" fillOpacity="0.4" />
                    <circle cx="20" cy="70" r="3" fill="#FFF" className="animate-pulse" />
                    <path d="M15 100L20 115L25 100" stroke="#D4AF37" strokeWidth="1" />
                </svg>
            </div>

            {/* Hanging Lantern Right */}
            <div className="absolute top-0 right-[5%] md:right-[15%] animate-bounce duration-[4000ms] opacity-60 hidden sm:block">
                <svg width="30" height="100" viewBox="0 0 30 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="0" x2="15" y2="30" stroke="#D4AF37" strokeWidth="1" />
                    <path d="M8 30H22L26 38V70L22 78H8L4 70V38L8 30Z" fill="#D4AF37" fillOpacity="0.1" stroke="#D4AF37" strokeWidth="1" />
                    <rect x="12" y="42" width="6" height="25" rx="1" fill="#D4AF37" fillOpacity="0.3" />
                    <circle cx="15" cy="54" r="2" fill="#FFF" className="animate-pulse" />
                </svg>
            </div>

            {/* Subtle Moon background overlay for hero */}
            <div className="absolute -top-20 -right-20 opacity-5">
                <Moon size={400} fill="#D4AF37" className="rotate-12" />
            </div>
        </div>
    );
};
