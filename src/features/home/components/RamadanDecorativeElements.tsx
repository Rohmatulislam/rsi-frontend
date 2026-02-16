"use client";

import React from "react";
import { Moon } from "lucide-react";

export const RamadanDecorativeElements = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
            <TwinklingStars />

            {/* Hanging Lantern Left */}
            <div className="absolute top-0 left-[5%] md:left-[10%] animate-swing-slow opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <svg width="45" height="130" viewBox="0 0 45 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#BF953F" />
                            <stop offset="25%" stopColor="#FCF6BA" />
                            <stop offset="50%" stopColor="#B38728" />
                            <stop offset="75%" stopColor="#FBF5B7" />
                            <stop offset="100%" stopColor="#AA771C" />
                        </linearGradient>
                    </defs>
                    <line x1="22.5" y1="0" x2="22.5" y2="40" stroke="url(#gold-gradient)" strokeWidth="1.5" />
                    <path d="M12 40H33L38 52V95L33 105H12L7 95V52L12 40Z" fill="url(#gold-gradient)" fillOpacity="0.3" stroke="url(#gold-gradient)" strokeWidth="1.5" />
                    <rect x="17.5" y="58" width="10" height="32" rx="2" fill="url(#gold-gradient)" fillOpacity="0.5" />
                    <circle cx="22.5" cy="74" r="4" fill="#FFF" className="animate-pulse shadow-[0_0_10px_white]" />
                    <path d="M17 105L22.5 125L28 105" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Hanging Lantern Right */}
            <div className="absolute top-0 right-[5%] md:right-[15%] animate-swing-fast opacity-70 hidden sm:block drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <svg width="35" height="110" viewBox="0 0 35 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="17.5" y1="0" x2="17.5" y2="35" stroke="url(#gold-gradient)" strokeWidth="1.2" />
                    <path d="M10 35H25L29 45V80L25 88H10L6 80V45L10 35Z" fill="url(#gold-gradient)" fillOpacity="0.2" stroke="url(#gold-gradient)" strokeWidth="1.2" />
                    <rect x="15" y="48" width="5" height="28" rx="1.5" fill="url(#gold-gradient)" fillOpacity="0.4" />
                    <circle cx="17.5" cy="62" r="3" fill="#FFF" className="animate-pulse" />
                </svg>
            </div>

            {/* Subtle Moon background overlay for hero */}
            <div className="absolute -top-20 -right-20 opacity-[0.03] transition-opacity duration-1000">
                <Moon size={450} fill="url(#gold-gradient)" className="rotate-12" />
            </div>
        </div>
    );
};

const TwinklingStars = () => {
    const [stars, setStars] = React.useState<any[]>([]);

    React.useEffect(() => {
        const generatedStars = [...Array(20)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            duration: `${2 + Math.random() * 4}s`,
            delay: `${Math.random() * 5}s`,
        }));
        setStars(generatedStars);
    }, []);

    if (stars.length === 0) return null;

    return (
        <div className="absolute inset-0 z-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-twinkle"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.width,
                        height: star.height,
                        "--duration": star.duration,
                        "--delay": star.delay,
                    } as any}
                />
            ))}
        </div>
    );
};
