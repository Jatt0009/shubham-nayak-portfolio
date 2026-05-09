"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/** Soft ease-out — readable, not snappy */
const easeOutSoft = [0.22, 1, 0.36, 1] as const;

/** Longer draw so the sketch reads clearly */
const DRAW_DURATION_S = 2.35;
/** Stagger tablets so all three don’t hit the eye at once */
const TABLET_STAGGER_S = [0, 0.28, 0.56] as const;
const DRAW_PHASE_END_S = TABLET_STAGGER_S[2] + DRAW_DURATION_S;
/** Portrait begins shortly before wireframe draw phase ends (pulled 0.5s earlier for fast scrollers) */
const PORTRAIT_DELAY_S = Math.max(0, DRAW_PHASE_END_S * 0.8 - 0.5);
/** Gentle photo settle — no harsh pop */
const PORTRAIT_DURATION_S = 1.35;

const STROKE = 1.75;
const STROKE_SUBTLE = 1.5;

/** Per-path offsets inside one tablet (bezel → screen → detail) */
const PATH_OFFSET_IN_TABLET_S = [0, 0.14, 0.28] as const;

type WireTabletProps = {
  /** Unique prefix for mask ids if needed */
  id: string;
  /** Outer bezel path */
  bezel: string;
  /** Inner screen path */
  screen: string;
  /** Optional accent path (home indicator, etc.) */
  detail?: string;
  className?: string;
  /** Scroll-driven vertical offset (px) */
  parallaxY: MotionValue<string>;
  /** Delay before this tablet starts drawing */
  drawDelay: number;
  isInView: boolean;
  reduceMotion: boolean;
};

function WireTablet({
  id,
  bezel,
  screen,
  detail,
  className,
  parallaxY,
  drawDelay,
  isInView,
  reduceMotion,
}: WireTabletProps) {
  const revealed = reduceMotion || isInView;

  const pathTransition = (pathIndex: number) =>
    reduceMotion
      ? { duration: 0 }
      : {
          duration: DRAW_DURATION_S,
          ease: easeOutSoft,
          delay: drawDelay + PATH_OFFSET_IN_TABLET_S[pathIndex],
        };

  return (
    <motion.div className={className} style={{ y: parallaxY }} aria-hidden>
      <svg
        viewBox="0 0 220 280"
        className="h-auto w-full max-w-[min(42vw,220px)] md:max-w-[240px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d={bezel}
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="text-foreground/55"
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: revealed ? 1 : 0 }}
          transition={pathTransition(0)}
        />
        <motion.path
          d={screen}
          stroke="currentColor"
          strokeWidth={STROKE_SUBTLE}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="text-foreground/38"
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: revealed ? 1 : 0 }}
          transition={pathTransition(1)}
        />
        {detail ? (
          <motion.path
            id={`${id}-detail`}
            d={detail}
            stroke="currentColor"
            strokeWidth={STROKE_SUBTLE}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="text-foreground/42"
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: revealed ? 1 : 0 }}
            transition={pathTransition(2)}
          />
        ) : null}
      </svg>
    </motion.div>
  );
}

const TABLET_A = {
  bezel:
    "M 52 32h116a14 14 0 0 1 14 14v188a14 14 0 0 1-14 14H52a14 14 0 0 1-14-14V46a14 14 0 0 1 14-14z",
  screen: "M 62 54h96a6 6 0 0 1 6 6v152a6 6 0 0 1-6 6H62a6 6 0 0 1-6-6V60a6 6 0 0 1 6-6z",
  detail: "M 88 246h44",
};

const TABLET_B = {
  bezel:
    "M 44 26h132a16 16 0 0 1 16 16v196a16 16 0 0 1-16 16H44a16 16 0 0 1-16-16V42a16 16 0 0 1 16-16z",
  screen: "M 56 52h108a8 8 0 0 1 8 8v148a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V60a8 8 0 0 1 8-8z",
  detail: "M 94 252h32",
};

const TABLET_C = {
  bezel:
    "M 48 38h124a12 12 0 0 1 12 12v180a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12V50a12 12 0 0 1 12-12z",
  screen: "M 58 58h104a5 5 0 0 1 5 5v138a5 5 0 0 1-5 5H58a5 5 0 0 1-5-5V63a5 5 0 0 1 5-5z",
  detail: "M 92 244h36",
};

