import NavigationGuest from "@/components/partials/navigation-guest";
import LatestUpdatesSlider from "@/components/home/latest-updates-slider";
import BuildProfileSection from "@/components/home/build-profile-section";
import VideoTutorialsSection from "@/components/home/video-tutorials-section";
import ReferEarnSection from "@/components/home/refer-earn-section";
import HeroSection from "@/components/home/hero-section";
import SpecialFeaturesSection from "@/components/home/special-features-section";
import WhyChooseSection from "@/components/home/why-choose-section";
import FooterGuest from "@/components/partials/footer-guest";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B16]">
      <NavigationGuest />

      <main>
        <HeroSection />
        <SpecialFeaturesSection />
        <WhyChooseSection />
        <LatestUpdatesSlider />
        <BuildProfileSection />
        <VideoTutorialsSection />
        <ReferEarnSection />
      </main>
      <FooterGuest />
    </div>
  );
}
