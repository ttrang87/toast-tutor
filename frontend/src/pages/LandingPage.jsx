import landingpic from "../assets/landingpic.jpg";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSetion";

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col pt-8"
      style={{ backgroundColor: '#FFFDE7' }}>
      <div className="flex pb-8">
        <div className="w-1/2 h-full flex items-center justify-center pl-4">
          <HeroSection />
        </div>
        <div className="w-1/2 h-full flex items-center justify-center animate-float pr-4">
          <img
            src={landingpic}
            alt="Landing"
            className="rounded-xl shadow-lg w-2/3 h-auto"
          />
        </div>
      </div>
      <div className="px-20 pb-14">
        <FeaturesSection />
      </div>
    </div>
  );
};

export default LandingPage;
