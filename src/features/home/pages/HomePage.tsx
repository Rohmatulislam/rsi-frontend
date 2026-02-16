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

const SectionHeading = ({ title, subtitle, center }: { title: string; subtitle: string; center?: boolean }) => (
  <div className={`mb-12 space-y-4 ${center ? 'text-center' : ''}`}>
    <h2 className={`text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
      {!center && <div className="h-10 w-2 bg-ramadan-gold rounded-full" />}
      {title}
      {center && <div className="h-2 w-16 bg-ramadan-gold rounded-full" />}
    </h2>
    <p className={`text-lg text-muted-foreground font-medium max-w-2xl ${center ? 'mx-auto' : ''}`}>
      {subtitle}
    </p>
  </div>
);

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

      <div className="space-y-0 py-20">
        {/* About Section */}
        <section className="relative container mx-auto px-4 py-20">
          <SectionHeading title="Tentang Kami" subtitle="Melayani dengan hati, berlandaskan nilai-nilai Islami" />
          <About />
        </section>

        {/* Doctors Section */}
        <section className="bg-slate-50/80 py-24 border-y border-ramadan-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] pointer-events-none" />
          <div className="container mx-auto">
            <RecommendedDoctorsSection />
          </div>
        </section>

        {/* Articles Section */}
        <section className="relative container mx-auto px-4 py-24">
          <SectionHeading title="Artikel Kesehatan" subtitle="Tips dan informasi kesehatan terkini selama bulan Ramadan" />
          <ArticlesSection />
        </section>

        {/* Partnership Section */}
        <section className="bg-white py-24 border-t border-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-islamic-pattern opacity-[0.02] pointer-events-none" />
          <div className="container mx-auto px-4">
            <SectionHeading title="Kemitraan & Asuransi" subtitle="Kami bekerjasama dengan berbagai mitra terpercaya untuk kemudahan Anda" center />
            <PartnershipSection />
          </div>
        </section>
      </div>
    </div>
  )
};

export default HomePage;
