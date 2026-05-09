"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function VintageDriveShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isBoosted, setIsBoosted] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 96%", "start 26%"],
  });
  const smoothedProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 102,
    mass: 0.85,
  });
  const unfoldProgress = reduceMotion ? scrollYProgress : smoothedProgress;
  const scale = useTransform(unfoldProgress, [0, 0.82, 0.92, 1], [0.08, 1.03, 0.988, 1]);
  const rotate = useTransform(unfoldProgress, [0, 0.88, 1], [-38, 1.6, 0]);
  const y = useTransform(unfoldProgress, [0, 0.82, 0.92, 1], [150, -10, 4, 0]);
  const opacity = useTransform(unfoldProgress, [0, 1], [0.12, 1]);
  const borderRadius = useTransform(unfoldProgress, [0, 0.78, 1], [999, 190, 10]);
  const rotateX = useTransform(unfoldProgress, [0, 0.55, 1], [24, 8, 0]);
  const rotateY = useTransform(unfoldProgress, [0, 0.5, 1], [-18, -7, 0]);
  const skewX = useTransform(unfoldProgress, [0, 0.55, 1], [-16, -5, 0]);
  const skewY = useTransform(unfoldProgress, [0, 0.5, 1], [12, 3, 0]);
  const unfoldShadow = useMotionTemplate`0 ${useTransform(unfoldProgress, [0, 1], [52, 20])}px ${useTransform(unfoldProgress, [0, 1], [88, 36])}px rgba(0,0,0,${useTransform(unfoldProgress, [0, 1], [0.5, 0.24])})`;
  const unfoldFilter = useMotionTemplate`brightness(${useTransform(unfoldProgress, [0, 1], [0.88, 1])}) contrast(${useTransform(unfoldProgress, [0, 1], [0.92, 1])})`;

  const clearPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handlePressStart = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    clearPressTimer();
    pressTimerRef.current = setTimeout(() => {
      setIsBoosted(true);
    }, 150);
  };

  const handlePressEnd = () => {
    clearPressTimer();
    setIsBoosted(false);
  };

  useEffect(() => () => clearPressTimer(), []);

  return (
    <section
      ref={sectionRef}
      className="vintage-drive relative overflow-hidden bg-[#0f1012] px-4 py-20 sm:px-8"
      data-cursor-text="Press Hard"
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
      onPointerCancel={handlePressEnd}
    >
      <div className={`vintage-drive__sky ${reduceMotion ? "" : "vintage-drive__sky--animated"}`} aria-hidden />
      <div className={`vintage-drive__road ${reduceMotion ? "" : "vintage-drive__road--animated"}`} aria-hidden />
      <div className="vintage-drive__grain" aria-hidden />

      <motion.div
        className="vintage-drive__unfold-shell vintage-drive__paper-shell relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10"
        style={
          reduceMotion
            ? undefined
            : { scale, rotate, rotateX, rotateY, skewX, skewY, y, opacity, borderRadius, boxShadow: unfoldShadow, filter: unfoldFilter }
        }
      >
        <div className="w-full flex justify-center lg:justify-end">
          <button
            type="button"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="vintage-drive__hire-btn"
          >
            Hire Me
          </button>
        </div>

        <div className="grid w-full grid-cols-1 items-center gap-6">
          <div className="text-center vintage-drive__text-panel">
            <p className="vintage-drive__kicker">Need things done?</p>
            <h2 className="vintage-drive__headline">
              I DO
              <br />
              THINGS.
            </h2>
          </div>
        </div>

        <div className={`vintage-car ${isBoosted && !reduceMotion ? "vintage-car--boosted" : ""}`}>
          <div className="vintage-car__spotlight" aria-hidden />
          <div className="vintage-car__shadow" aria-hidden />
          <div className="vintage-car__photo-wrap">
            <Image
              src="/vintage-car-user-v4.png"
              alt="Vintage lowrider car"
              fill
              quality={100}
              unoptimized
              className="vintage-car__photo"
              sizes="(max-width: 1024px) 95vw, 980px"
            />
            <div className="vintage-car__wheel vintage-car__wheel--left">
              <span className={`vintage-car__rim ${reduceMotion ? "" : "vintage-car__rim--animated"} ${isBoosted && !reduceMotion ? "vintage-car__rim--boosted" : ""}`} />
            </div>
            <div className="vintage-car__wheel vintage-car__wheel--right">
              <span className={`vintage-car__rim ${reduceMotion ? "" : "vintage-car__rim--animated"} ${isBoosted && !reduceMotion ? "vintage-car__rim--boosted" : ""}`} />
            </div>
          </div>
          <div className="vintage-car__front-lights" aria-hidden />
          <div className="vintage-car__exhaust" aria-hidden />
          <div className={`vintage-car__smoke vintage-car__smoke--left ${isBoosted && !reduceMotion ? "is-active" : ""}`} aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
