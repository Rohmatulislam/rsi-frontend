import { About } from "../components/About";
import { RecommendedDoctorsSection } from "../components/RecommendedDoctorsSection";
import { BannerCarousel } from "~/features/banner/components/BannerCarousel";
import { ServiceCardsSection } from "../components/ServiceCardsSection";

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />
      <ServiceCardsSection />
      <div className="space-y-10">
        <About />
        <RecommendedDoctorsSection />
      </div>
    </div>
  )
};

export default HomePage;
