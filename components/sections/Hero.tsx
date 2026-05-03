"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink, MousePointer2, Sparkles } from "lucide-react";
import InteractiveText from "@/components/InteractiveText";
import TubesCursorBackdrop, {
  type TubesCursorBackdropHandle,
} from "@/components/hero/TubesCursorBackdrop";

const heroHighlights = ["UX audits", "Product flows", "Visual systems"];

const TUBES_CREDIT_HREF = "https://www.framer.com/@kevin-levron/";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const tubesRef = useRef<TubesCursorBackdropHandle>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackgroundInteract = () => {
    if (reduceMotion) return;
    tubesRef.current?.randomizeColors();
  };

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030303] px-5 py-8 text-white sm:px-6"
      onClick={handleBackgroundInteract}
      aria-label="Hero — click to randomize neon tubes"
    >
      <TubesCursorBackdrop
        ref={tubesRef}
        disabled={!!reduceMotion}
        className="z-0"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_80%_at_50%_100%,rgba(182,255,0,0.06),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-black/10 to-black/50"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 shadow-[0_2px_24px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-accent drop-shadow-[0_0_8px_rgba(182,255,0,0.45)]" />
          <span className="text-sm font-semibold tracking-wide text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
            Available for new opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="pointer-events-auto mx-auto mb-7 max-w-[12ch] cursor-default font-heading text-[3.15rem] font-bold leading-[0.94] tracking-tight sm:max-w-[13ch] sm:text-6xl md:max-w-[12.5ch] md:text-[5.4rem]"
        >
          <span className="block tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_4px_28px_rgba(0,0,0,0.75)]">
            <InteractiveText text="Designing" />
          </span>
          <span className="block tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_4px_28px_rgba(0,0,0,0.75)] md:-mt-2">
            <InteractiveText text="Experiences" />
          </span>
          <span className="relative inline-block text-accent [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_2px_20px_rgba(0,0,0,0.7),0_0_32px_rgba(182,255,0,0.4)]">
            <InteractiveText text="That Matter" />
            <span className="absolute -bottom-2 left-1/2 h-1 w-[72%] -translate-x-1/2 rounded-full bg-accent/50" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="pointer-events-auto mx-auto mb-6 max-w-2xl text-lg font-normal leading-relaxed text-white/92 [text-shadow:0_1px_3px_rgba(0,0,0,0.92),0_2px_16px_rgba(0,0,0,0.65)] md:text-xl"
        >
          I am a UI/UX Designer dedicated to crafting premium, intuitive, and memorable digital products that
          solve real problems.
        </motion.p>

        {!reduceMotion ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pointer-events-auto mx-auto mb-10 max-w-md text-sm leading-relaxed text-white/88 [text-shadow:0_1px_2px_rgba(0,0,0,0.95)] sm:text-base"
          >
            Move your cursor to bend the neon tubes. Click anywhere on the background to randomize colors.
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-auto mx-auto mb-10 max-w-md text-sm leading-relaxed text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]"
          >
            Reduced motion is on — the 3D tubes background is disabled.
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
          className="pointer-events-auto flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection("projects");
            }}
            className="interactive group flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-foreground shadow-[0_2px_20px_rgba(0,0,0,0.45),0_0_36px_rgba(182,255,0,0.35)] transition-colors hover:bg-accent/90"
          >
            View Projects
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection("contact");
            }}
            className="interactive rounded-full border border-white/30 bg-black/40 px-8 py-4 font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)] shadow-[0_2px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/50"
          >
            Let&apos;s Connect
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {heroHighlights.map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-white/22 bg-black/35 px-4 py-2 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)] shadow-[0_2px_12px_rgba(0,0,0,0.4)] backdrop-blur-md"
            >
              {highlight}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="pointer-events-auto mt-12 flex flex-col items-center gap-3"
        >
          <a
            href={TUBES_CREDIT_HREF}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-5 py-2.5 text-sm font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)] shadow-[0_2px_16px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-white/35 hover:bg-black/45"
          >
            <span>Tubes effect — Kevin Levron</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-white opacity-95" />
          </a>
        </motion.div>
      </div>

      {!reduceMotion ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/75 [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]"
        >
          <MousePointer2 className="h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-[0.35em]">Click to randomize</span>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-28"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-white/55 to-transparent shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
      </motion.div>
    </section>
  );
}
