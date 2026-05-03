"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

type CursorSpotlightVideoProps = {
  /** Place your file in /public (e.g. showreel.mp4) */
  src?: string;
  /** Shown behind text until the first video frame (existing asset works well). */
  poster?: string;
};

export default function CursorSpotlightVideo({
  src = "/showreel.mp4",
  poster = "/profile_pic.jpg",
}: CursorSpotlightVideoProps) {
  const reduceMotion = useReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);
  const sharpVideoRef = useRef<HTMLVideoElement>(null);
  const blurVideoRef = useRef<HTMLVideoElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 380, damping: 42, mass: 0.35 });
  const ySpring = useSpring(y, { stiffness: 380, damping: 42, mass: 0.35 });

  const [radiusPx, setRadiusPx] = useState(260);
  const [videoBroken, setVideoBroken] = useState(false);

  useEffect(() => {
    const measure = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 900;
      setRadiusPx(Math.min(360, Math.max(160, w * 0.19)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /** Opaque center reveals sharp video; fading alpha reveals blurred layer beneath. */
  const sharpMask = useMotionTemplate`radial-gradient(circle ${radiusPx}px at ${xSpring}px ${ySpring}px, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 26%, rgba(255,255,255,0.35) 52%, rgba(255,255,255,0) 72%)`;

  const syncPlay = useCallback(() => {
    const a = sharpVideoRef.current;
    const b = blurVideoRef.current;
    if (!a || !b) return;
    const t = a.currentTime;
    if (Math.abs(b.currentTime - t) > 0.15) {
      b.currentTime = t;
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(syncPlay, 400);
    return () => window.clearInterval(id);
  }, [syncPlay]);

  const moveToClient = useCallback(
    (clientX: number, clientY: number) => {
      const el = innerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set(clientX - r.left);
      y.set(clientY - r.top);
    },
    [x, y]
  );

  const centerSpotlight = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    x.set(el.clientWidth / 2);
    y.set(el.clientHeight / 2);
  }, [x, y]);

  useEffect(() => {
    centerSpotlight();
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => centerSpotlight());
    ro.observe(el);
    return () => ro.disconnect();
  }, [centerSpotlight]);

  useEffect(() => {
    setVideoBroken(false);
    const tryPlay = async () => {
      const nodes = [sharpVideoRef.current, blurVideoRef.current].filter(
        Boolean
      ) as HTMLVideoElement[];
      await Promise.all(
        nodes.map(async (v) => {
          try {
            await v.play();
          } catch {
            /* autoplay policies — muted usually succeeds */
          }
        })
      );
    };
    void tryPlay();
  }, [src]);

  const onMove = (e: React.MouseEvent) => {
    moveToClient(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) moveToClient(t.clientX, t.clientY);
  };

  const videoProps = {
    src,
    muted: true as const,
    playsInline: true as const,
    loop: true as const,
    autoPlay: true as const,
    preload: "auto" as const,
    poster,
    onTimeUpdate: syncPlay,
    onError: () => setVideoBroken(true),
  };

  if (reduceMotion) {
    return (
      <section className="relative isolate w-full overflow-hidden bg-black">
        <div className="relative mx-auto aspect-video max-h-[85vh] w-full max-w-[1900px] md:aspect-[21/9]">
          {!videoBroken ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              {...videoProps}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${poster})` }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        </div>
        <p className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-xs uppercase tracking-[0.35em] text-white drop-shadow-md">
          Showreel
        </p>
      </section>
    );
  }

  return (
    <section
      id="showreel"
      className="relative isolate w-full select-none bg-[#0a0a0a]"
      onMouseMove={onMove}
      onMouseLeave={centerSpotlight}
      onTouchMove={onTouchMove}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) moveToClient(t.clientX, t.clientY);
      }}
    >
      <div
        ref={innerRef}
        className="relative mx-auto aspect-[4/5] h-[min(88vh,920px)] max-h-[920px] w-full max-w-[1900px] sm:aspect-video md:aspect-[21/9] md:h-[min(85vh,880px)]"
      >
        {/* Base: blurred + darkened (always full frame) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
          {videoBroken ? (
            <div
              className="absolute inset-0 scale-105 bg-cover bg-center blur-2xl brightness-[0.35]"
              style={{ backgroundImage: `url(${poster})` }}
            />
          ) : (
            <video
              ref={blurVideoRef}
              className="absolute inset-0 h-full w-full scale-[1.06] object-cover blur-[28px] brightness-[0.38] saturate-[1.05]"
              {...videoProps}
            />
          )}
          <div className="absolute inset-0 bg-black/62" />
        </div>

        {/* Sharp video only where the spotlight mask is opaque */}
        {!videoBroken ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
            style={{
              maskImage: sharpMask,
              WebkitMaskImage: sharpMask,
              maskMode: "alpha" as const,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          >
            <video
              ref={sharpVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              {...videoProps}
            />
          </motion.div>
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_85%_85%_at_50%_50%,transparent_0%,rgba(0,0,0,0.28)_100%)] mix-blend-multiply"
          aria-hidden
        />

        {videoBroken ? (
          <p className="pointer-events-none absolute inset-x-6 top-1/2 z-[4] -translate-y-1/2 text-center text-sm leading-relaxed text-white/80 drop-shadow-lg md:text-base">
            Could not load <span className="font-mono text-white">{src}</span>.
            Add your clip to{" "}
            <span className="font-mono text-white">public/</span> or pass{" "}
            <span className="font-mono text-white">src</span> on{" "}
            <span className="font-mono text-white">CursorSpotlightVideo</span>.
          </p>
        ) : null}
      </div>

      {/* Outside the cropped inner frame so layout/z-index cannot hide copy */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-10 flex flex-col justify-end pb-8 pt-24 md:pb-10 md:pt-32">
        <div className="bg-gradient-to-t from-black/75 via-black/35 to-transparent pb-2 pt-16 md:pt-20">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.42em] text-white/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)] md:text-xs">
            Explore
          </p>
          <p className="mt-2 text-center font-heading text-xl font-semibold tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] md:text-2xl">
            Move to reveal
          </p>
        </div>
      </div>
    </section>
  );
}
