"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const KEY_DATA = [
  // Row 1
  { id: "home", label: "HOME", color: "bg-[#ffffff]", shadow: "#71717a", text: "text-black", span: "col-span-2", link: "/" },
  { id: "cv", label: "CV", color: "bg-[#202020]", shadow: "#000000", text: "text-zinc-50", span: "col-span-1", link: "#resume" },
  {
    id: "ig",
    label: "IG",
    color:
      "bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]",
    shadow: "#7c1365",
    text: "text-white",
    span: "col-span-1",
    link: "https://instagram.com/shubhm_nayak",
  },
  
  // Row 2
  { id: "hire", label: "HIRE ME", color: "bg-[#202020]", shadow: "#000000", text: "text-zinc-50", span: "col-span-3", link: "mailto:shubhamnayak608@gmail.com" },
  { id: "in", label: "IN", color: "bg-[#0a66c2]", shadow: "#04396c", text: "text-white", span: "col-span-1", link: "https://www.linkedin.com/in/shubham-nayak-3bb764255/" },
  
  // Row 3
  { id: "call", label: "CALL ME", color: "bg-[#202020]", shadow: "#000000", text: "text-zinc-50", span: "col-span-2", link: "tel:+917303370652" },
  { id: "b", label: "B", color: "bg-[#B6FF00]", shadow: "#8FBF00", text: "text-black", span: "col-span-2", link: "https://www.behance.net/shubhamnayakkk" },
];

