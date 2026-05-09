"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

export type ProcessStage = {
  label: string;
  /** Playback starts here when this frame is in focus */
  startSec: number;
  description: string;
  /** Override video file per stage (defaults to section `src`) */
  clipSrc?: string;
  poster?: string;
};

const DEFAULT_STAGES: ProcessStage[] = [
  {
    label: "Research",
    startSec: 0,
    description:
      "Discovery interviews, competitive audits, and problem framing — aligning user needs with goals before pixels.",
  },
  {
    label: "Ideation",
    startSec: 12,
    description:
      "Sketching flows and divergent concepts: clarity, affordances, and narrative before committing to layout.",
  },
  {
    label: "Wireframing",
    startSec: 24,
    description:
      "Low-fidelity structure and hierarchy — content models, breakpoints, and scalable patterns.",
  },
  {
    label: "Prototyping",
    startSec: 36,
    description:
      "Clickable prototypes with motion and micro-interactions to validate flows early.",
  },
  {
    label: "Testing",
    startSec: 48,
    description:
      "Usability sessions and iteration loops — turning friction into measurable improvements.",
  },
  {
    label: "Final design",
    startSec: 60,
    description:
      "Polished UI, specs, and handoff assets built for engineering and long-term systems.",
  },
];

type DesignProcessVideoProps = {
  src?: string;
  poster?: string;
  stages?: ProcessStage[];
  eyebrow?: string;
  title?: string;
};

