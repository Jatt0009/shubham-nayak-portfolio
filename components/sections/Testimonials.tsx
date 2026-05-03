"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Shubham has an exceptional eye for detail. His ability to translate complex user requirements into elegant, intuitive interfaces is unmatched.",
    author: "Sarah Jenkins",
    role: "Product Manager at TechCorp",
  },
  {
    quote:
      "Working with Shubham during his internship was a breeze. He brought fresh perspectives and elevated our design system to a new level.",
    author: "David Lee",
    role: "Lead Designer at CreativeAgency",
  },
];

const layoutEase = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden border-t border-divider bg-background py-24 md:py-32"
      id="experience"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-10%,rgba(182,255,0,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_60%,rgba(214,32,58,0.05),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 md:px-10">
        <div className="mx-auto mb-16 max-w-4xl text-center md:mb-20 lg:mb-24">
          <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-secondary sm:text-xs md:mb-7">
            Testimonials
          </p>

          <h2
            id="testimonials-heading"
            className="font-heading text-[clamp(2.75rem,10vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-foreground md:tracking-[-0.045em]"
          >
            What people{" "}
            <span className="relative inline-block">
              <span className="relative z-10">say</span>
              <span
                className="absolute -bottom-1 left-0 right-0 z-0 h-[0.35em] rounded-sm bg-accent/90 md:-bottom-1.5 md:h-[0.38em]"
                aria-hidden
              />
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-snug text-secondary md:mt-8 md:text-xl md:leading-relaxed">
            Words from people who have shipped, critiqued, and collaborated on real work together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {testimonials.map((t, index) => (
            <motion.article
              key={`${t.author}-${index}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.65, delay: index * 0.12, ease: layoutEase }}
              className="group relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-white/75 p-8 shadow-[0_8px_40px_-12px_rgba(28,28,28,0.12)] backdrop-blur-md transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_20px_60px_-20px_rgba(182,255,0,0.22)] md:rounded-[2.25rem] md:p-10 lg:p-12"
            >
              <div
                className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent via-accent to-accent-ink/40 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <Quote className="absolute right-6 top-6 h-14 w-14 text-foreground/[0.07] transition-colors duration-500 group-hover:text-accent/25 md:right-8 md:top-8 md:h-16 md:w-16" />

              <p className="relative pr-2 text-xl font-medium leading-snug tracking-tight text-foreground/90 md:pr-4 md:text-2xl md:leading-snug lg:text-[1.65rem] lg:leading-[1.35]">
                <span className="text-accent-ink/80">&ldquo;</span>
                {t.quote}
                <span className="text-accent-ink/80">&rdquo;</span>
              </p>

              <div className="mt-10 flex items-center gap-4 border-t border-foreground/10 pt-8 md:mt-12 md:gap-5 md:pt-10">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#9fe000] text-lg font-bold text-foreground shadow-[0_4px_20px_rgba(182,255,0,0.35)] md:h-16 md:w-16 md:text-xl">
                  {t.author.charAt(0)}
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="truncate text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {t.author}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-secondary md:text-base">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