type AboutWireframeRevealProps = {
  imageSrc: string;
  imageAlt: string;
  /** Scroll 0→1 for subtle vertical depth */
  depthProgress: MotionValue<number>;
};

export default function AboutWireframeReveal({
  imageSrc,
  imageAlt,
  depthProgress,
}: AboutWireframeRevealProps) {
  const reduceMotion = useReducedMotion();
  const rm = Boolean(reduceMotion);
  const revealRef = useRef<HTMLDivElement>(null);
  /* Trigger when more of the block is visible — avoids surprising mid-viewport pops */
  const isInView = useInView(revealRef, { once: true, margin: "-6%", amount: 0.4 });

  /* Background layers move slower (smaller amplitude) than portrait — kept subtle */
  const yBg1 = useTransform(depthProgress, [0, 1], rm ? [0, 0] : [0, 10]);
  const yBg2 = useTransform(depthProgress, [0, 1], rm ? [0, 0] : [0, 16]);
  const yBg3 = useTransform(depthProgress, [0, 1], rm ? [0, 0] : [0, 22]);
  const yPortrait = useTransform(depthProgress, [0, 1], rm ? [0, 0] : [0, 34]);

  const yBg1px = useTransform(yBg1, (v) => `${v}px`);
  const yBg2px = useTransform(yBg2, (v) => `${v}px`);
  const yBg3px = useTransform(yBg3, (v) => `${v}px`);
  const yPortraitPx = useTransform(yPortrait, (v) => `${v}px`);

  return (
    <div
      ref={revealRef}
      className="relative mx-auto my-[clamp(2.75rem,8vw,5rem)] flex w-full max-w-[min(100%,400px)] justify-center md:my-[clamp(3.25rem,9vw,6rem)] md:max-w-[440px]"
    >
      {/* Background wireframes — z-0 */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-visible">
        <WireTablet
          id="w-a"
          bezel={TABLET_A.bezel}
          screen={TABLET_A.screen}
          detail={TABLET_A.detail}
          parallaxY={yBg1px}
          drawDelay={TABLET_STAGGER_S[0]}
          isInView={isInView}
          reduceMotion={rm}
          className="absolute left-[-8%] top-[6%] w-[58%] -rotate-[9deg] md:left-[-12%] md:top-[4%] md:w-[52%]"
        />
        <WireTablet
          id="w-b"
          bezel={TABLET_B.bezel}
          screen={TABLET_B.screen}
          detail={TABLET_B.detail}
          parallaxY={yBg2px}
          drawDelay={TABLET_STAGGER_S[1]}
          isInView={isInView}
          reduceMotion={rm}
          className="absolute right-[-6%] top-[14%] w-[56%] rotate-[11deg] opacity-90 md:right-[-10%] md:top-[12%] md:w-[50%]"
        />
        <WireTablet
          id="w-c"
          bezel={TABLET_C.bezel}
          screen={TABLET_C.screen}
          detail={TABLET_C.detail}
          parallaxY={yBg3px}
          drawDelay={TABLET_STAGGER_S[2]}
          isInView={isInView}
          reduceMotion={rm}
          className="absolute left-[18%] bottom-[-4%] w-[54%] -rotate-[5deg] md:left-[14%] md:bottom-[-6%] md:w-[48%]"
        />
      </div>

      {/* Portrait — z-10 */}
      <motion.div
        className="relative z-10 aspect-[3/4] w-[min(72vw,280px)] md:w-[300px]"
        style={{ y: yPortraitPx }}
        initial={rm ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : rm ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{
          duration: rm ? 0 : PORTRAIT_DURATION_S,
          ease: easeOutSoft,
          delay: rm ? 0 : PORTRAIT_DELAY_S,
        }}
      >
        <div className="relative z-10 h-full w-full overflow-hidden rounded-[28px] shadow-[0_28px_70px_-28px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.55)_inset] ring-1 ring-foreground/[0.06]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width:768px) 72vw, 300px"
            className="object-cover object-[center_18%]"
            priority={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
