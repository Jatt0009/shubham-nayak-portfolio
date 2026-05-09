"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const labelX = useMotionValue(0);
  const labelY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { damping: 34, stiffness: 720, mass: 0.16 });
  const smoothCursorY = useSpring(cursorY, { damping: 34, stiffness: 720, mass: 0.16 });
  const smoothRingX = useSpring(ringX, { damping: 28, stiffness: 320, mass: 0.3 });
  const smoothRingY = useSpring(ringY, { damping: 28, stiffness: 320, mass: 0.3 });
  const smoothLabelX = useSpring(labelX, { damping: 24, stiffness: 300, mass: 0.35 });
  const smoothLabelY = useSpring(labelY, { damping: 24, stiffness: 300, mass: 0.35 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
      ringX.set(e.clientX - 24);
      ringY.set(e.clientY - 24);
      labelX.set(e.clientX + 16);
      labelY.set(e.clientY - 26);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTextNode = target.closest<HTMLElement>("[data-cursor-text]");
      setCursorLabel(cursorTextNode?.dataset.cursorText ?? null);
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, ringX, ringY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-foreground rounded-full pointer-events-none z-[99999] opacity-80"
        style={{ x: smoothCursorX, y: smoothCursorY }}
        animate={{ scale: isHovering ? 2 : 1 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-foreground/25 rounded-full pointer-events-none z-[99998]"
        style={{ x: smoothRingX, y: smoothRingY }}
        animate={{ scale: isHovering ? 1.5 : 1, opacity: isHovering ? 0 : 1 }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99997] rounded-full border border-foreground/18 bg-background/88 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-[0_8px_24px_rgba(28,28,28,0.16)] backdrop-blur-sm"
        style={{ x: smoothLabelX, y: smoothLabelY }}
        animate={cursorLabel ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {cursorLabel ?? ""}
      </motion.div>
    </>
  );
}
