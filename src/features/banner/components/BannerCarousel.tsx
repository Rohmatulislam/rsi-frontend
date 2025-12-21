"use client";

import { useState, useEffect } from "react";
import { useGetActiveBanners } from "../api/getActiveBanners";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageSrc } from "~/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const BannerCarousel = () => {
    const t = useTranslations("About");
    const { data: banners, isLoading } = useGetActiveBanners();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        if (!banners || banners.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [banners]);

    const goToPrevious = () => {
        if (!banners) return;
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToNext = () => {
        if (!banners) return;
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (isLoading) {
        return (
            <div className="relative w-full h-[500px] md:h-[600px] bg-muted">
                <Skeleton className="w-full h-full" />
            </div>
        );
    }

    if (!banners || banners.length === 0) {
        return null; // Don't show anything if no banners
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            {/* Banner Image & Content */}
            <div className="relative w-full h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={getImageSrc(currentBanner.imageUrl)}
                        alt={currentBanner.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-2xl text-white space-y-4 md:space-y-6 pb-20 md:pb-0">
                            <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {currentBanner.title}
                            </h1>

                            {currentBanner.subtitle && (
                                <p className="text-lg md:text-2xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                    {currentBanner.subtitle}
                                </p>
                            )}

                            {currentBanner.description && (
                                <p className="text-sm md:text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 line-clamp-3 md:line-clamp-none">
                                    {currentBanner.description}
                                </p>
                            )}

                            {currentBanner.link && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-primary text-white hover:bg-primary/90 font-bold px-6 py-4 md:px-8 md:py-6 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all"
                                    >
                                        <Link href={currentBanner.link}>
                                            {currentBanner.linkText || t("cta_more")}
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm h-12 w-12 rounded-full"
                        onClick={goToPrevious}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm h-12 w-12 rounded-full"
                        onClick={goToNext}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? "w-8 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
