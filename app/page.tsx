import Hero from "@/components/sections/Hero";
import AboutMe from "@/components/sections/AboutMe";
import VintageDriveShowcase from "@/components/sections/VintageDriveShowcase";
import DesignApproachVideo from "@/components/sections/DesignApproachVideo";
import PremiumCaseStudies from "@/components/sections/PremiumCaseStudies";
import Testimonials from "@/components/sections/Testimonials";
import Resume from "@/components/sections/Resume";
import KeyboardFooter from "@/components/sections/KeyboardFooter";
import FlipBlockTransition from "@/components/sections/FlipBlockTransition";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-accent/30">
      <Hero />
      <FlipBlockTransition>
        <AboutMe />
      </FlipBlockTransition>
      <FlipBlockTransition>
        <VintageDriveShowcase />
      </FlipBlockTransition>
      <FlipBlockTransition intensity="cube">
        <DesignApproachVideo src="/showreel.mp4" />
      </FlipBlockTransition>
      <FlipBlockTransition>
        <PremiumCaseStudies />
      </FlipBlockTransition>
      <FlipBlockTransition>
        <Testimonials />
      </FlipBlockTransition>
      <FlipBlockTransition intensity="cube">
        <Resume />
      </FlipBlockTransition>
      <FlipBlockTransition intensity="medium">
        <KeyboardFooter />
      </FlipBlockTransition>
    </main>
  );
}
