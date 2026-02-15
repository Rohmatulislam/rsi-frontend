"use client";
import { About } from "../components/About";
import { RecommendedDoctorsSection } from "../components/RecommendedDoctorsSection";
import { BannerCarousel } from "~/features/banner/components/BannerCarousel";
import { ServiceCardsSection } from "../components/ServiceCardsSection";
import { ArticlesSection } from "../components/ArticlesSection";
import { PartnershipSection } from "../components/PartnershipSection";
import { DiagnosticHeroBanner } from "../components/DiagnosticHeroBanner";
import { RamadanDecorativeElements } from "../components/RamadanDecorativeElements";
import { RamadanImsakiyahWidget } from "../components/RamadanImsakiyahWidget";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-background selection:bg-ramadan-gold selection:text-white">
      <RamadanDecorativeElements />

      <div className="relative">
        <BannerCarousel />

        {/* Floating Ramadan Hub */}
        <div className="max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 relative z-20 space-y-6 md:space-y-8">
          <RamadanImsakiyahWidget />
          <ServiceCardsSection />
        </div>
      </div>

      <div className="mt-20">
        <DiagnosticHeroBanner />
      </div>

      <div className="space-y-20 py-20 bg-islamic-pattern/5">
        <section className="relative container mx-auto px-4">
          <About />
        </section>

        <section className="bg-slate-50/80 py-20 border-y border-ramadan-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] pointer-events-none" />
          <RecommendedDoctorsSection />
        </section>

        <section className="relative container mx-auto px-4">
          <ArticlesSection />
        </section>

        <section className="bg-white py-20 border-t border-slate-100">
          <PartnershipSection />
        </section>
      </div>
    </div>
  )
};

export default HomePage;
