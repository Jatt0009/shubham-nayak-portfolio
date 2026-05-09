"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import InteractiveText from "@/components/InteractiveText";
import TubesCursorBackdrop from "@/components/hero/TubesCursorBackdrop";

const heroHighlights = ["UX audits", "Product flows", "Visual systems"];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030303] px-5 py-8 text-background sm:px-6">
      {!reduceMotion ? (
        <TubesCursorBackdrop className="min-h-full w-full" />
      ) : (
        <div className="absolute inset-0 z-0 bg-[#030303]" aria-hidden>
          <div className="pointer-events-none absolute left-1/4 top-0 h-[min(60vw,420px)] w-[min(60vw,420px)] -translate-x-1/2 rounded-full bg-[#d6203a]/18 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[min(70vw,480px)] w-[min(70vw,480px)] translate-x-1/4 rounded-full bg-[#d9ff75]/12 blur-[120px]" />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.22] [background-image:linear-gradient(rgba(248,245,242,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(248,245,242,0.07)_1px,transparent_1px)] [background-size:72px_72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-4 top-6 bottom-6 z-0 rounded-[2rem] border border-background/15 sm:inset-x-8 md:rounded-[3rem]"
        aria-hidden
      />


      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto mb-8 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/12 px-4 py-2 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          <span className="text-sm font-semibold tracking-wide text-background">Available for new opportunities</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 1, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="pointer-events-auto mx-auto mb-7 max-w-[12ch] cursor-default font-heading text-[3.15rem] font-bold leading-[0.94] tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_6px_28px_rgba(0,0,0,0.5)] sm:max-w-[13ch] sm:text-6xl md:max-w-[12.5ch] md:text-[5.4rem]"
        >
          <span className="block text-background">
            <InteractiveText text="Designing" />
          </span>
          <span className="block text-background md:-mt-2">
            <InteractiveText text="Experiences" />
          </span>
          <span className="relative inline-block text-accent drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
            <InteractiveText text="That Matter" />
            <span className="absolute -bottom-2 left-1/2 h-1 w-[72%] -translate-x-1/2 rounded-full bg-accent/45" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-background/88 drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] md:text-xl"
        >
          I am a UI/UX Designer dedicated to crafting premium, intuitive, and memorable digital products that solve real
          problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="pointer-events-auto flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => scrollToSection("projects")}
            className="interactive group flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-foreground shadow-[0_8px_32px_rgba(182,255,0,0.25)] transition-colors hover:bg-accent-dark"
          >
            View Projects
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="interactive rounded-full border border-background/35 bg-background/10 px-8 py-4 font-semibold text-background backdrop-blur-sm transition-colors hover:bg-background/18"
          >
            Let&apos;s Connect
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {heroHighlights.map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-background/22 bg-background/10 px-4 py-2 text-sm font-semibold text-background shadow-sm backdrop-blur-md"
            >
              {highlight}
            </span>
          ))}
        </motion.div>

      </div>

    </section>
  );
}