function FilmPerforations({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-6 z-[2] flex w-4 flex-col justify-evenly py-2 ${side === "left" ? "left-0" : "right-0"}`}
      aria-hidden
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="mx-auto h-2 w-2 shrink-0 rounded-full bg-[#0c0c0c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06]"
        />
      ))}
    </div>
  );
}

export default function DesignProcessVideo({
  src = "/design-process.mp4",
  poster = "/profile_pic.jpg",
  stages = DEFAULT_STAGES,
  eyebrow = "Process",
  title = "Design process",
}: DesignProcessVideoProps) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [stripReady, setStripReady] = useState(false);

  const segmentEnd = useCallback(
    (index: number) => {
      const d = durations[index];
      const nextStart = stages[index + 1]?.startSec;
      if (nextStart != null && Number.isFinite(nextStart)) return nextStart;
      if (d && Number.isFinite(d)) return d;
      return Infinity;
    },
    [durations, stages]
  );

  const updateFocusedFromScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const centerX = cr.left + cr.width / 2;
    let best = 0;
    let bestDist = Infinity;
    frameRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const d = Math.abs(mid - centerX);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setFocusedIndex((prev) => (prev !== best ? best : prev));
  }, []);

  const onStripScroll = useCallback(() => {
    updateFocusedFromScroll();
  }, [updateFocusedFromScroll]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFocusedFromScroll);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    updateFocusedFromScroll();
    setStripReady(true);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("scroll", onScroll);
    };
  }, [updateFocusedFromScroll, stages.length]);

  useEffect(() => {
    if (!stripReady) return;
    const t = window.setTimeout(updateFocusedFromScroll, 120);
    return () => window.clearTimeout(t);
  }, [stripReady, updateFocusedFromScroll]);

  useEffect(() => {
    window.addEventListener("resize", updateFocusedFromScroll);
    return () => window.removeEventListener("resize", updateFocusedFromScroll);
  }, [updateFocusedFromScroll]);

  /** Sync playback to focused frame */
  useEffect(() => {
    if (reduceMotion) {
      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        v.pause();
        try {
          v.currentTime = stages[i]?.startSec ?? 0;
        } catch {
          /* ignore */
        }
      });
      return;
    }

    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      const stage = stages[i];
      if (!stage) return;

      if (i === focusedIndex) {
        const start = stage.startSec;
        const end = segmentEnd(i);
        try {
          if (v.currentTime < start || (end !== Infinity && v.currentTime >= end - 0.08)) {
            v.currentTime = start;
          }
        } catch {
          /* ignore */
        }
        void v.play().catch(() => {});
      } else {
        v.pause();
        try {
          v.currentTime = stage.startSec;
        } catch {
          /* ignore */
        }
      }
    });
  }, [focusedIndex, reduceMotion, stages, segmentEnd]);

  /** Loop focused clip within its segment */
  useEffect(() => {
    if (reduceMotion) return;
    const v = videoRefs.current[focusedIndex];
    if (!v) return;
    const start = stages[focusedIndex]?.startSec ?? 0;
    const end = segmentEnd(focusedIndex);

    const onTime = () => {
      if (Number.isFinite(end) && v.currentTime >= end - 0.06) {
        v.currentTime = start;
        return;
      }
      const dur = v.duration;
      if (
        !Number.isFinite(end) &&
        dur > 0 &&
        !Number.isNaN(dur) &&
        v.currentTime >= dur - 0.08
      ) {
        v.currentTime = start;
      }
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [focusedIndex, reduceMotion, segmentEnd, stages]);

  const onVideoMeta = useCallback((index: number, el: HTMLVideoElement) => {
    const d = el.duration;
    if (Number.isFinite(d) && d > 0) {
      setDurations((prev) => ({ ...prev, [index]: d }));
    }
  }, []);

  const scrollToFrame = useCallback((index: number) => {
    const container = scrollRef.current;
    const frame = frameRefs.current[index];
    if (!container || !frame) return;
    const fc = frame.offsetLeft + frame.offsetWidth / 2;
    const target = fc - container.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToFrame(Math.min(stages.length - 1, focusedIndex + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToFrame(Math.max(0, focusedIndex - 1));
      }
    },
    [focusedIndex, stages.length, scrollToFrame]
  );

  return (
    <section
      id="design-process"
      aria-label="Design process film strip"
      className="relative overflow-hidden bg-[#060606] py-24 text-white md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(182,255,0,0.07),transparent_55%),radial-gradient(ellipse_45%_35%_at_80%_90%,rgba(255,255,255,0.03),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-[1] mx-auto max-w-[1600px] px-6 md:px-10">
        <header className="mb-14 max-w-xl md:mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-white/40 md:text-[11px]">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.08]">
            {title}
          </h2>
          <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-white/50 md:text-base">
            Each frame is a chapter. The centered reel plays while the rest hold
            their beat.
          </p>
        </header>
      </div>

      {/* Horizontal film strip */}
      <div className="relative z-[1]">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-16 bg-gradient-to-r from-[#060606] to-transparent md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-16 bg-gradient-to-l from-[#060606] to-transparent md:w-28"
          aria-hidden
        />

        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Design process video clips"
          onKeyDown={onKeyDown}
          style={{
            scrollPaddingInline: "max(1.5rem, calc(50vw - min(36vw, 220px)))",
          }}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] outline-none md:gap-8 [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#060606]"
          onScroll={onStripScroll}
        >
          {stages.map((stage, i) => {
            const isFocused = i === focusedIndex;
            const clipSrc = stage.clipSrc ?? src;

            return (
              <motion.article
                key={`${stage.label}-${i}`}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                layout={false}
                initial={false}
                animate={{
                  scale: reduceMotion ? 1 : isFocused ? 1 : 0.94,
                  opacity: reduceMotion ? 1 : isFocused ? 1 : 0.55,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                }}
                className="group relative w-[min(72vw,440px)] shrink-0 snap-center md:w-[min(56vw,520px)]"
              >
                <div
                  className={[
                    "relative overflow-hidden rounded-[10px] bg-[#111] shadow-[0_32px_90px_-40px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(255,255,255,0.06)] ring-1 ring-white/[0.05]",
                    "aspect-[2.35/1]",
                  ].join(" ")}
                >
                  <FilmPerforations side="left" />
                  <FilmPerforations side="right" />

                  <div className="absolute inset-x-5 inset-y-4 z-[1] overflow-hidden rounded-[4px] bg-black md:inset-x-6 md:inset-y-5">
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      className="h-full w-full object-cover"
                      src={clipSrc}
                      poster={stage.poster ?? poster}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => onVideoMeta(i, e.currentTarget)}
                      aria-label={`${stage.label} — design process`}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25"
                      aria-hidden
                    />
                  </div>

                  <div className="absolute bottom-6 left-1/2 z-[4] max-w-[85%] -translate-x-1/2 text-center md:bottom-7">
                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/55 md:text-[10px]">
                      {String(i + 1).padStart(2, "0")} · {stage.label}
                    </p>
                  </div>

                  <div
                    className={[
                      "pointer-events-none absolute inset-x-8 top-5 z-[4] h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isFocused
                        ? "bg-accent/85 opacity-100 shadow-[0_0_24px_rgba(182,255,0,0.35)]"
                        : "bg-transparent opacity-0",
                    ].join(" ")}
                    aria-hidden
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="relative z-[1] mx-auto mt-12 max-w-[1600px] px-6 md:mt-14 md:px-10">
        <div className="mx-auto max-w-lg md:mx-0 md:max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={focusedIndex}
              initial={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: -8 }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/85">
                {stages[focusedIndex]?.label}
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-white/72 md:text-[15px] md:leading-relaxed">
                {stages[focusedIndex]?.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <p className="mt-10 font-mono text-[9px] uppercase tracking-[0.32em] text-white/30 md:text-[10px]">
            Drag or swipe · Arrow keys when focused
          </p>
        </div>
      </div>
    </section>
  );
}
