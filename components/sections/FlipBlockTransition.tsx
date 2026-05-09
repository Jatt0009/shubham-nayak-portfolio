"use client";

import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type FlipBlockTransitionProps = {
  children: ReactNode;
  className?: string;
  intensity?: "soft" | "medium" | "cube";
};

const ROTATION_BY_INTENSITY = {
  soft: 10,
  medium: 16,
  cube: 90,
} as const;

export default function FlipBlockTransition({
  children,
  className,
  intensity = "soft",
}: FlipBlockTransitionProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  const smoothedProgress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 95,
    mass: 0.8,
  });

  const maxRotation = ROTATION_BY_INTENSITY[intensity];
  const isCube = intensity === "cube";

  const rotateX = useTransform(
    smoothedProgress,
    [0, 0.5, 1],
    isCube ? [maxRotation, 0, -maxRotation] : [maxRotation, 0, -maxRotation],
  );
  const translateY = useTransform(smoothedProgress, [0, 0.5, 1], isCube ? [120, 0, -120] : [64, 0, -64]);
  const opacity = useTransform(
    smoothedProgress,
    [0, 0.12, 0.88, 1],
    isCube ? [0.4, 1, 1, 0.4] : [0.72, 1, 1, 0.72],
  );

  return (
    <section
      ref={blockRef}
      className={className}
      style={{
        perspective: isCube ? "1900px" : "1400px",
        transformStyle: "flat",
      }}
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX,
                y: translateY,
                opacity,
                transformOrigin: "center center",
                transformStyle: "flat",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                translateZ: 0,
                willChange: "transform, opacity",
              }
        }
      >
        {children}
      </motion.div>
    </section>
  );
}
