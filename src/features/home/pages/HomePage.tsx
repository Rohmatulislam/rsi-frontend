import {HeroSection} from "../components/HeroSection";
import {About} from "../components/About";
import { RecommendedDoctorsSection } from "../components/RecommendedDoctorsSection";

const HomePage = () => {
  return (
    <div className="space-y-10">
      <HeroSection />
      <About />
      <RecommendedDoctorsSection />
    </div>
  )
};

export default HomePage;
