import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { experiences } from "../data/experience";

function ExperienceItem({ item, index, inView }) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative flex flex-col md:flex-row items-center justify-between w-full mb-12 lg:mb-24 ${isLeft ? "md:flex-row-reverse" : ""}`}
    >
      {/* Center dot (desktop) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[var(--bg-primary)] border-4 border-blue-600 z-10 items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
        <Briefcase size={14} className="text-blue-500" />
      </div>

      {/* Spacer (desktop) */}
      <div className="hidden md:block w-[45%]"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 50 : -50, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full md:w-[45%]"
      >
        <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] hover:border-blue-500/30 transition-all duration-300 relative group">
          {/* Timeline connector (mobile) */}
          <div className="md:hidden absolute -left-[25px] top-10 w-4 h-[2px] bg-blue-600" />
          <div className="md:hidden absolute -left-[33px] top-8 w-4 h-4 rounded-full border-2 border-blue-600 bg-[var(--bg-primary)] z-10" />

          {/* Type tag */}
          <div className="absolute top-6 right-6 px-2.5 py-1 rounded-md text-[0.65rem] font-bold tracking-wider uppercase bg-blue-600/10 text-blue-400 border border-blue-600/20">
            {item.type}
          </div>

          <h3 className="text-xl font-bold tracking-tight mb-1 text-[var(--text-primary)]">
            {item.title}
          </h3>
          <div className="text-lg font-semibold bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent mb-5">
            {item.company}
          </div>

          <div className="flex flex-wrap gap-4 mb-5 text-[0.8rem] text-[var(--text-muted)] font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {item.year}
            </div>
          </div>

          <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.75] mb-6">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-5 border-t border-[var(--border-subtle)]">
            {item.tags?.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md text-[0.65rem] font-medium bg-[var(--bg-tertiary)] border border-[var(--border-medium)] text-[var(--text-muted)] group-hover:border-[var(--border-accent)] transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="experience"
      className="py-24 lg:py-32"
      aria-label="Experience section"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest justify-center mb-6">
            Experience
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-2">
            Professional
            <br />
            <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Journey.
            </span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Center line (desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-[var(--border-medium)]" />

          {/* Left line (mobile) */}
          <div className="md:hidden absolute left-[2px] top-4 bottom-4 w-px bg-[var(--border-medium)]" />

          <div className="pl-6 md:pl-0">
            {experiences.map((item, index) => (
              <ExperienceItem
                key={item.id}
                item={item}
                index={index}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
