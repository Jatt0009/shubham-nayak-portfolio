"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps the app shell with a short motion entrance.
 * First paint uses a plain div so SSR + hydration always match (avoids blank page when
 * `useReducedMotion()` or Framer initial state differs between server and client).
 */
export default function SmoothEntrance({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 1, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.72,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : 0.04,
      }}
    >
      {children}
    </motion.div>
  );
}
