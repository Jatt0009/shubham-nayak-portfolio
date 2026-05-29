"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import DeviceShowcase from "../case-study/DeviceShowcase";
import EditorialCaseStudyCollage from "../case-study/EditorialCaseStudyCollage";
import { CASE_STUDIES, type CaseStudy, type CaseStudyFloater } from "@/lib/caseStudies";
import { flushScrollContainer, resetElementScrollAxes } from "@/lib/caseStudyScrollReset";

const layoutEase = [0.22, 1, 0.36, 1] as const;
const modalOverlayTransition = { duration: 0.28, ease: layoutEase };
const modalPanelTransition = { duration: 0.36, ease: layoutEase };

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
  "h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 lg:h-[15rem] lg:w-[15rem]";

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
  const renderFloaterContent = () => {
    if (floater.src) {
      return (
        <Image
          src={floater.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 220px, (min-width: 768px) 192px, 128px"
            className="object-contain drop-shadow-[0_20px_44px_rgba(28,28,28,0.18)] [filter:drop-shadow(0_0_18px_rgba(47,143,133,0.32))]"
          draggable={false}
          unoptimized
        />
      );
    }

    return (
      <div
        className={`flex h-full w-full select-none flex-col items-center justify-center rounded-[2rem] border px-3 text-center shadow-[0_20px_46px_rgba(28,28,28,0.14),0_0_24px_rgba(47,143,133,0.24)] ${floater.toneClassName ?? "border-divider bg-white text-foreground"}`}
      >
        <span className="mb-2 text-3xl leading-none">{floater.icon ?? "✨"}</span>
        <span className="max-w-[12ch] text-xs font-semibold leading-snug tracking-tight md:text-sm">
          {floater.label ?? "Case highlight"}
        </span>
      </div>
    );
  };

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
          {renderFloaterContent()}
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
          {renderFloaterContent()}
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

function ExplodedAssemblyCard({
  project,
  style,
  onSelect,
}: {
  project: CaseStudy;
  style: MotionStyle;
  onSelect: (id: string) => void;
}) {
  const displaySrc = project.collageBackgroundSrc ?? project.showcaseSrc;
  const imageUnoptimized = Boolean(displaySrc?.startsWith("/"));

  return (
    <motion.article
      style={style}
      className="absolute left-1/2 top-1/2 h-[clamp(250px,36vw,350px)] w-[min(86vw,420px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-[1.8rem] border border-white/15 bg-[#0b0b0b] shadow-[0_32px_90px_-36px_rgba(0,0,0,0.72)] outline-none ring-1 ring-white/10"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project.id);
        }
      }}
      aria-label={`Open case study: ${project.title}`}
    >
      <div className="relative h-full w-full">
        {displaySrc ? (
          <Image
            src={displaySrc}
            alt=""
            fill
            sizes="(max-width: 768px) 88vw, 420px"
            unoptimized={imageUnoptimized}
            className={`object-cover brightness-[0.74] contrast-[1.06] ${project.collageImageClass ?? ""} ${project.imageObjectClass ?? "object-center"}`}
          />
        ) : (
          <div className={`absolute inset-0 ${project.bgLight}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/36 via-black/10 to-black/0" />
      </div>
    </motion.article>
  );
}

function ExplodedAssembly({
  projects,
  onSelect,
}: {
  projects: CaseStudy[];
  onSelect: (id: string) => void;
}) {
  const assemblyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [a, b, c] = projects;
  const { scrollYProgress } = useScroll({
    target: assemblyRef,
    offset: ["start 78%", "end 22%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.32,
  });

  const leftX = useTransform(progress, [0, 0.35, 0.72, 1], [0, -170, -240, -255]);
  const leftY = useTransform(progress, [0, 0.35, 0.72, 1], [0, -8, -18, -20]);
  const leftScale = useTransform(progress, [0, 0.3, 0.72, 1], [1, 0.92, 0.88, 0.88]);
  const leftOpacity = useTransform(progress, [0, 0.08, 0.2, 1], [0, 0.25, 1, 1]);
  const leftRotate = useTransform(progress, [0, 0.35, 1], [0, -8, -4]);
  const leftZ = useTransform(progress, [0, 1], [30, 20]);

  const midX = useTransform(progress, [0, 0.35, 0.72, 1], [0, 0, 0, 0]);
  const midY = useTransform(progress, [0, 0.35, 0.72, 1], [0, 0, -6, -8]);
  const midScale = useTransform(progress, [0, 0.35, 0.72, 1], [1, 1.02, 0.96, 0.96]);
  const midOpacity = useTransform(progress, [0, 1], [1, 1]);
  const midRotate = useTransform(progress, [0, 0.35, 1], [0, 0, 1]);
  const midZ = useTransform(progress, [0, 0.45, 1], [40, 38, 22]);

  const rightX = useTransform(progress, [0, 0.35, 0.72, 1], [0, 170, 240, 255]);
  const rightY = useTransform(progress, [0, 0.35, 0.72, 1], [0, -8, -18, -20]);
  const rightScale = useTransform(progress, [0, 0.3, 0.72, 1], [1, 0.92, 0.88, 0.88]);
  const rightOpacity = useTransform(progress, [0, 0.08, 0.2, 1], [0, 0.25, 1, 1]);
  const rightRotate = useTransform(progress, [0, 0.35, 1], [0, 8, 4]);
  const rightZ = useTransform(progress, [0, 1], [30, 20]);

  if (!a || !b || !c) return null;

  return (
    <div ref={assemblyRef} className="relative h-[190vh] w-full">
      <div className="sticky top-[10vh] isolate h-[80vh] overflow-visible">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem] border border-foreground/[0.1] bg-gradient-to-br from-white/75 via-background to-[#ebe6df]/95 shadow-[0_22px_70px_-28px_rgba(28,28,28,0.16)] ring-1 ring-accent/15 md:rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-[#faf8f5] to-[#f0ebe6]/95" />
        </div>
        <div className="absolute inset-0 z-[5] flex justify-center">
          <div className="relative h-full w-full max-w-[1100px] pt-14 md:pt-16">
              <ExplodedAssemblyCard
                project={a}
                onSelect={onSelect}
                style={{
                  x: leftX,
                  y: leftY,
                  scale: reduceMotion ? 0.84 : leftScale,
                  opacity: reduceMotion ? 1 : leftOpacity,
                  rotate: reduceMotion ? -4 : leftRotate,
                  zIndex: leftZ,
                }}
              />
              <ExplodedAssemblyCard
                project={b}
                onSelect={onSelect}
                style={{
                  x: midX,
                  y: midY,
                  scale: reduceMotion ? 0.92 : midScale,
                  opacity: 1,
                  rotate: reduceMotion ? 0 : midRotate,
                  zIndex: midZ,
                }}
              />
              <ExplodedAssemblyCard
                project={c}
                onSelect={onSelect}
                style={{
                  x: rightX,
                  y: rightY,
                  scale: reduceMotion ? 0.84 : rightScale,
                  opacity: reduceMotion ? 1 : rightOpacity,
                  rotate: reduceMotion ? 4 : rightRotate,
                  zIndex: rightZ,
                }}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumCaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const collageScrollerRef = useRef<HTMLDivElement>(null);
  const caseStudyBodyRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const featuredProjects = CASE_STUDIES.filter((project) =>
    ["glowup", "pawspal", "medbook"].includes(project.id),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCaseStudy = useCallback((id: string) => {
    resetElementScrollAxes(collageScrollerRef.current, true, false);
    setSelectedId(id);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setSelectedId(null);
  }, []);

  const modalOpen = selectedId !== null;
  const selectedProject = CASE_STUDIES.find((p) => p.id === selectedId);

  /**
   * Lock background scroll while the sheet is open.
   * Prefer overflow-only lock: `position: fixed` on body often breaks hosting/Safari stacks and can blank the page.
   */
  useEffect(() => {
    if (!modalOpen) return;
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    try {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } catch {
      /* ignore */
    }

    return () => {
      try {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
      } catch {
        /* ignore */
      }
    };
  }, [modalOpen]);

  const bindCaseStudyScroller = useCallback((node: HTMLDivElement | null) => {
    caseStudyBodyRef.current = node;
  }, []);

  const overlayTransition = reduceMotion ? { duration: 0 } : modalOverlayTransition;
  const panelTransition = reduceMotion ? { duration: 0 } : modalPanelTransition;
  const panelInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 };
  const panelAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 };
  const panelExit = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 };

  const caseStudyModal = mounted ? (
    <AnimatePresence>
      {selectedId && selectedProject && (
        <motion.div
          key={selectedProject.id}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/76 p-4 md:bg-black/70 md:p-6"
          onClick={closeCaseStudy}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`case-${selectedProject.id}-title`}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
            onAnimationComplete={() => flushScrollContainer(caseStudyBodyRef.current)}
            className="relative w-full max-h-[min(100dvh,920px)] origin-center overflow-hidden rounded-t-[2rem] border border-black/10 bg-background shadow-[0_-24px_80px_-20px_rgba(28,28,28,0.18)] md:max-h-[min(95vh,920px)] md:w-[min(94vw,1240px)] md:rounded-[2.75rem] md:shadow-[0_40px_100px_-24px_rgba(28,28,28,0.22)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCaseStudy}
              className="absolute right-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background md:right-7 md:top-7 md:h-14 md:w-14"
            >
              <X className="h-6 w-6" />
            </button>

            <div
              ref={bindCaseStudyScroller}
              className="max-h-[88vh] overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] md:max-h-[min(92vh,860px)]"
            >
              <CaseStudyDetailContent project={selectedProject} layoutEase={layoutEase} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ) : null;

  return (
    <>
    <section
      className="relative w-full scroll-mt-20 overflow-hidden py-28 md:py-36"
      id="projects"
      aria-labelledby="case-studies-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(100%,920px)] bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(182,255,0,0.16),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-foreground/[0.045] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(28,28,28,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(28,28,28,0.045)_1px,transparent_1px)] [background-size:52px_52px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-gradient-to-b from-[#0b0d0c]/98 via-[#070808]/99 to-[#030404] p-8 shadow-[0_56px_140px_-36px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-accent/30 backdrop-blur-md md:rounded-[2.25rem] md:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute -inset-x-24 -top-24 h-44 rounded-full bg-accent/20 blur-[80px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-6 right-6 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-95 md:left-10 md:right-10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 top-1/2 h-[min(420px,70%)] w-[min(420px,55vw)] -translate-y-1/2 rounded-full bg-accent/[0.12] blur-[100px]"
            aria-hidden
          />

          <RevealBlock className="relative mb-12 md:mb-14">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-14">
              <div
                className="hidden shrink-0 rounded-full bg-gradient-to-b from-accent via-accent to-accent-ink/35 md:block md:w-1.5 md:self-stretch md:min-h-[11rem]"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <h2
                  id="case-studies-heading"
                  className="mb-5 font-heading text-5xl font-bold tracking-tight text-white md:mb-6 md:text-7xl"
                >
                  Selected <br />
                  <span className="relative inline-block text-accent">
                    Case Studies.
                    <span className="absolute -bottom-2 left-0 h-1 w-[min(12rem,55%)] rounded-full bg-gradient-to-r from-accent to-accent/40 md:-bottom-2.5 md:h-1.5" />
                  </span>
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl">
                  A deep dive into my process, from complex problems to elegant, human-centric solutions.
                </p>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock className="relative" delay={0.08}>
            <EditorialCaseStudyCollage
              ref={collageScrollerRef}
              projects={featuredProjects}
              onProjectSelect={openCaseStudy}
            />
          </RevealBlock>

          <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-white/55 md:mt-10 md:text-xs md:tracking-[0.34em]">
            More stories are unfolding on Behance.
          </p>
        </div>
      </div>
    </section>
    {mounted && typeof document !== "undefined" ? createPortal(caseStudyModal, document.body) : null}
    </>
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
