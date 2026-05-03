"use client";

import { useEffect, useRef } from "react";

type Particle = {
  baseX: number;
  baseY: number;
  phase: number;
  /** Second phase for Lissajous-style paths */
  phase2: number;
  /** Orbit radius in px — large enough to read on a full-screen hero */
  orbitAmp: number;
  /** Angular speed (rad/s) for idle pattern motion */
  orbitSpeed: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(260, Math.max(120, Math.floor((width * height) / 5200)));

      const sizeScale = Math.min(width, height) / 100;

      for (let index = 0; index < particleCount; index += 1) {
        const baseX = Math.random() * width;
        const baseY = Math.random() * height;
        const orbitAmp = Math.max(14, Math.min(34, 12 + sizeScale * 8 + Math.random() * 14));

        particles.push({
          baseX,
          baseY,
          phase: Math.random() * Math.PI * 2,
          phase2: Math.random() * Math.PI * 2,
          orbitAmp,
          orbitSpeed: 0.22 + Math.random() * 0.55,
          x: baseX,
          y: baseY,
          vx: 0,
          vy: 0,
          radius: Math.random() * 2.5 + 1.4,
          alpha: Math.random() * 0.32 + 0.2,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      createParticles();
    };

    const movePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const leavePointer = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const t = performance.now() * 0.001;

      for (const particle of particles) {
        const w = particle.orbitSpeed;
        const ang1 = t * w + particle.phase;
        const ang2 = t * w * 1.63 + particle.phase2;

        const ox =
          Math.cos(ang1) * particle.orbitAmp +
          Math.sin(ang2) * (particle.orbitAmp * 0.38);
        const oy =
          Math.sin(ang1 * 1.07) * particle.orbitAmp * 0.92 +
          Math.cos(ang2 * 0.91) * (particle.orbitAmp * 0.32);

        const targetX = particle.baseX + ox;
        const targetY = particle.baseY + oy;
        const toBaseX = targetX - particle.x;
        const toBaseY = targetY - particle.y;

        particle.vx += toBaseX * 0.014;
        particle.vy += toBaseY * 0.014;

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const radius = 140;

          if (distance > 0 && distance < radius) {
            const force = (1 - distance / radius) * 2.6;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        particle.vx *= 0.88;
        particle.vy *= 0.88;
        particle.x += particle.vx;
        particle.y += particle.vy;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(214, 32, 58, ${Math.min(0.95, particle.alpha * 1.15)})`;
        context.fill();

        if (pointer.active) {
          const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
          if (distance < 115) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(pointer.x, pointer.y);
            context.strokeStyle = `rgba(214, 32, 58, ${0.18 * (1 - distance / 115)})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerleave", leavePointer);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerleave", leavePointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