export default function KeyboardFooter() {
  const [radarHover, setRadarHover] = useState(false);

  const normalWave1 = "M -150 150 Q -112.5 100 -75 150 T 0 150 T 75 150 T 150 150 T 225 150 T 300 150 T 375 150 T 450 150";
  const hoverWave1 = "M -150 150 Q -112.5 0 -75 150 T 0 150 T 75 150 T 150 150 T 225 150 T 300 150 T 375 150 T 450 150";

  const normalWave2 = "M -150 150 Q -112.5 120 -75 150 T 0 150 T 75 150 T 150 150 T 225 150 T 300 150 T 375 150 T 450 150";
  const hoverWave2 = "M -150 150 Q -112.5 300 -75 150 T 0 150 T 75 150 T 150 150 T 225 150 T 300 150 T 375 150 T 450 150";

  return (
    <footer 
      className="pt-32 pb-8 md:pb-12 bg-[#f8f8f6] relative w-full flex flex-col items-center justify-center overflow-hidden" 
      id="contact"
      style={{ perspective: "1500px" }}
    >
      <style>{`
        @keyframes waveSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-150px); }
        }
      `}</style>
      
      {/* Top overhead light source (White) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[300px] bg-gradient-to-b from-black/10 via-black/5 to-transparent blur-[80px] pointer-events-none z-0" />
      
      {/* Intense scattered light coming from beneath the keyboard */}
      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[120%] max-w-[1800px] h-[200px] bg-black/10 blur-[100px] pointer-events-none z-0 rounded-full" />
      <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[100px] bg-black/8 blur-[60px] pointer-events-none z-0 rounded-full" />
      <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[50%] max-w-[600px] h-[50px] bg-white/80 blur-[40px] pointer-events-none z-0 rounded-full mix-blend-screen" />
      {/* Keyboard-emitted underglow: source starts beneath chassis and trails downward */}
      <div
        className="absolute bottom-[-4px] left-1/2 z-0 h-[56px] w-[95%] max-w-[1400px] -translate-x-1/2 rounded-[999px] opacity-90 blur-[24px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(182,255,0,0) 0%, rgba(182,255,0,0.18) 12%, rgba(182,255,0,0.32) 50%, rgba(182,255,0,0.18) 88%, rgba(182,255,0,0) 100%)",
        }}
      />
      <div
        className="absolute bottom-[-126px] left-1/2 z-0 h-[220px] w-[95%] max-w-[1500px] -translate-x-1/2 rounded-[999px] opacity-95 blur-[84px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 10%, rgba(182,255,0,0.24) 0%, rgba(182,255,0,0.14) 26%, rgba(182,255,0,0.08) 46%, rgba(214,32,58,0.06) 68%, rgba(0,0,0,0) 100%)",
        }}
      />
      
      {/* Background Ambient Orbs for Frosted Glass Effect */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-black/10 blur-[100px] rounded-full z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-black/8 blur-[120px] rounded-full z-10 pointer-events-none" />
      
      <div className="relative z-40 mb-6 w-[95%] max-w-[1400px] rounded-xl border border-black/20 bg-white px-5 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col items-start justify-between gap-1 text-left sm:flex-row sm:items-center sm:gap-4">
          <a
            href="tel:+917303370652"
            className="font-mono text-sm font-semibold tracking-wide text-black"
          >
            Phone: +91 7303370652
          </a>
          <a
            href="mailto:shubhamnayak608@gmail.com"
            className="font-mono text-sm font-semibold tracking-wide text-black"
          >
            Email: shubhamnayak608@gmail.com
          </a>
        </div>
      </div>

      {/* 3D Tilted Dashboard Chassis (Frosted Acrylic Theme) */}
      <div 
        className="relative w-[95%] max-w-[1400px] rounded-[3rem] bg-white/80 backdrop-blur-[60px] border-t-[2px] border-white border-b-[16px] border-black/25 border-x border-black/10 shadow-[0_80px_180px_rgba(0,0,0,0.18),inset_0_4px_30px_rgba(255,255,255,0.65)] p-6 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 z-20 transition-transform duration-1000 ease-out"
        style={{
          transform: "rotateX(20deg) translateY(0px)",
        }}
      >
        
        {/* Left Side: Keys Cluster */}
        <div className="flex-shrink-0 flex flex-col gap-6 w-full lg:w-[450px]">
          {/* Status Screen */}
          <div className="flex items-center justify-between bg-white rounded-full px-5 py-3 border border-black/15 shadow-[inset_0_5px_15px_rgba(0,0,0,0.08)] w-fit gap-4">
             {/* Small Revolving Radar */}
             <div className="relative w-5 h-5 rounded-full border border-black/30 overflow-hidden flex items-center justify-center bg-[#111111]">
                <div className="absolute w-[2px] h-[2px] bg-accent rounded-full z-10 shadow-[0_0_5px_#B6FF00]" />
                <div className="absolute w-full h-[1px] bg-accent/40" />
                <div className="absolute h-full w-[1px] bg-accent/40" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "conic-gradient(from 0deg, transparent 60%, rgba(182,255,0,0.9) 100%)" }}
                />
             </div>
             <span className="text-black font-mono text-xs uppercase tracking-widest font-semibold opacity-90">Available For Freelance</span>
          </div>

          {/* Keyboard Grid */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-12 mt-6 relative z-50">
            {KEY_DATA.map((key) => (
              <a
                key={key.id}
                href={key.link}
                target={key.link.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={`interactive ${key.span} relative z-50 block outline-none`}
              >
                <motion.div
                  initial={{ y: 0, boxShadow: `0px 16px 0px ${key.shadow}, 0px 24px 30px rgba(0,0,0,0.8)` }}
                  whileHover={{ y: 4, boxShadow: `0px 12px 0px ${key.shadow}, 0px 16px 20px rgba(0,0,0,0.8)` }}
                  whileTap={{ y: 16, boxShadow: `0px 0px 0px ${key.shadow}, 0px 4px 10px rgba(0,0,0,1)` }}
                  className="relative w-full h-16 md:h-20 rounded-[1.5rem] cursor-pointer"
                >
                  {/* Top Face of Keycap */}
                  <div className={`absolute inset-0 rounded-[1.5rem] ${key.color} flex items-center justify-center border-t border-white/40 border-x border-white/10 shadow-[inset_0_-8px_20px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(255,255,255,0.4)] overflow-hidden pointer-events-none`}>
                    {/* Keycap top surface soft highlight to make it look like a smooth pebble */}
                    <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/30 to-transparent rounded-t-[1.5rem]" />
                    <span className={`font-bold text-sm md:text-base tracking-wider z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] ${key.text}`}>
                      {key.label}
                    </span>
                  </div>
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* Center: Cooling Vents */}
        <div className="hidden lg:flex flex-grow flex-col justify-center gap-5 py-12 px-4 relative">
           <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-50 pointer-events-none rounded-3xl" />
           {[...Array(10)].map((_, i) => (
             <div key={i} className="w-full h-3 rounded-full bg-[#111111] shadow-[inset_0_5px_10px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.45)] border border-black/70 relative overflow-hidden">
                {/* Internal green vent glow */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
             </div>
           ))}
        </div>

        {/* Right Side: Oscilloscope Radar */}
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
           {/* Square mounting plate */}
           <div className="relative w-[280px] h-[280px] lg:w-[320px] lg:h-[320px] bg-white rounded-3xl border-b-[6px] border-black/25 shadow-[0_20px_30px_rgba(0,0,0,0.18),inset_0_2px_5px_rgba(255,255,255,0.85)] flex items-center justify-center p-5">
               
               {/* 4 Screws in corners */}
               <div className="absolute top-5 left-5 w-4 h-4 rounded-full bg-[#f1f1ef] shadow-inner border border-black/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
               <div className="absolute top-5 right-5 w-4 h-4 rounded-full bg-[#f1f1ef] shadow-inner border border-black/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
               <div className="absolute bottom-5 left-5 w-4 h-4 rounded-full bg-[#f1f1ef] shadow-inner border border-black/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
               <div className="absolute bottom-5 right-5 w-4 h-4 rounded-full bg-[#f1f1ef] shadow-inner border border-black/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>

               {/* Circular Radar Screen (B/W Theme) */}
               <div 
                 className="relative w-full h-full rounded-full bg-[#050505] border-[8px] border-[#0a0a0c] shadow-[inset_0_15px_40px_rgba(0,0,0,1)] overflow-hidden interactive cursor-crosshair"
                 onMouseEnter={() => setRadarHover(true)}
                 onMouseLeave={() => setRadarHover(false)}
               >
                  
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                     backgroundImage: `linear-gradient(to right, #B6FF00 1px, transparent 1px), linear-gradient(to bottom, #B6FF00 1px, transparent 1px)`,
                     backgroundSize: '30px 30px',
                     backgroundPosition: 'center'
                  }} />
                  
                  {/* Middle horizontal line */}
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-accent/30 -translate-y-1/2" />
                  {/* Middle vertical line */}
                  <div className="absolute left-1/2 top-0 w-[2px] h-full bg-accent/30 -translate-x-1/2" />

                  {/* Animated Sine Wave SVG */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" preserveAspectRatio="none">
                     <defs>
                       <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                         <feGaussianBlur stdDeviation="6" result="blur" />
                         <feComposite in="SourceGraphic" in2="blur" operator="over" />
                       </filter>
                     </defs>
                     
                     {/* Primary Wave */}
                     <motion.path
                        style={{ animation: `waveSlide ${radarHover ? '0.4s' : '2s'} linear infinite` }}
                        animate={{ 
                          d: radarHover ? hoverWave1 : normalWave1,
                          stroke: radarHover ? "#B6FF00" : "#B6FF00"
                        }}
                        transition={{ 
                          d: { duration: 0.3, ease: "easeInOut" },
                          stroke: { duration: 0.3 }
                        }}
                        fill="none"
                        strokeWidth="4"
                        filter="url(#glow)"
                     />
                     
                     {/* Secondary out-of-phase Wave */}
                     <motion.path
                        style={{ animation: `waveSlide ${radarHover ? '0.6s' : '3s'} linear infinite` }}
                        animate={{ 
                          d: radarHover ? hoverWave2 : normalWave2,
                          stroke: radarHover ? "#B6FF00" : "#8FBF00"
                        }}
                        transition={{ 
                          d: { duration: 0.3, ease: "easeInOut" }
                        }}
                        fill="none"
                        strokeWidth="2"
                        opacity="0.5"
                        filter="url(#glow)"
                     />
                  </svg>
                  
                  {/* Screen Vignette/Glass glare */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none" />
                  <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-30 pointer-events-none mix-blend-overlay" />
               </div>
            </div>
        </div>
        
      </div>

    </footer>
  );
}
