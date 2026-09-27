import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { techStack } from "../data/skills";

const techDetails = {
  React: { desc: "UI Library", color: "#61DAFB" },
  "Node.js": { desc: "Runtime", color: "#68A063" },
  MongoDB: { desc: "Database", color: "#47A248" },
  JavaScript: { desc: "Language", color: "#F7DF1E" },
  Express: { desc: "Framework", color: "#ffffff" },
  Tailwind: { desc: "CSS", color: "#06B6D4" },
  Git: { desc: "Version Control", color: "#F05032" },
  Java: { desc: "Language", color: "#ED8B00" },
};

export default function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      aria-label="Technologies section"
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* BG radial */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest justify-center">
            Tech Stack
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-2">
            Technologies I Work With
          </h2>
        </motion.div>

        {/* Orbit — desktop */}
        <div
          className="relative mx-auto hidden sm:block"
          style={{ width: "min(600px, 90vw)", height: "min(600px, 90vw)" }}
        >
          {/* Rings */}
          {[260, 200, 140].map((r, i) => {
            const speeds = [60, 45, 30]; // Matching the orbit speeds (outer, middle, inner)
            const direction = i % 2 === 0 ? 360 : -360;

            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 z-0"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  animate={{ rotate: direction }}
                  transition={{
                    duration: speeds[i],
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="rounded-full border-[1.5px] border-blue-500/30 border-dashed pointer-events-none"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    opacity: 0.5 - i * 0.1,
                  }}
                />
              </div>
            );
          })}

          {/* Center Sun */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] flex items-center justify-center z-20">
            {/* Pulsing Sun Glow */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 blur-2xl"
            />
            {/* Sun Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="absolute inset-0 rounded-full border-[1.5px] border-amber-400/80 bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.6),inset_0_0_20px_rgba(251,191,36,0.4)]"
            >
              <span className="text-[0.7rem] font-black tracking-[0.1em] uppercase text-amber-200 leading-tight text-center drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                FULL
                <br />
                STACK
              </span>
            </motion.div>
          </div>

          {/* Tech pills orbiting independently */}
          {techStack.map((tech, i) => {
            // Distribute across 3 rings with realistic orbital speeds (inner = fast, outer = slow)
            const rings = [
              { r: 260, speed: 60, dir: 360 }, // Outer ring
              { r: 200, speed: 45, dir: -360 }, // Middle ring
              { r: 140, speed: 30, dir: 360 }, // Inner ring
            ];
            const ringIndex = i % 3;
            const radius = rings[ringIndex].r;
            const duration = rings[ringIndex].speed;
            const direction = rings[ringIndex].dir;

            // Mathematically distribute starting angles so they never clump!
            const initialAngle = (i * 360) / techStack.length;

            const details = techDetails[tech.name] || {
              desc: "",
              color: tech.color || "#fff",
            };

            return (
              <motion.div
                key={tech.name}
                className="absolute top-1/2 left-1/2 z-10"
                initial={{ rotate: initialAngle }}
                animate={{ rotate: initialAngle + direction }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute"
                  style={{
                    transform: `translate(calc(${radius}px - 50%), -50%)`,
                  }}
                >
                  {/* Counter-rotation to keep the pill upright */}
                  <motion.div
                    initial={{ rotate: -initialAngle }}
                    animate={{ rotate: -(initialAngle + direction) }}
                    transition={{ duration, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Entrance animation */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }}
                    >
                      {/* Floating and Hover */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 3 + i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.4,
                        }}
                        whileHover={{ scale: 1.1 }}
                        className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl backdrop-blur-md min-w-[70px] text-center cursor-pointer transition-all duration-200"
                        style={{
                          background: "var(--bg-secondary)",
                          border: `1px solid ${details.color}25`,
                          boxShadow: `0 0 20px ${details.color}10`,
                        }}
                      >
                        <span
                          className="text-[0.7rem] font-bold tracking-[0.03em]"
                          style={{ color: details.color }}
                        >
                          {tech.name}
                        </span>
                        <span className="text-[0.6rem] text-[var(--text-muted)] tracking-[0.06em]">
                          {details.desc}
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile fallback grid */}
        <div className="grid grid-cols-4 gap-3 mt-8 sm:hidden">
          {techStack.map((tech) => {
            const details = techDetails[tech.name] || { color: tech.color };
            return (
              <div
                key={tech.name}
                className="p-3 rounded-xl text-center bg-[var(--bg-card)] border"
                style={{ borderColor: `${details.color}20` }}
              >
                <div
                  className="text-[0.75rem] font-bold"
                  style={{ color: details.color }}
                >
                  {tech.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
