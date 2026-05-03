"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import DeviceShowcase from "../case-study/DeviceShowcase";
import { CASE_STUDIES, type CaseStudy, type CaseStudyFloater } from "@/lib/caseStudies";

const layoutEase = [0.22, 1, 0.36, 1] as const;

/** Case study hero — Apple-like ease (slow-in, confident settle) */
const heroRevealEase = [0.16, 1, 0.3, 1] as const;
const heroReveal = {
  duration: 1.05,
  ease: heroRevealEase,
};

function RevealBlock({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.75, delay, ease: layoutEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Uniform sticker size (used for all hero floaters) */
const HERO_FLOATER_BOX =
  "h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-[13.5rem] lg:w-[13.5rem]";

/** With 3 floaters: left + right stay high; center sticker is rendered in-flow below the tagline */
const HERO_FLOATER_TOP_ROW =
  "pointer-events-none absolute inset-x-0 top-0 flex min-h-0 justify-between items-start pt-[12%] px-2 sm:pt-[14%] sm:px-4 md:pt-[16%] md:px-6";

/** Idle paths — soft looping drift similar in spirit to hero ParticleField dots */
const FLOATER_DRIFT = [
  { x: [0, 12, -10, 8, 0], y: [0, -10, 8, -7, 0], rotate: [0, 5, -4, 3, 0], duration: 5.9 },
  { x: [0, -9, 11, -7, 0], y: [0, 14, -11, 9, 0], rotate: [0, -4, 5, -3, 0], duration: 6.6 },
  { x: [0, -11, 9, -9, 0], y: [0, -8, 10, -8, 0], rotate: [0, 4, -5, 4, 0], duration: 5.4 },
] as const;

function FloaterSticker({
  floater,
  index,
  containerRef,
  reduceMotion,
  dragEnabled,
}: {
  floater: CaseStudyFloater;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  dragEnabled: boolean;
}) {
  const preset = FLOATER_DRIFT[index % FLOATER_DRIFT.length];
  const driftDelay = (floater.delay ?? 0) + index * 0.12;

  return (
    <motion.div
      className={`pointer-events-auto shrink-0 touch-none ${HERO_FLOATER_BOX} ${floater.className ?? ""}`}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.1, ease: layoutEase }}
      drag={dragEnabled && !reduceMotion}
      dragConstraints={containerRef}
      dragElastic={0.12}
      dragTransition={{ bounceStiffness: 420, bounceDamping: 22 }}
      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
    >
      {reduceMotion ? (
        <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
          <Image
            src={floater.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 768px) 192px, 128px"
            className="object-contain drop-shadow-[0_16px_40px_rgba(28,28,28,0.16)]"
            draggable={false}
            unoptimized
          />
        </div>
      ) : (
        <motion.div
          className="relative h-full w-full cursor-grab active:cursor-grabbing will-change-transform"
          animate={{
            x: [...preset.x],
            y: [...preset.y],
            rotate: [...preset.rotate],
          }}
          transition={{
            duration: preset.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: driftDelay,
          }}
        >
          <Image
            src={floater.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 768px) 192px, 128px"
            className="object-contain drop-shadow-[0_16px_40px_rgba(28,28,28,0.16)]"
            draggable={false}
            unoptimized
          />
        </motion.div>
      )}
    </motion.div>
  );
}

