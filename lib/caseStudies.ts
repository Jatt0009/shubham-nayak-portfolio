export type ProcessStep = {
  title: string;
  body: string;
};

export type CaseStudyFloater = {
  src?: string;
  label?: string;
  icon?: string;
  toneClassName?: string;
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
  /** Optional HD thematic photo for the portfolio collage tile (preferred over showcaseSrc there) */
  collageBackgroundSrc?: string;
  /** Optional per-project filter tuning for collage card image */
  collageImageClass?: string;
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
    color: "from-[#050807] via-[#030504] to-[#010202]",
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
    collageBackgroundSrc: "/glowup-card-bg.png",
    collageImageClass: "brightness-[0.76] contrast-[1.04]",
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
    color: "from-[#050a09] via-[#030605] to-[#010202]",
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
    collageBackgroundSrc:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=2400&q=88",
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
    id: "medbook",
    title: "MedBook",
    tagline: "Bridging Clinical Precision and Patient Empathy",
    category: "Healthcare UX Case Study",
    color: "from-[#05110f] via-[#030908] to-[#010303]",
    accent: "text-[#2f8f85]",
    bgLight: "bg-[#2f8f85]/10",
    problem:
      "Patients often face unclear symptom guidance and fragmented consultation experiences, while providers need faster, more confident triage support.",
    process: [
      {
        title: "Care journey mapping",
        body: "Mapped the end-to-end experience from symptom discovery to consultation to identify friction between patient reassurance and clinical confidence.",
      },
      {
        title: "Information architecture",
        body: "Structured medical information into a clear hierarchy so users can quickly understand urgency, next steps, and available care paths.",
      },
      {
        title: "Decision support UI",
        body: "Designed calm, high-contrast decision surfaces with concise microcopy to reduce cognitive load during high-stress health moments.",
      },
    ],
    solution:
      "A patient-first health platform that combines smart symptom guidance with clinically grounded interaction patterns to improve trust and actionability.",
    outcome:
      "The redesigned flow improved triage clarity and reduced decision hesitation by making care pathways easier to understand at a glance.",
    showcaseSrc: "/doctorappointmentbooking.png",
    collageBackgroundSrc: "/medbook-card-bg-v2.png",
    collageImageClass: "brightness-[0.64] contrast-[1.15] saturate-[0.82]",
    caseStudyBoardSrc: "/doctorappointmentbooking.png",
    floaters: [
      {
        src: "/roo-bhta-JEeUS2RNlew-unsplash-removebg-preview.png",
        className: "md:-translate-y-1",
        delay: 0.02,
      },
      {
        src: "/mockupbee-UEQedPdLXVU-unsplash-removebg-preview.png",
        className: "translate-y-1",
        delay: 0.18,
      },
      {
        src: "/pexels-deise-elen-2149983761-31406902-removebg-preview.png",
        className: "md:translate-y-1",
        delay: 0.34,
      },
    ],
    heroLightBg: "from-[#f2f9f8] via-[#F8F5F2] to-[#ecf4f3]",
    heroAccentMuted: "text-teal-900",
  },
  {
    id: "nexus",
    title: "Nexus",
    tagline: "Unifying Enterprise Data",
    category: "Enterprise Dashboard",
    color: "from-[#08050c] via-[#040308] to-[#010101]",
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
