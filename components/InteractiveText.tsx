"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface InteractiveTextProps {
  text: string;
  className?: string;
}

export default function InteractiveText({ text, className = "" }: InteractiveTextProps) {
  // Split text into words then letters to preserve word breaking
  const words = text.split(" ");
  
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex mr-[0.25em]">
          {word.split("").map((letter, letterIndex) => (
            <MagneticLetter key={letterIndex}>{letter}</MagneticLetter>
          ))}
        </span>
      ))}
    </span>
  );
}

const MOVE_EPS = 0.35;

function MagneticLetter({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const rect = ref.current.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        const radius = 100;

        let next = { x: 0, y: 0 };
        if (distance >= 1e-6 && distance < radius) {
          const strength = (radius - distance) / radius;
          next = {
            x: (distanceX / distance) * -20 * strength,
            y: (distanceY / distance) * -20 * strength,
          };
        }

        setPosition((prev) =>
          Math.abs(prev.x - next.x) < MOVE_EPS && Math.abs(prev.y - next.y) < MOVE_EPS ? prev : next
        );
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.span
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block origin-center"
    >
      {children}
    </motion.span>
  );
}
