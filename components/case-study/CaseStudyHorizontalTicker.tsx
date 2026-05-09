"use client";

import { useLayoutEffect, useRef } from "react";
import { Sparkles, Droplets, HeartHandshake } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Token =
  | { type: "word"; value: string }
  | { type: "curve" }
  | { type: "icon"; value: "sparkles" | "droplets" | "together" };

const sentenceFlow: Token[] = [
  { type: "word", value: "In" },
  { type: "word", value: "every" },
  { type: "word", value: "bottle," },
  { type: "curve" },
  { type: "word", value: "discover" },
  { type: "word", value: "the" },
  { type: "word", value: "undeniable" },
  { type: "word", value: "Real" },
  { type: "word", value: "Magic" },
  { type: "icon", value: "sparkles" },
  { type: "word", value: "of" },
  { type: "word", value: "sharing" },
  { type: "word", value: "pure" },
  { type: "word", value: "Refreshment" },
  { type: "icon", value: "droplets" },
  { type: "word", value: "that" },
  { type: "word", value: "brings" },
  { type: "word", value: "us" },
  { type: "word", value: "Together" },
  { type: "icon", value: "together" },
];

function InlineCurve() {
  return (
    <svg
      className="h-5 w-[96px] shrink-0 text-accent md:h-6 md:w-[124px]"
      viewBox="0 0 124 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2 18C19 5 35 5 52 18C69 31 86 31 102 18C108 13 114 10 122 10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InlineIcon({ value }: { value: "sparkles" | "droplets" | "together" }) {
  const baseClass = "h-5 w-5 shrink-0 text-accent md:h-6 md:w-6";
  if (value === "sparkles") return <Sparkles className={baseClass} aria-hidden />;
  if (value === "droplets") return <Droplets className={baseClass} aria-hidden />;
  return <HeartHandshake className={baseClass} aria-hidden />;
}

type CaseStudyHorizontalTickerProps = {
  embedded?: boolean;
};

export default function CaseStudyHorizontalTicker({ embedded = false }: CaseStudyHorizontalTickerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const ctx = gsap.context(() => {
      const createAnimation = () => {
        const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (distance <= 0) return;

        gsap.set(track, { x: 0 });
        gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: () => `+=${distance}`,
            scrub: 0.7,
          },
        });
      };

      createAnimation();
      ScrollTrigger.addEventListener("refreshInit", createAnimation);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", createAnimation);
      };
    }, section);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={sectionRef}
      className={
        embedded
          ? "relative overflow-hidden px-2 py-2 md:px-3"
          : "relative overflow-hidden rounded-[1.5rem] border border-accent/20 bg-gradient-to-r from-[#111311] via-[#0d0f0d] to-[#111311] px-5 py-6 shadow-[0_20px_58px_-28px_rgba(0,0,0,0.7)] md:rounded-[1.75rem] md:px-8 md:py-8"
      }
      aria-label="Scrolling sentence about case study storytelling"
    >
      <div
        ref={viewportRef}
        className={`${reduceMotion ? "overflow-x-auto" : "overflow-hidden"} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        <div
          ref={trackRef}
          className={`flex w-max items-center whitespace-nowrap font-semibold tracking-tight ${
            embedded
              ? "text-[clamp(1rem,2.1vw,1.7rem)] text-foreground/35"
              : "text-[clamp(1.5rem,3vw,2.7rem)] text-[#f5f5f1]"
          }`}
        >
          {sentenceFlow.map((item, index) => {
            if (item.type === "curve") {
              return (
                <span key={`curve-${index}`} className="mx-7 inline-flex items-center md:mx-10">
                  <InlineCurve />
                </span>
              );
            }
            if (item.type === "icon") {
              return (
                <span key={`icon-${index}`} className="mx-5 inline-flex items-center md:mx-7">
                  <InlineIcon value={item.value} />
                </span>
              );
            }

            return (
              <span key={`word-${index}`} className="mr-3 inline-flex items-center md:mr-4">
                {item.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
