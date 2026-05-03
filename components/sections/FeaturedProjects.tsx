"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "healthcare",
    title: "Healthcare App",
    category: "Product Design",
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "pawpal",
    title: "PawPal Pet Care",
    category: "UX/UI Design",
    color: "from-orange-500 to-amber-400",
  },
  {
    id: "elearning",
    title: "E-learning Platform",
    category: "Web Application",
    color: "from-purple-500 to-pink-400",
  },
  {
    id: "portfolio",
    title: "Portfolio Design",
    category: "Interaction Design",
    color: "from-gray-600 to-gray-400",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" id="projects">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Work</h2>
          <div className="w-20 h-1 bg-accent rounded-full" />
        </div>
        <button className="interactive text-gray-400 hover:text-white transition-colors hidden md:block">
          View All Projects
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative cursor-pointer interactive"
          >
            {/* Project Card Graphic / Mockup Placeholder */}
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative glass-card p-4">
              <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${project.color}`} />
              
              {/* Fake UI Elements for aesthetics */}
              <div className="w-full h-full rounded-2xl bg-dark-900/80 border border-white/5 shadow-2xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                 <div className="absolute top-4 left-4 right-4 h-12 flex items-center gap-2 border-b border-white/5 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 </div>
                 <div className="absolute top-20 left-4 right-4 bottom-4 flex flex-col gap-4">
                    <div className="w-1/3 h-6 rounded-lg bg-white/5" />
                    <div className="w-full h-32 rounded-xl bg-white/5" />
                    <div className="flex gap-4">
                      <div className="w-1/2 h-20 rounded-xl bg-white/5" />
                      <div className="w-1/2 h-20 rounded-xl bg-white/5" />
                    </div>
                 </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <ArrowUpRight className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-semibold mb-1 group-hover:text-accent-light transition-colors">{project.title}</h3>
                <p className="text-gray-400">{project.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
