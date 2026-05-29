"use client";

import { forwardRef, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject, Ref, RefCallback } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { CaseStudy } from "@/lib/caseStudies";

const layoutEase = [0.22, 1, 0.36, 1] as const;

function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const r of refs) {
      if (typeof r === "function") {
        r(node);
      } else if (r) {
        (r as MutableRefObject<T | null>).current = node;
      }
    }
  };
}

function Card({
  project,
  onSelect,
  index,
}: {
  project: CaseStudy;
  onSelect: (id: string) => void;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const displaySrc = project.collageBackgroundSrc ?? project.showcaseSrc;
  const imageUnoptimized = Boolean(displaySrc?.startsWith("/"));
  const imgPos = project.collageBackgroundSrc ? "object-center" : project.imageObjectClass ?? "object-center";
  const parallaxOffset = index % 2 === 0 ? -16 : 16;
  const parallaxTilt = index % 2 === 0 ? -1.4 : 1.4;

  return (
    <motion.article
      initial={
        reduceMotion
          ? undefined
          : { opacity: 0, x: -90, y: 18, rotate: -2.4, filter: "blur(10px)" }
      }
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{
        duration: 0.7,
        delay: reduceMotion ? 0 : index * 0.14,
        ease: layoutEase,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -10,
              scale: 1.035,
              boxShadow: "0 38px 95px -40px rgba(28,28,28,0.58)",
              transition: { duration: 0.26, ease: "easeOut" },
            }
      }
      style={reduceMotion ? undefined : { transformPerspective: 1200 }}
      className="group relative h-[min(58vh,440px)] w-[min(84vw,520px)] shrink-0 cursor-pointer overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#0c0c0c] shadow-[0_18px_56px_-24px_rgba(28,28,28,0.3)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
      <motion.div
        className="relative h-full w-full"
        initial={reduceMotion ? undefined : { x: parallaxOffset, rotateY: parallaxTilt, scale: 1.02 }}
        whileInView={reduceMotion ? undefined : { x: 0, rotateY: 0, scale: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{
          duration: 0.9,
          delay: reduceMotion ? 0 : 0.08 + index * 0.12,
          ease: layoutEase,
        }}
      >
        {displaySrc ? (
          <Image
            src={displaySrc}
            alt=""
            fill
            sizes="(max-width: 768px) 84vw, (max-width: 1200px) 62vw, 580px"
            draggable={false}
            unoptimized={imageUnoptimized}
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${project.collageImageClass ?? ""} ${imgPos}`}
          />
        ) : (
          <div className={`absolute inset-0 ${project.bgLight}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-black/5" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5 lg:p-6">
          <div className="max-w-[22rem] rounded-xl border border-[#ffe29a]/35 bg-[#050505]/40 px-4 py-3 backdrop-blur-[22px]">
            <h3 className="font-heading text-xl font-semibold leading-tight tracking-tight text-[#ffe7a8] md:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#ffeab6] md:text-[11px]">
              {project.category}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default forwardRef<HTMLDivElement, {
  projects: CaseStudy[];
  onProjectSelect: (id: string) => void;
}>(function EditorialCaseStudyCollage({ projects, onProjectSelect }, ref) {
  const ordered = projects.slice(0, 4);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedScrollerRef = useMemo(() => composeRefs(scrollerRef, ref), [ref]);
  const reduceMotion = useReducedMotion();
  const isPausedRef = useRef(false);
  const inView = useInView(rootRef, { once: true, margin: "-12% 0px" });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || reduceMotion || !inView) return;

    const getMaxScroll = () => scroller.scrollWidth - scroller.clientWidth;
    if (getMaxScroll() <= 0) return;

    let rafId = 0;
    let direction = 1;
    let lastTime = 0;
    let startedAt = 0;
    const speedPxPerSecond = 58;
    const START_DELAY_MS = 850;

    const tick = (time: number) => {
      if (lastTime === 0) lastTime = time;
      if (startedAt === 0) startedAt = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPausedRef.current && time - startedAt >= START_DELAY_MS) {
        const max = getMaxScroll();
        if (max > 0) {
          const next = scroller.scrollLeft + direction * speedPxPerSecond * delta;
          if (next >= max) {
            scroller.scrollLeft = max;
            direction = -1;
          } else if (next <= 0) {
            scroller.scrollLeft = 0;
            direction = 1;
          } else {
            scroller.scrollLeft = next;
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [inView, reduceMotion, ordered.length]);

  if (ordered.length === 0) return null;

  return (
    <motion.div
      ref={rootRef}
      initial={reduceMotion ? undefined : { opacity: 0, y: 26, clipPath: "inset(0 100% 0 0 round 2rem)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0 round 2rem)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: layoutEase }}
      className="relative overflow-hidden rounded-[1.75rem] border border-foreground/[0.1] bg-gradient-to-br from-white/75 via-background to-[#ebe6df]/95 shadow-[0_22px_70px_-28px_rgba(28,28,28,0.16)] ring-1 ring-accent/15 md:rounded-[2rem]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/90 via-[#faf8f5] to-[#f0ebe6]/95"
        aria-hidden
      />
      <div
        ref={mergedScrollerRef}
        className="relative overflow-x-auto p-5 md:p-6 lg:p-8"
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
        onTouchStart={() => {
          isPausedRef.current = true;
        }}
        onTouchEnd={() => {
          isPausedRef.current = false;
        }}
      >
        <div className="flex w-max min-h-[min(58vh,440px)] gap-5 md:gap-6 lg:gap-8">
          {ordered.map((project, i) => (
            <Card key={project.id} project={project} onSelect={onProjectSelect} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
});
