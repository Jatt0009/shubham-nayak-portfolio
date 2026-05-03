"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TubesWebGLCanvas, { type TubesWebGLCanvasHandle } from "@/components/sections/resume/TubesWebGLCanvas";

const TUBES_PUBLIC_PATH = "/vendor/tubes1.min.js";

type TubesCursorFactory = (
  canvas: HTMLCanvasElement,
  options: {
    tubes: {
      colors: string[];
      lights: { intensity: number; colors: string[] };
    };
  }
) => TubesApp;

type TubesApp = {
  tubes: {
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  };
  dispose?: () => void;
};

type LoadedTubes = {
  TubesCursor: TubesCursorFactory;
  revokeBlobUrl: () => void;
};

async function loadTubesCursorModule(): Promise<LoadedTubes> {
  const res = await fetch(TUBES_PUBLIC_PATH, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`[TubesCursorBackdrop] ${TUBES_PUBLIC_PATH} → HTTP ${res.status} ${res.statusText}`);
  }
  const code = await res.text();
  if (code.length < 1000) {
    throw new Error("[TubesCursorBackdrop] tubes script too small — run `node scripts/copy-tubes-asset.mjs`");
  }

  const blob = new Blob([code], { type: "text/javascript" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const mod = (await import(/* webpackIgnore: true */ blobUrl)) as { default?: TubesCursorFactory };
    const TubesCursor = mod.default;
    if (typeof TubesCursor !== "function") {
      URL.revokeObjectURL(blobUrl);
      throw new Error("[TubesCursorBackdrop] invalid default export");
    }
    return {
      TubesCursor,
      revokeBlobUrl: () => URL.revokeObjectURL(blobUrl),
    };
  } catch (e) {
    URL.revokeObjectURL(blobUrl);
    throw e;
  }
}

export type TubesCursorBackdropHandle = {
  randomizeColors: () => void;
};

function randomHexColors(count: number): string[] {
  return Array.from({ length: count }, () => {
    const n = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    return `#${n}`;
  });
}

function loseWebglContext(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const gl =
    (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
    (canvas.getContext("webgl") as WebGLRenderingContext | null);
  const ext = gl?.getExtension("WEBGL_lose_context");
  ext?.loseContext();
}

function syncCanvasBitmapSize(canvas: HTMLCanvasElement) {
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  const r = canvas.getBoundingClientRect();
  const w = Math.max(2, Math.floor(r.width * dpr));
  const h = Math.max(2, Math.floor(r.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

/** Some builds read pointer state on init — prime center so arrays are never null. */
function primePointerOverCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const opts = { bubbles: true, clientX: cx, clientY: cy, view: window } as const;
  canvas.dispatchEvent(new MouseEvent("mousemove", opts));
  try {
    canvas.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: cx,
        clientY: cy,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
      })
    );
  } catch {
    /* PointerEvent unsupported in very old engines */
  }
}

function waitForNonZeroCanvas(canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const max = 80;
    const tick = () => {
      attempts += 1;
      const { width, height } = canvas.getBoundingClientRect();
      if (width >= 2 && height >= 2) {
        resolve();
        return;
      }
      if (attempts >= max) {
        reject(new Error("[TubesCursorBackdrop] canvas layout size stayed at 0"));
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const TubesCursorBackdrop = forwardRef<TubesCursorBackdropHandle, { className?: string; disabled?: boolean }>(
  function TubesCursorBackdrop({ className = "", disabled = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<TubesApp | null>(null);
    const fallbackRef = useRef<TubesWebGLCanvasHandle>(null);
    const [useFallback, setUseFallback] = useState(false);

    const randomizeColors = () => {
      if (useFallback) {
        fallbackRef.current?.randomizeColors();
        return;
      }
      const app = appRef.current;
      if (!app || disabled) return;
      try {
        app.tubes.setColors(randomHexColors(3));
        app.tubes.setLightsColors(randomHexColors(4));
      } catch {
        /* ignore */
      }
    };

    useImperativeHandle(ref, () => ({ randomizeColors }), [disabled, useFallback]);

    useEffect(() => {
      if (disabled || useFallback) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      let cancelled = false;
      let app: TubesApp | null = null;
      let revokeBlobUrl: (() => void) | null = null;

      (async () => {
        try {
          try {
            await waitForNonZeroCanvas(canvas);
          } catch {
            await new Promise((r) => setTimeout(r, 120));
          }
          if (cancelled || !canvasRef.current) return;

          syncCanvasBitmapSize(canvas);
          primePointerOverCanvas(canvas);
          await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          if (cancelled || !canvasRef.current) return;

          const { TubesCursor, revokeBlobUrl: revoke } = await loadTubesCursorModule();
          if (cancelled || !canvasRef.current) {
            revoke();
            return;
          }
          revokeBlobUrl = revoke;

          syncCanvasBitmapSize(canvasRef.current);
          primePointerOverCanvas(canvasRef.current);

          app = TubesCursor(canvasRef.current, {
            tubes: {
              colors: ["#f967fb", "#53bc28", "#6958d5"],
              lights: {
                intensity: 200,
                colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
              },
            },
          });
          appRef.current = app;
        } catch (err) {
          console.warn("[TubesCursorBackdrop] TubesCursor init failed — using built-in neon tubes fallback.", err);
          try {
            app?.dispose?.();
          } catch {
            /* ignore */
          }
          app = null;
          appRef.current = null;
          loseWebglContext(canvas);
          revokeBlobUrl?.();
          revokeBlobUrl = null;
          if (!cancelled) setUseFallback(true);
        }
      })();

      return () => {
        cancelled = true;
        try {
          app?.dispose?.();
        } catch {
          /* ignore */
        }
        appRef.current = null;
        loseWebglContext(canvas);
        revokeBlobUrl?.();
      };
    }, [disabled, useFallback]);

    if (disabled) {
      return (
        <div
          className={`absolute inset-0 bg-[#030303] ${className}`.trim()}
          aria-hidden
        />
      );
    }

    if (useFallback) {
      return (
        <TubesWebGLCanvas
          ref={fallbackRef}
          className={`absolute inset-0 z-0 h-full min-h-[100dvh] w-full min-w-full touch-none ${className}`.trim()}
        />
      );
    }

    return (
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 block h-full w-full min-h-[100dvh] min-w-full touch-none ${className}`.trim()}
        aria-hidden
      />
    );
  }
);

TubesCursorBackdrop.displayName = "TubesCursorBackdrop";

export default TubesCursorBackdrop;
