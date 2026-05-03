export type ProcessStep = {
  title: string;
  body: string;
};

export type CaseStudyFloater = {
  src: string;
  /** Optional Tailwind nudge on the sticker box (grid layout handles main placement) */
  className?: string;
  delay?: number;
};

export type CaseStudy = {
  id: string;
  title: string;
  tagline: string;
  category: string;
  color: string;
  accent: string;
  bgLight: string;
  problem: string;
  process: ProcessStep[];
  solution: string;
  outcome: string;
  /** Shown inside device frames + card collage */
  showcaseSrc?: string;
  /** pawspal uses different object position */
  imageObjectClass?: string;
  /** Full vertical case study PNG — shown when the modal opens (skips device collage) */
  caseStudyBoardSrc?: string;
  /** Playful draggable stickers in the modal hero */
  floaters?: CaseStudyFloater[];
  /** Light hero inside modal — matches site cream tone + soft project tint */
  heroLightBg: string;
  /** Category pill text on light hero (darker than card accent) */
  heroAccentMuted: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "glowup",
    title: "GLOWUP",
    tagline: "Personalized Skincare Journey",
    category: "UX/UI Case Study",
    color: "from-[#0a1f18] to-[#04110e]",
    accent: "text-emerald-400",
    bgLight: "bg-emerald-500/10",
    problem:
      "Users struggle to manage skincare consistently: routines slip, progress is invisible, and it is unclear which products actually work for their skin.",
    process: [
      {
        title: "Research & rituals",
        body: "Diary studies and interviews mapped morning and evening habits, drop-off moments, and how users track products today.",
      },
      {
        title: "Journey architecture",
        body: "A guided routine model with adaptive check-ins, streaks, and gentle reminders that respect real life—not guilt.",
      },
      {
        title: "Luxury visual system",
        body: "Deep emerald, soft rose, and restrained typography to feel premium, calm, and trustworthy—not clinical.",
      },
    ],
    solution:
      "A cohesive routine-first experience that makes progress visible, education feel editorial, and community feel supportive instead of noisy.",
    outcome:
      "A beautifully cohesive app that drove a 40% lift in daily routine adherence and a stronger sense of community among skincare enthusiasts.",
    showcaseSrc: "/glowup-casestudy.png",
    caseStudyBoardSrc: "/glowup-casestudy.png",
    floaters: [
      { src: "/serum.png", className: "md:translate-y-1", delay: 0 },
      { src: "/brush.png", className: "-translate-y-1 md:-translate-y-2", delay: 0.12 },
      { src: "/mirror.png", className: "md:translate-y-2", delay: 0.24 },
    ],
    heroLightBg: "from-[#FDFCF9] via-[#F8F5F2] to-[#f0ebe4]",
    heroAccentMuted: "text-emerald-800",
  },
  {
    id: "pawspal",
    title: "PawPal",
    tagline: "Making Pet Care Feel Human",
    category: "Mobile App Case Study",
    color: "from-[#0f352b] to-[#04110e]",
    accent: "text-[#3b998a]",
    bgLight: "bg-[#3b998a]/10",
    problem:
      "Pet owners need trustworthy care on short notice; sitters need clear bookings and trust signals—without a chaotic, marketplace feel.",
    process: [
      {
        title: "Trust & clarity",
        body: "Verified profiles, transparent availability, and messaging that reduces anxiety for both sides of the match.",
      },
      {
        title: "Booking that flows",
        body: "A streamlined request-to-confirm path with status you can scan in seconds—built for busy pet parents.",
      },
      {
        title: "Warm product voice",
        body: "Playful illustration and motion that feels caring, not childish—human care, delivered through UI.",
      },
    ],
    solution:
      "A dual-sided experience that makes matching feel safe, scheduling feel effortless, and every touchpoint feel considerate.",
    outcome:
      "A playful yet highly functional ecosystem that increased successful sitter matches by 75% within the first month.",
    showcaseSrc: "/pawspal-casestudy.png",
    imageObjectClass: "object-[20%_center]",
    caseStudyBoardSrc: "/pawspal-casestudy.png",
    floaters: [
      { src: "/ball.png", className: "md:-translate-y-1", delay: 0.08 },
      { src: "/bone.png", className: "translate-y-1", delay: 0.22 },
      { src: "/collar.png", className: "md:-translate-y-0.5", delay: 0.42 },
    ],
    heroLightBg: "from-[#F9F7F4] via-[#F8F5F2] to-[#eef2f0]",
    heroAccentMuted: "text-teal-800",
  },
  {
    id: "aura",
    title: "Aura",
    tagline: "The Future of Smart Wealth",
    category: "Fintech Platform",
    color: "from-blue-900 to-[#0a0a0c]",
    accent: "text-blue-400",
    bgLight: "bg-blue-500/10",
    problem:
      "Traditional wealth tools overload users with jargon and dense dashboards—dropping trust and completion during high-stakes money decisions.",
    process: [
      {
        title: "Clarity hierarchy",
        body: "Progressive disclosure so advanced investing never blocks the next best action for everyday users.",
      },
      {
        title: "Confidence by design",
        body: "Consistent components, predictable flows, and explainers that appear exactly when anxiety spikes.",
      },
      {
        title: "Motion with purpose",
        body: "Subtle transitions reinforce state changes—never decoration—so the product feels premium and intentional.",
      },
    ],
    solution:
      "A calm financial workspace that prioritizes comprehension, reduces cognitive load, and makes complex flows feel guided.",
    outcome:
      "A streamlined dashboard that reduced task completion time by 60% and measurably improved perceived trust.",
    heroLightBg: "from-[#f4f7fd] via-[#F8F5F2] to-[#f2f4fb]",
    heroAccentMuted: "text-blue-900",
  },
  {
    id: "nexus",
    title: "Nexus",
    tagline: "Unifying Enterprise Data",
    category: "Enterprise Dashboard",
    color: "from-purple-900 to-[#0a0a0c]",
    accent: "text-purple-400",
    bgLight: "bg-purple-500/10",
    problem:
      "Managers lose hours switching between siloed tools—fragmented data creates fatigue, errors, and slow decisions at scale.",
    process: [
      {
        title: "Unified model",
        body: "A single source of truth layer that normalizes streams without forcing teams to abandon existing systems overnight.",
      },
      {
        title: "Role-aware surfaces",
        body: "Dashboards adapt to executive, operator, and analyst needs—same data, tuned density and actions.",
      },
      {
        title: "Operational polish",
        body: "Dense tables, filters, and alerts designed for speed-reading and zero ambiguity under pressure.",
      },
    ],
    solution:
      "One command center that turns twelve fragmented feeds into a coherent narrative with actionable next steps.",
    outcome:
      "A centralized hub that unified twelve data streams into a single, highly actionable interface for enterprise teams.",
    heroLightBg: "from-[#faf7fc] via-[#F8F5F2] to-[#f4f0f8]",
    heroAccentMuted: "text-purple-900",
  },
];
