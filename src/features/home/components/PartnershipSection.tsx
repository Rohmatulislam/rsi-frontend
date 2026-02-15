"use client";

import { useGetActivePartners } from "../../partner/api/getActivePartners";
import { getImageSrc } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

export const PartnershipSection = () => {
    const { data: partners, isLoading } = useGetActivePartners();

    // Placeholder data for loading or empty state
    const placeholders = [1, 2, 3, 4, 5, 6];
    const hasData = partners && partners.length > 0;

    // Create marquee items: real data or skeletons
    const marqueeItems = hasData
        ? [...partners, ...partners, ...partners]
        : [...placeholders, ...placeholders, ...placeholders];

    return (
        <section className="py-16 bg-white dark:bg-slate-950 overflow-hidden relative">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                    KEMITRAAN KAMI
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap py-4">
                    {marqueeItems.map((item, index) => {
                        const partner = item as any;
                        const content = hasData ? (
                            <img
                                src={getImageSrc(partner.imageUrl)}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
                            />
                        ) : (
                            <Skeleton className="h-12 w-32 opacity-50" />
                        );

                        return (
                            <div
                                key={hasData ? `${partner.id}-${index}` : `skeleton-${index}`}
                                className="mx-4 flex items-center justify-center bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-4 h-24 w-48 md:h-28 md:w-56 shadow-sm hover:shadow-md transition-shadow group-hover:[animation-play-state:paused]"
                            >
                                {hasData && partner.link ? (
                                    <a
                                        href={partner.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-full flex items-center justify-center"
                                        title={`Kunjungi ${partner.name}`}
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    content
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Masking gradients for smooth entry/exit */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
        </section>
    );
};
