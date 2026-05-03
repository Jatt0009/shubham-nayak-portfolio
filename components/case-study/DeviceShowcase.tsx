"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { CaseStudy } from "@/lib/caseStudies";

type DeviceShowcaseProps = {
  project: CaseStudy;
  /** Light chrome for modal / bright backgrounds */
  variant?: "light" | "dark";
};

function FrameGlow({
  children,
  className,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  variant: "light" | "dark";
}) {
  if (variant === "light") {
    return (
      <div
        className={`rounded-[2rem] border border-black/[0.08] bg-gradient-to-b from-white to-zinc-100/80 p-[2px] shadow-[0_12px_40px_-8px_rgba(28,28,28,0.15)] transition-transform duration-700 ease-out hover:scale-[1.02] hover:shadow-[0_20px_50px_-12px_rgba(28,28,28,0.2)] ${className ?? ""}`}
      >
        <div className="h-full w-full overflow-hidden rounded-[1.85rem] bg-zinc-950 ring-1 ring-black/10">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-white/[0.08] to-transparent p-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] transition-transform duration-700 ease-out hover:scale-[1.02] hover:shadow-[0_0_100px_rgba(255,255,255,0.1)] ${className ?? ""}`}
    >
      <div className="h-full w-full overflow-hidden rounded-[1.85rem] bg-black ring-1 ring-white/10">{children}</div>
    </div>
  );
}

export default function DeviceShowcase({ project, variant = "light" }: DeviceShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const y3 = useTransform(scrollYProgress, [0, 1], [56, -56]);

  const src = project.showcaseSrc;
  const objectClass = project.imageObjectClass ?? "object-center";

  const placeholder =
    variant === "light" ? (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
        <span className="px-6 text-center font-heading text-2xl font-bold tracking-tight text-secondary md:text-3xl">
          {project.title}
        </span>
      </div>
    ) : (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${project.color} opacity-90`}
      >
        <span className="px-6 text-center font-heading text-2xl font-bold tracking-tight text-white/25 md:text-3xl">
          {project.title}
        </span>
      </div>
    );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-24"
    >
      <p
        className={`mb-12 text-center font-mono text-xs uppercase tracking-[0.35em] ${variant === "light" ? "text-secondary" : "text-zinc-500"}`}
      >
        Crafted across surfaces
      </p>
      <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:items-end md:gap-6 lg:gap-10 [perspective:1200px]">
        {/* iPhone */}
        <motion.div style={{ y: y1 }} className="relative z-30 w-[42%] max-w-[220px] md:w-[28%] md:max-w-none">
          <FrameGlow variant={variant}>
            <div className="relative aspect-[9/19.5] w-full">
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className={`object-cover ${objectClass}`}
                  sizes="220px"
                  unoptimized
                />
              ) : (
                placeholder
              )}
            </div>
          </FrameGlow>
        </motion.div>

        {/* MacBook */}
        <motion.div style={{ y: y2 }} className="relative z-20 w-full max-w-2xl md:max-w-3xl">
          <div
            className={`rounded-t-xl border px-3 pt-2 ${
              variant === "light"
                ? "border-black/10 bg-zinc-300/90 shadow-[0_28px_70px_-12px_rgba(28,28,28,0.25)]"
                : "border-white/10 bg-zinc-900/80 shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
            }`}
          >
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div
              className={`relative aspect-[16/10] overflow-hidden rounded-t-md ring-1 ${
                variant === "light" ? "bg-zinc-950 ring-black/15" : "bg-black ring-white/10"
              }`}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className={`object-cover object-top ${objectClass}`}
                  sizes="(max-width:768px) 100vw, 900px"
                  unoptimized
                />
              ) : (
                placeholder
              )}
            </div>
          </div>
          <div
            className={`mx-auto h-3 w-[88%] rounded-b-xl shadow-inner ${
              variant === "light"
                ? "bg-gradient-to-b from-zinc-400 to-zinc-600"
                : "bg-gradient-to-b from-zinc-800 to-zinc-950"
            }`}
          />
          <div
            className={`mx-auto -mt-px h-2 w-full max-w-md rounded-b-xl ${
              variant === "light" ? "bg-zinc-700/90" : "bg-zinc-950/90"
            }`}
          />
        </motion.div>

        {/* iPad */}
        <motion.div style={{ y: y3 }} className="relative z-10 w-[55%] max-w-[280px] md:w-[32%] md:max-w-none">
          <FrameGlow variant={variant}>
            <div className="relative aspect-[4/3] w-full">
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className={`object-cover ${objectClass}`}
                  sizes="280px"
                  unoptimized
                />
              ) : (
                placeholder
              )}
            </div>
          </FrameGlow>
        </motion.div>
      </div>
    </motion.div>
  );
}
