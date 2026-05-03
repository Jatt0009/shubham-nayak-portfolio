"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import AboutWireframeReveal from "@/components/sections/about/AboutWireframeReveal";

type AboutMeProps = {
  eyebrow?: string;
  statementLines?: string[];
  /** Substring to tint with accent — must appear verbatim in one line */
  highlightPhrase?: string;
  attribution?: string;
  /** Portrait in /public */
  imageSrc?: string;
  imageAlt?: string;
};

const defaultLines = [
  "What people remember isn't decoration.",
  "It's the calm when complexity disappears.",
];

const ease = [0.22, 1, 0.36, 1] as const;

/** Ease-out cubic — exit choreography */
function exitEase(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

/** Opacity 1→0 between scroll phases with smooth ease-out */
function fadeBetween(p: number, start: number, end: number, reduceMotion: boolean) {
  if (reduceMotion) return 1;
  if (p <= start) return 1;
  if (p >= end) return 0;
  return 1 - exitEase((p - start) / (end - start));
}

export default function AboutMe({
  eyebrow = "About",
  statementLines = defaultLines,
  highlightPhrase,
  attribution = "Shubham Nayak — Designer",
  imageSrc = "/profile_pic.jpg",
  imageAlt = "Shubham Nayak",
}: AboutMeProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  });

  const { scrollYProgress: depthProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const exitT = useTransform(exitProgress, (p) => (reduceMotion ? 0 : exitEase(p)));

  const exitScale = useTransform(exitT, (t) => 1 - t * 0.045);
  const exitY = useTransform(exitT, (t) => `${-t * 52}px`);
  const exitOpacity = useTransform(exitT, (t) => 1 - t * 0.32);

  const exitContrast = useTransform(exitT, (t) => 1 - t * 0.085);
  const exitSaturate = useTransform(exitT, (t) => 1 - t * 0.1);
  const exitFilter = useMotionTemplate`contrast(${exitContrast}) saturate(${exitSaturate})`;

  const rm = Boolean(reduceMotion);

  const secondaryExitOpacity = useTransform(exitProgress, (p) =>
    fadeBetween(p, 0.04, 0.36, rm)
  );
  const ambientExitOpacity = useTransform(exitProgress, (p) =>
    fadeBetween(p, 0, 0.34, rm)
  );
  const railExitOpacity = useTransform(exitProgress, (p) =>
    fadeBetween(p, 0.06, 0.38, rm)
  );
  const portraitExitOpacity = useTransform(exitProgress, (p) =>
    fadeBetween(p, 0.14, 0.5, rm)
  );
  const tailHeadingExitOpacity = useTransform(exitProgress, (p) =>
    fadeBetween(p, 0.26, 0.74, rm)
  );
  const firstHeadingExitOpacity = useTransform(exitProgress, (p) =>
    fadeBetween(p, 0.46, 0.96, rm)
  );

  const fadeSlide = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35 } },
      }
    : {
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.88, ease } },
      };

  const lineReveal = reduceMotion
    ? fadeSlide
    : {
        hidden: { opacity: 0, y: 36 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.88, ease },
        },
      };

  const outerVariants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? {}
        : {
            staggerChildren: 0.15,
            delayChildren: 0.06,
          },
    },
  };

  const quoteShellVariants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? {}
        : {
            staggerChildren: 0.14,
            delayChildren: 0.02,
          },
    },
  };

  const footVariants = reduceMotion
    ? fadeSlide
    : {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.75, ease, delay: 0.06 },
        },
      };

  function renderLine(line: string) {
    if (highlightPhrase && line.includes(highlightPhrase)) {
      const parts = line.split(highlightPhrase);
      return (
        <>
          {parts[0]}
          <span className="text-accent-ink">{highlightPhrase}</span>
          {parts.slice(1).join(highlightPhrase)}
        </>
      );
    }
    return line;
  }

  const [firstLine, ...tailLines] = statementLines;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-statement"
      className="relative overflow-hidden bg-background"
      id="about"
    >
      <motion.div
        className="relative origin-center will-change-transform"
        style={{
          scale: exitScale,
          y: exitY,
          opacity: exitOpacity,
          filter: exitFilter,
        }}
      >
        <motion.div
          className="pointer-events-none absolute bottom-0 left-[-15%] h-[min(55vw,480px)] w-[min(55vw,480px)] rounded-full bg-[radial-gradient(circle,rgba(182,255,0,0.055)_0%,transparent_68%)] blur-3xl"
          aria-hidden
          style={{ opacity: ambientExitOpacity }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-[clamp(5rem,14vw,9rem)] md:px-10 lg:py-[clamp(6rem,12vw,10rem)]">
          <motion.div
            variants={outerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-12%", amount: 0.28 }}
          >
            <motion.div style={{ opacity: secondaryExitOpacity }}>
              <motion.p
                variants={fadeSlide}
                className="mb-14 font-mono text-[10px] uppercase tracking-[0.48em] text-secondary md:mb-[clamp(3rem,7vw,4.25rem)] md:text-[11px]"
              >
                {eyebrow}
              </motion.p>
            </motion.div>

            <motion.div variants={quoteShellVariants} className="relative md:pl-11 lg:pl-12">
              <motion.div
                className="pointer-events-none absolute left-0 top-[0.2em] hidden h-[calc(100%-0.25em)] w-px bg-gradient-to-b from-accent/65 via-foreground/14 to-transparent md:block"
                aria-hidden
                style={{ opacity: railExitOpacity }}
              />

              {firstLine ? (
                <motion.div style={{ opacity: firstHeadingExitOpacity }}>
                  <motion.p
                    id="about-statement"
                    variants={lineReveal}
                    className="font-heading font-semibold tracking-[-0.035em] text-foreground text-[clamp(2.05rem,6vw,4rem)] leading-[1.06]"
                  >
                    {renderLine(firstLine)}
                  </motion.p>
                </motion.div>
              ) : null}

              <motion.div style={{ opacity: portraitExitOpacity }}>
                <AboutWireframeReveal
                  imageSrc={imageSrc}
                  imageAlt={imageAlt}
                  depthProgress={depthProgress}
                />
              </motion.div>

              {tailLines.map((line, i) => (
                <motion.div key={`${i}-${line.slice(0, 32)}`} style={{ opacity: tailHeadingExitOpacity }}>
                  <motion.p
                    variants={lineReveal}
                    className={[
                      "font-heading font-semibold tracking-[-0.035em] text-foreground",
                      "text-[clamp(2.05rem,6vw,4rem)] leading-[1.06]",
                      i < tailLines.length - 1 ? "mb-[0.35em] md:mb-[0.45em]" : "",
                    ].join(" ")}
                  >
                    {renderLine(line)}
                  </motion.p>
                </motion.div>
              ))}

              <motion.div style={{ opacity: secondaryExitOpacity }}>
                <motion.footer variants={footVariants} className="mt-[clamp(2.75rem,7vw,4.25rem)] max-w-lg">
                  <p className="font-body text-[15px] leading-relaxed text-secondary md:text-[17px] md:leading-relaxed">
                    {attribution}
                  </p>
                  <div
                    className="mt-10 h-px max-w-[4.5rem] bg-gradient-to-r from-foreground/35 to-transparent md:mt-12"
                    aria-hidden
                  />
                </motion.footer>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
