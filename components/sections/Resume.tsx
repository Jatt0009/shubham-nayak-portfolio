"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Download, GraduationCap, Palette } from "lucide-react";
import dynamic from "next/dynamic";
import NeonTubesBackdrop from "@/components/sections/resume/NeonTubesBackdrop";

const TubesWebGLCanvas = dynamic(() => import("@/components/sections/resume/TubesWebGLCanvas"), { ssr: false });

const snapshot = [
  {
    icon: Briefcase,
    label: "Experience",
    value: "2 design internships",
    detail: "UX audits, redesigns, user flows, and responsive interfaces.",
  },
  {
    icon: GraduationCap,
    label: "Education",
    value: "B.Des, 2023 - 2027",
    detail: "UI/UX specialization at Amity University.",
  },
  {
    icon: Palette,
    label: "Focus",
    value: "UI/UX Design with Product Design",
    detail: "Figma, prototyping, research, wireframing, and visual systems.",
  },
];

const RESUME_PDF = "/shubham-nayak-resume.pdf";

export default function Resume() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#10110f] px-4 py-32 text-zinc-100 md:px-6" id="resume">
      {!reduceMotion ? (
        <TubesWebGLCanvas className="absolute inset-0 z-0 min-h-[560px]" />
      ) : (
        <>
          <div className="pointer-events-none absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-1/4 right-0 h-[600px] w-[600px] rounded-full bg-accent/7 blur-[150px]" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff75]/20 bg-[#d9ff75]/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[#d9ff75]">
              Resume
            </span>
            <h2 className="font-heading text-4xl font-bold tracking-tighter text-zinc-50 md:text-6xl">
              About Me <span className="text-[#d9ff75]">So Far.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              I am a UI/UX designer building a foundation across research, wireframing, prototyping, visual design, and
              interaction design. Full experience, education, skills, and certifications are in my PDF — download it
              below.
            </p>
          </motion.div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              href={RESUME_PDF}
              download
              target="_blank"
              rel="noreferrer"
              className="interactive flex items-center justify-center gap-2 rounded-full bg-[#d9ff75] px-6 py-3 font-bold text-[#10110f] shadow-[0_0_24px_rgba(217,255,117,0.18)] transition-transform hover:scale-105 hover:bg-[#e4ff98] active:scale-95"
            >
              <Download className="h-4 w-4" />
              Download resume (PDF)
            </motion.a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {snapshot.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#181a14]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#d9ff75]/25 bg-[#d9ff75]/10 text-[#d9ff75]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-mono text-sm font-extrabold uppercase tracking-widest text-zinc-300">
                  {item.label}
                </div>
                <h3 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-zinc-50 md:text-3xl">
                  {item.value}
                </h3>
                <p className="mt-3 text-base font-semibold leading-relaxed text-zinc-200">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm text-zinc-500"
        >
          Contact details, full work history, and certifications are only in the PDF.
        </motion.p>
      </div>
    </section>
  );
}
