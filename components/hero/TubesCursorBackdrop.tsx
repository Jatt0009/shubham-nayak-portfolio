"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TubesWebGLCanvas = dynamic(() => import("@/components/sections/resume/TubesWebGLCanvas"), { ssr: false });

type TubesCursorFn = (
  canvas: HTMLCanvasElement,
  options: {
    tubes: {
      colors: string[];
      lights: { intensity: number; colors: string[] };
    };
  }
) => {
  tubes: {
    setColors: (colors: string[]) => void;
    setLightsColors?: (colors: string[]) => void;
  };
  dispose: () => void;
};

function randomHexColors(count: number) {
  return Array.from({ length: count }, () => {
    const n = Math.floor(Math.random() * 0xffffff);
    return `#${n.toString(16).padStart(6, "0")}`;
  });
}

type Props = {
  className?: string;
  /** When false, clicks do not randomize tube / light colors */
  enableClickInteraction?: boolean;
};

/**
 * Neon tangled tubes cursor effect from `threejs-components` (TubesCursor).
 * Serves `/vendor/tubes1.min.js` (see `scripts/copy-tubes-asset.mjs`).
 * On load/init failure, falls back to `TubesWebGLCanvas`.
 */
export default function TubesCursorBackdrop({
  className,
  enableClickInteraction = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<ReturnType<TubesCursorFn> | null>(null);
  const enableClickRef = useRef(enableClickInteraction);
  const [mode, setMode] = useState<"loading" | "tubes" | "fallback">("loading");

  enableClickRef.current = enableClickInteraction;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let app: ReturnType<TubesCursorFn> | null = null;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-label", "Interactive neon tubes background");
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;";
    container.appendChild(canvas);

    const onCanvasClick = (e: MouseEvent) => {
      if (e.target !== canvas || e.button !== 0) return;
      if (!enableClickRef.current) return;
      const inst = appRef.current;
      if (!inst) return;
      try {
        inst.tubes.setColors(randomHexColors(3));
        const lights = randomHexColors(4);
        if (typeof inst.tubes.setLightsColors === "function") {
          inst.tubes.setLightsColors(lights);
        }
      } catch {
        /* ignore */
      }
    };

    (async () => {
      try {
        const href = `${window.location.origin}/vendor/tubes1.min.js?v=0.0.30`;
        const mod: { default: TubesCursorFn } = await import(
          /* webpackIgnore: true */
          href
        );
        const TubesCursor = mod.default;
        if (cancelled) return;

        app = TubesCursor(canvas, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
            },
          },
        });
        appRef.current = app;
        canvas.addEventListener("click", onCanvasClick);
        if (!cancelled) setMode("tubes");
      } catch (e) {
        console.error("[TubesCursorBackdrop] TubesCursor failed, using fallback:", e);
        try {
          app?.dispose();
        } catch {
          /* ignore */
        }
        app = null;
        appRef.current = null;
        if (canvas.parentNode === container) {
          container.removeChild(canvas);
        }
        if (!cancelled) setMode("fallback");
      }
    })();

    return () => {
      cancelled = true;
      canvas.removeEventListener("click", onCanvasClick);
      try {
        appRef.current?.dispose();
      } catch {
        /* ignore */
      }
      appRef.current = null;
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 z-0", className)} role="presentation">
      {mode === "fallback" ? <TubesWebGLCanvas className="absolute inset-0 h-full w-full" /> : null}
    </div>
  );
}