/** Draggable hero stickers; 3-up = left & right only (center is in-flow under the tagline) */
function HeroFloaters({
  floaters,
  containerRef,
  reduceMotion,
  dragEnabled,
}: {
  floaters: CaseStudyFloater[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  dragEnabled: boolean;
}) {
  if (floaters.length === 3) {
    const [leftFloater, , rightFloater] = floaters;
    return (
      <div className="pointer-events-none absolute inset-0 z-[25]" aria-hidden>
        <div className={HERO_FLOATER_TOP_ROW}>
          <FloaterSticker
            floater={leftFloater}
            index={0}
            containerRef={containerRef}
            reduceMotion={reduceMotion}
            dragEnabled={dragEnabled}
          />
          <FloaterSticker
            floater={rightFloater}
            index={2}
            containerRef={containerRef}
            reduceMotion={reduceMotion}
            dragEnabled={dragEnabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[25] flex flex-row flex-wrap items-start justify-between gap-y-6 px-3 pt-[14%] sm:px-5 sm:pt-[16%] md:pt-[18%]"
      aria-hidden
    >
      {floaters.map((f, i) => (
        <FloaterSticker
          key={`floater-fallback-${i}-${f.src}`}
          floater={f}
          index={i}
          containerRef={containerRef}
          reduceMotion={reduceMotion}
          dragEnabled={dragEnabled}
        />
      ))}
    </div>
  );
}

function CaseStudyBoard({ src, title }: { src: string; title: string }) {
  return (
    <section
      className="border-t border-divider bg-background px-4 py-10 md:px-8 md:py-14"
      aria-label={`${title} full case study artwork`}
    >
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.35em] text-secondary">Full case study</p>
      <div className="mx-auto max-w-[min(100%,1100px)] overflow-hidden rounded-2xl border border-divider bg-zinc-100 shadow-[0_20px_60px_-20px_rgba(28,28,28,0.2)]">
        {/* Native img: very tall poster; avoids fixed dimensions on next/image */}
        <img
          src={src}
          alt={`${title} — complete case study presentation`}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}

export default function PremiumCaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedId]);

  const selectedProject = CASE_STUDIES.find((p) => p.id === selectedId);

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" id="projects">
          <RevealBlock className="mb-20">
            <h2 className="mb-6 font-heading text-5xl font-bold tracking-tight md:text-7xl">
              Selected <br />
              <span className="text-accent-ink">Case Studies.</span>
            </h2>
            <p className="max-w-2xl text-xl text-secondary">
              A deep dive into my process, from complex problems to elegant,
              human-centric solutions.
            </p>
          </RevealBlock>

          <div className="flex flex-col gap-12 md:gap-24">
            {CASE_STUDIES.map((project) => (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(project.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(project.id);
                  }
                }}
                className={`group relative aspect-square w-full cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 shadow-xl md:rounded-[3rem] md:aspect-[21/9] ${project.color} text-white`}
              >
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
                <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  <div className="h-[120%] w-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
                </div>

                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16">
                  <span
                    className={`mb-4 font-mono text-sm font-bold uppercase tracking-widest md:text-base ${project.accent}`}
                  >
                    {project.category}
                  </span>
                  <div className="pointer-events-auto relative w-fit">
                    <h3 className="relative z-10 mb-2 font-heading text-4xl font-bold tracking-tighter md:mb-4 md:text-7xl">
                      <span className="inline-block">{project.title}</span>
                    </h3>
                    <p className="relative z-10 max-w-md text-xl font-light text-zinc-200 md:text-3xl">
                      <span className="inline-block">{project.tagline}</span>
                    </p>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
                  {project.showcaseSrc ? (
                    <div className="relative flex h-full w-full items-center justify-center opacity-30 transition-opacity duration-700 group-hover:opacity-60">
                      <Image
                        src={project.showcaseSrc}
                        alt=""
                        fill
                        className="scale-150 object-cover opacity-80 blur-[40px]"
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex h-full w-full scale-[1.2] items-center justify-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] md:scale-[1.8] group-hover:scale-[2] group-hover:rotate-[-2deg] rotate-[-5deg]">
                          <Image
                            src={project.showcaseSrc}
                            alt=""
                            width={800}
                            height={500}
                            className={`absolute -translate-x-[40%] translate-y-[30%] rotate-[-15deg] rounded-3xl border border-white/10 object-cover opacity-40 blur-[2px] shadow-2xl ${project.imageObjectClass ?? "object-center"}`}
                            unoptimized
                          />
                          <Image
                            src={project.showcaseSrc}
                            alt=""
                            width={800}
                            height={500}
                            className={`absolute translate-x-[40%] -translate-y-[30%] rotate-[15deg] rounded-3xl border border-white/10 object-cover opacity-40 blur-[2px] shadow-2xl ${project.imageObjectClass ?? "object-center"}`}
                            unoptimized
                          />
                          <Image
                            src={project.showcaseSrc}
                            alt=""
                            width={1000}
                            height={600}
                            className={`relative z-10 rounded-3xl border-[4px] border-white/10 object-cover shadow-[0_0_100px_rgba(0,0,0,0.8)] ${project.imageObjectClass ?? "object-center"}`}
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center opacity-20">
                      <div className={`absolute inset-0 ${project.bgLight}`} />
                      <span className="rotate-[-10deg] text-[8rem] font-bold uppercase tracking-widest text-zinc-600 opacity-10">
                        Preview
                      </span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        <AnimatePresence>
          {selectedId && selectedProject && (
            <motion.div
              key={selectedProject.id}
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/76 md:items-center md:bg-black/70 md:p-6 md:pb-10"
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`case-${selectedProject.id}-title`}
                initial={{ opacity: 0, y: 48, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.38,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.32 },
                }}
                className="relative flex max-h-[min(100dvh,920px)] w-full origin-bottom flex-col overflow-hidden rounded-t-[2rem] border border-black/10 bg-background shadow-[0_-24px_80px_-20px_rgba(28,28,28,0.18)] md:max-h-[min(95vh,920px)] md:w-[min(94vw,1240px)] md:origin-center md:rounded-[2.75rem] md:shadow-[0_40px_100px_-24px_rgba(28,28,28,0.22)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="absolute right-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background md:right-7 md:top-7 md:h-14 md:w-14"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
                  <CaseStudyDetailContent project={selectedProject} layoutEase={layoutEase} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </section>
  );
}

function CaseStudyDetailContent({
  project,
  layoutEase,
}: {
  project: CaseStudy;
  layoutEase: readonly [number, number, number, number];
}) {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const [floaterDragReady, setFloaterDragReady] = useState(false);
  useLayoutEffect(() => {
    setFloaterDragReady(true);
  }, []);

  const threeFloaters = project.floaters?.length === 3 ? project.floaters : null;

  return (
    <div className="relative w-full pb-32">
      <div
        ref={heroRef}
        className={`relative flex min-h-[88svh] flex-col items-center justify-center overflow-x-hidden overflow-y-visible bg-background bg-gradient-to-b px-5 pb-16 pt-28 text-center text-foreground sm:px-8 md:min-h-[92svh] md:px-10 md:pb-20 md:pt-32 ${project.heroLightBg}`}
      >
        {project.showcaseSrc ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <Image
              src={project.showcaseSrc}
              alt=""
              fill
              className={`scale-105 object-cover opacity-[0.14] blur-[2px] saturate-[0.92] ${project.imageObjectClass ?? "object-center"}`}
              sizes="100vw"
              unoptimized
            />
          </div>
        ) : null}

        {project.floaters?.length ? (
          <HeroFloaters
            floaters={project.floaters}
            containerRef={heroRef}
            reduceMotion={!!reduceMotion}
            dragEnabled={floaterDragReady}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_18%_22%,rgba(214,32,58,0.06),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_75%_55%_at_82%_78%,rgba(182,255,0,0.08),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(28,28,28,0.03),transparent_45%)]" />

        <div className="relative z-[40] flex max-w-[min(96vw,1180px)] flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...heroReveal, delay: 0.06 }}
            className={`mb-7 rounded-full border border-foreground/10 bg-white/90 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-foreground shadow-[0_4px_24px_rgba(28,28,28,0.05)] backdrop-blur-md sm:text-xs md:mb-10 md:tracking-[0.35em] ${project.heroAccentMuted}`}
          >
            {project.category}
          </motion.span>

          <div className="relative w-full cursor-default overflow-visible pb-8 text-center md:pb-10">
            <motion.h1
              id={`case-${project.id}-title`}
              initial={{ opacity: 0, y: 52, scale: 0.92, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ ...heroReveal, delay: 0.2 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -14,
                      scale: 1.045,
                      transition: { type: "spring", stiffness: 520, damping: 22, mass: 0.65 },
                    }
              }
              className="relative z-10 mx-auto mb-7 max-w-[16ch] origin-bottom font-heading font-semibold tracking-[-0.045em] text-foreground will-change-transform md:mb-10 md:max-w-none"
              style={{
                fontSize: "clamp(3.25rem, 15vmin, 11rem)",
                lineHeight: 0.88,
              }}
            >
              <span className="inline-block">{project.title}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ...heroReveal, delay: 0.38 }}
              className="relative z-10 mx-auto max-w-[22ch] font-light tracking-tight text-secondary md:max-w-4xl"
              style={{
                fontSize: "clamp(1.35rem, 4.2vmin, 3rem)",
                lineHeight: 1.15,
              }}
            >
              <span className="inline-block">{project.tagline}</span>
            </motion.p>

            {threeFloaters ? (
              <div className="relative z-10 mt-5 flex justify-center md:mt-7" aria-hidden>
                <FloaterSticker
                  floater={threeFloaters[1]}
                  index={1}
                  containerRef={heroRef}
                  reduceMotion={!!reduceMotion}
                  dragEnabled={floaterDragReady}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-background text-foreground">
        {project.caseStudyBoardSrc ? (
          <CaseStudyBoard src={project.caseStudyBoardSrc} title={project.title} />
        ) : (
          <DeviceShowcase project={project} variant="light" />
        )}

        <RevealBlock className="mx-auto max-w-4xl border-t border-divider px-6 py-24 md:py-32">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.35em] text-secondary">Problem</p>
          <p className="font-heading text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl">
            {project.problem}
          </p>
        </RevealBlock>

        <div className="mx-auto max-w-7xl border-t border-divider px-6 py-24 md:py-32">
          <RevealBlock>
            <p className="mb-16 font-mono text-xs uppercase tracking-[0.35em] text-secondary">Process</p>
          </RevealBlock>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {project.process.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: layoutEase }}
                className="group/card rounded-[2.5rem] border border-divider bg-white/80 p-10 shadow-[0_4px_24px_rgba(28,28,28,0.06)] backdrop-blur-sm transition-all duration-500 hover:border-foreground/15 hover:shadow-[0_12px_40px_-8px_rgba(28,28,28,0.12)]"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-divider bg-background text-xl font-bold text-foreground">
                  {i + 1}
                </div>
                <h3 className="mb-4 text-2xl font-bold">{step.title}</h3>
                <p className="leading-relaxed text-secondary">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <RevealBlock className="mx-auto max-w-4xl border-t border-divider px-6 py-24 md:py-32">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.35em] text-secondary">Solution</p>
          <p className="text-2xl font-light leading-relaxed text-foreground/90 md:text-3xl">{project.solution}</p>
        </RevealBlock>

        <RevealBlock className="mx-auto max-w-5xl border-t border-divider px-6 py-32 text-center">
          <p className="mb-10 font-mono text-xs uppercase tracking-[0.35em] text-secondary">Outcome</p>
          <p className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {project.outcome}
          </p>
        </RevealBlock>
      </div>
    </div>
  );
}
