"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

type DesignApproachVideoProps = {
  src?: string;
  /** Optional; omit to avoid flashing a still image while the clip loads or is paused */
  poster?: string;
  heading?: string;
  /** Single short line — kept compact so the video stays visible */
  tagline?: string;
  tags?: string[];
};

const defaultTags = ["Research", "Ideation", "Prototyping"];

/** Smooth ease-out for cinematic reveal (scroll progress → eased t) */
function easeOutCubic(p: number) {
  const x = Math.min(1, Math.max(0, p));
  return 1 - (1 - x) ** 3;
}

export default function DesignApproachVideo({
  src = "/showreel.mp4",
  poster,
  heading = "From Chaos to Clarity",
  tagline = "Systems, craft, and calm interfaces.",
  tags = defaultTags,
}: DesignApproachVideoProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, (p) => {
    if (reduceMotion) return 1;
    const t = easeOutCubic(p);
    return 0.7 + t * 0.3;
  });

  const opacity = useTransform(scrollYProgress, (p) => {
    if (reduceMotion) return 1;
    const t = easeOutCubic(p);
    return 0.22 + t * 0.78;
  });

  const liftY = useTransform(scrollYProgress, (p) => {
    if (reduceMotion) return 0;
    const t = easeOutCubic(p);
    return (1 - t) * 52;
  });

  const labelOpacity = useTransform(scrollYProgress, (p) =>
    reduceMotion ? 1 : 0.35 + easeOutCubic(p) * 0.65
  );

  const captionOpacity = useTransform(scrollYProgress, (p) =>
    reduceMotion ? 1 : 0.45 + easeOutCubic(p) * 0.55
  );

  const captionY = useTransform(scrollYProgress, (p) =>
    reduceMotion ? 0 : (1 - easeOutCubic(p)) * 16
  );

  /**
   * Keep the clip playing through most of the sticky reveal so the browser never
   * falls back to `poster` (which used to be the profile photo and flashed).
   * Only pause near the very top of the section scrub range.
   * Throttled to discrete bands so scroll input is not fighting constant play() calls.
   */
  const playbackBandRef = useRef(-1);
  const syncPlayback = useCallback(
    (p: number) => {
      const v = videoRef.current;
      if (!v) return;
      const t = reduceMotion ? 1 : easeOutCubic(p);
      const band = t >= 0.12 ? 1 : 0;
      if (band === playbackBandRef.current) return;
      playbackBandRef.current = band;

      if (band === 1) {
        void v.play().catch(() => {});
      } else if (!reduceMotion) {
        v.pause();
        try {
          v.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    },
    [reduceMotion]
  );

  useMotionValueEvent(scrollYProgress, "change", syncPlayback);

  useEffect(() => {
    syncPlayback(scrollYProgress.get());
  }, [scrollYProgress, syncPlayback]);

  const glassCaption =
    "rounded-2xl border border-white/45 bg-white/[0.26] px-5 py-4 shadow-[0_16px_50px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-[1.25] md:rounded-[22px] md:px-7 md:py-5";

  return (
    <section
      ref={containerRef}
      id="how-i-design"
      aria-label="Design approach"
      className="relative w-full"
      style={{ height: reduceMotion ? "auto" : "min(175vh, 2400px)" }}
    >
      <div
        className={
          reduceMotion
            ? "relative flex min-h-[92vh] flex-col justify-center px-5 py-20 md:px-10"
            : "sticky top-0 flex h-[100dvh] min-h-[560px] flex-col justify-center overflow-hidden px-5 md:px-10"
        }
      >
        {/* Minimal top label */}
        <motion.p
          className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/50 md:mb-6 md:text-[11px]"
          style={{ opacity: labelOpacity }}
        >
          How I design
        </motion.p>

        {/* Scroll-driven video reveal */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center py-4">
          <motion.div
            className="relative w-full origin-center will-change-transform"
            style={{
              scale,
              opacity,
              y: liftY,
            }}
          >
            <div className="relative overflow-hidden rounded-[18px] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.12)_inset] ring-1 ring-white/15 md:rounded-[22px]">
              <video
                ref={videoRef}
                className="aspect-video h-full w-full object-cover bg-black"
                src={src}
                {...(poster ? { poster } : {})}
                muted
                loop
                playsInline
                preload="auto"
                autoPlay={!!reduceMotion}
                aria-label={heading}
              />
            </div>
          </motion.div>
        </div>

        {/* Compact caption — one tight glass panel */}
        <motion.div
          className="mx-auto mt-6 w-full max-w-2xl md:mt-8"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          <div className={glassCaption}>
            <h2 className="text-center font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {heading}
            </h2>
            <p className="mt-2 text-center font-body text-sm text-foreground/62 md:text-[15px]">{tagline}</p>
            {tags.length > 0 ? (
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/50 md:text-[11px] md:tracking-[0.3em]">
                {tags.join(" · ")}
              </p>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
