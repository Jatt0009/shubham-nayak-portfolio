import Hero from "@/components/sections/Hero";
import AboutMe from "@/components/sections/AboutMe";
import DesignApproachVideo from "@/components/sections/DesignApproachVideo";
import PremiumCaseStudies from "@/components/sections/PremiumCaseStudies";
import Testimonials from "@/components/sections/Testimonials";
import Resume from "@/components/sections/Resume";
import KeyboardFooter from "@/components/sections/KeyboardFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-accent/30">
      <Hero />
      <AboutMe />
      <DesignApproachVideo src="/showreel.mp4" />
      <PremiumCaseStudies />
      <Testimonials />
      <Resume />
      <KeyboardFooter />
    </main>
  );
}
