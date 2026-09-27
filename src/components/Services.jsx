import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Monitor, Layers, Server, PenTool, Zap, Shield } from "lucide-react";
import { services, processSteps } from "../data/socialLinks";

const iconMap = {
  Monitor: <Monitor size={22} />,
  Layers: <Layers size={22} />,
  Server: <Server size={22} />,
  Figma: <PenTool size={22} />,
  Zap: <Zap size={22} />,
  Shield: <Shield size={22} />,
};

export default function Services() {
  const svcRef = useRef(null);
  const procRef = useRef(null);
  const svcInView = useInView(svcRef, { once: true, margin: "-15%" });
  const procInView = useInView(procRef, { once: true, margin: "-15%" });

  return (
    <>
      {/* ── Services ── */}
      <section
        aria-label="Services section"
        className="py-24 lg:py-32 bg-white/[0.01]"
        ref={svcRef}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={svcInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
              Services
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-3">
              What I Can
              <br />
              <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
                Build.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-all duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                animate={svcInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, borderColor: "var(--border-accent)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-105 transition-transform duration-300"
                  aria-hidden="true"
                >
                  {iconMap[service.icon]}
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2.5 tracking-tight">
                  {service.title}
                </h3>

                <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.75] mb-5">
                  {service.description}
                </p>

                <div className="flex gap-1.5 flex-wrap">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[0.7rem] font-semibold bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section
        aria-label="Development process section"
        className="py-24 lg:py-32"
        ref={procRef}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={procInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest justify-center">
              Process
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-3">
              How I Work
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-all duration-300 relative text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={procInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, borderColor: "var(--border-accent)" }}
              >
                <div className="font-mono text-3xl font-extrabold text-[var(--border-medium)] leading-none mb-4">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-[0.82rem] text-[var(--text-secondary)] leading-[1.7]">
                  {step.description}
                </p>

                {/* Connector */}
                {i < processSteps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px bg-[var(--border-medium)]"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
