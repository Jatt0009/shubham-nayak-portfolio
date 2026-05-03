"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function CaseStudyPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);

  // Initialize canvas with the "cluttered UI" drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Draw the "Cluttered" overlay
    ctx.fillStyle = "#111827"; // Dark gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw fake messy UI elements to simulate the "Before" state
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const w = Math.random() * 100 + 20;
      const h = Math.random() * 60 + 10;
      ctx.fillRect(x, y, w, h);
    }
    
    // Draw Text warning
    ctx.fillStyle = "#ef4444"; // Red
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.fillText("Cluttered UI (Before)", 40, 60);

    // Setup brush for erasing
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 80;
    
    // Handle resizing
    const handleResize = () => {
      // Simplistic resize handling: just reset canvas
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setScratchedPercentage(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Check percentage loosely (every 10th move for performance)
    if (Math.random() < 0.1) {
      calculateScratchedArea(ctx, canvas);
    }
  };

  const calculateScratchedArea = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentPixels = 0;
    // Check every 16th pixel for speed
    for (let i = 0; i < pixels.length; i += 16) {
      if (pixels[i + 3] === 0) { // Alpha channel
        transparentPixels++;
      }
    }
    const totalChecks = pixels.length / 16;
    setScratchedPercentage((transparentPixels / totalChecks) * 100);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    scratch(x, y);
  };

  return (
    <section className="py-32 px-6 bg-dark-800 border-y border-white/5" id="process">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Uncover The Process</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Design is about stripping away the unnecessary. <br/>
            <strong className="text-accent-light">Scratch the dark surface below</strong> to reveal the clean, usable solution.
          </p>
        </div>

        {/* Scratch Card Container */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden glass-card interactive cursor-crosshair shadow-2xl"
        >
          {/* AFTER Image (Background / Clean UI) */}
          <div className="absolute inset-0 bg-dark-900 flex items-center justify-center p-8 pointer-events-none">
             <div className="w-full h-full border border-accent/30 rounded-2xl bg-accent/5 flex flex-col p-6 shadow-[0_0_50px_rgba(14,165,233,0.1)]">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-accent-light font-bold text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5"/> Clean & Premium (After)
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                  </div>
                </div>
                
                <div className="w-full h-12 bg-white/10 rounded-xl mb-6 backdrop-blur-md" />
                <div className="flex gap-6 h-full">
                  <div className="w-1/4 bg-white/5 rounded-xl h-full border border-white/5" />
                  <div className="w-3/4 bg-white/10 rounded-xl h-full border border-white/5 grid grid-cols-3 gap-4 p-4">
                     <div className="bg-white/5 rounded-lg h-24" />
                     <div className="bg-white/5 rounded-lg h-24" />
                     <div className="bg-white/5 rounded-lg h-24" />
                  </div>
                </div>
             </div>
          </div>

          {/* Canvas Overlay for Scratching */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-10 touch-none transition-opacity duration-1000 ${scratchedPercentage > 70 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onMouseDown={(e) => { setIsDrawing(true); handleMouseMove(e); }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => { setIsDrawing(true); handleMouseMove(e); }}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={handleMouseMove}
          />
          
          {/* Success message when scratched enough */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: scratchedPercentage > 70 ? 1 : 0, scale: scratchedPercentage > 70 ? 1 : 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none bg-accent text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(14,165,233,0.5)]"
          >
            Design Cleaned! ✨
          </motion.div>
        </div>

        {/* Storytelling */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="text-xl font-semibold text-white mb-2">1. The Clutter</h4>
            <p className="text-gray-400 text-sm leading-relaxed">Users were overwhelmed by dense information architecture, leading to a 40% drop-off rate during onboarding.</p>
          </motion.div>
          <motion.div initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-xl font-semibold text-accent-light mb-2">2. The Process</h4>
            <p className="text-gray-400 text-sm leading-relaxed">Like scratching off dirt, I stripped away non-essential elements to reveal the core user journey.</p>
          </motion.div>
          <motion.div initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-xl font-semibold text-white mb-2">3. The Solution</h4>
            <p className="text-gray-400 text-sm leading-relaxed">A clean, breathable interface that increased user retention by 65% and improved task completion speed.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
