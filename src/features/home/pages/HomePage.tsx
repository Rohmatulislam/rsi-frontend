"use client";
import { About } from "../components/About";
import { RecommendedDoctorsSection } from "../components/RecommendedDoctorsSection";
import { BannerCarousel } from "~/features/banner/components/BannerCarousel";
import { ServiceCardsSection } from "../components/ServiceCardsSection";
import { ArticlesSection } from "../components/ArticlesSection";
import { PartnershipSection } from "../components/PartnershipSection";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />
      <ServiceCardsSection />
      <div className="space-y-10">
        <About />
        <RecommendedDoctorsSection />
        <ArticlesSection />
        <PartnershipSection />
      </div>
    </div>
  )
};

export default HomePage;
