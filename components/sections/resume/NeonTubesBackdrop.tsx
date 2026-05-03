"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";

export type NeonTubesBackdropHandle = {
  randomizeColors: () => void;
};

type Props = { className?: string };

const HUE_OFFSETS = [0, 28, 52, 78, 140, 188];

const NeonTubesBackdrop = forwardRef<NeonTubesBackdropHandle, Props>(function NeonTubesBackdrop(
  { className },
  ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hueBase, setHueBase] = useState(115);

  const randomizeColors = useCallback(() => {
    setHueBase(Math.floor(Math.random() * 360));
  }, []);

  useImperativeHandle(ref, () => ({ randomizeColors }), [randomizeColors]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 80, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    mx.set(Math.max(-1, Math.min(1, nx)));
    my.set(Math.max(-1, Math.min(1, ny)));
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={rootRef}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 opacity-[0.5]"
        style={{ rotateX: rx, rotateY: ry, perspective: 900, transformStyle: "preserve-3d" }}
      >
        <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2">
          {HUE_OFFSETS.map((offset, i) => {
            const deg = (i / HUE_OFFSETS.length) * 360;
            const h = (hueBase + offset) % 360;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-[min(72vh,620px)] w-3 -translate-x-1/2 rounded-full shadow-[0_0_28px_rgba(182,255,0,0.25)]"
                style={{
                  transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                  transformOrigin: "center bottom",
                  background: `linear-gradient(180deg, hsla(${h}, 88%, 58%, 0.92) 0%, hsla(${h}, 82%, 42%, 0.12) 50%, transparent 100%)`,
                }}
              />
            );
          })}
        </div>
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 40%, hsla(${hueBase}, 65%, 48%, 0.1), transparent 55%)`,
        }}
      />
    </div>
  );
});

export default NeonTubesBackdrop;
