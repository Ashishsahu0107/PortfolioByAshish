import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { developer } from "../data/developer";

function AnimatedCounter({ value, inView }) {
  const [display, setDisplay] = useState("00");

  useEffect(() => {
    if (!inView) return;
    const numStr = value.replace(/[^0-9]/g, "");
    const suffix = value.replace(/[0-9]/g, "");
    const num = parseInt(numStr, 10);
    if (isNaN(num)) {
      setDisplay(value);
      return;
    }
    let current = 0;
    const steps = 40;
    const increment = num / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setDisplay(`${num}${suffix}`);
        clearInterval(timer);
      } else setDisplay(`${Math.floor(current)}${suffix}`);
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <>{display}</>;
}

const fadeSlide = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="about"
      className="py-24 lg:py-32"
      aria-label="About section"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeSlide}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
              About Me
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left */}
            <motion.div variants={fadeSlide}>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mb-6">
                I don't just write code.
                <br />
                <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
                  I build digital experiences.
                </span>
              </h2>

              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-5">
                {developer.bio}
              </p>

              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                My development philosophy:{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  build with intent, test with care, ship with confidence.
                </span>
              </p>

              {/* Quote block */}
              <div className="px-6 py-5 rounded-r-xl bg-blue-600/[0.06] border border-blue-600/15 border-l-[3px] border-l-blue-600">
                <p className="font-mono text-sm text-[var(--text-secondary)] leading-[1.7]">
                  &ldquo;{developer.philosophy}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Right */}
            <motion.div variants={fadeSlide}>
              {/* Stats grid */}
              <div className="grid grid-cols-2 mb-8 rounded-2xl overflow-hidden border border-[var(--border-subtle)]">
                {developer.stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`p-6 text-center bg-[var(--bg-secondary)] ${
                      i < 2 ? "border-b" : ""
                    } ${i % 2 === 0 ? "border-r" : ""} border-[var(--border-subtle)]`}
                  >
                    <div className="text-[2.5rem] font-black tracking-tight leading-none bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} inView={inView} />
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1.5 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail rows */}
              <div className="flex flex-col gap-0">
                {[
                  { label: "Location", value: developer.location },
                  { label: "Focus", value: "MERN Stack · Full Stack" },
                  {
                    label: "Status",
                    value: "Available for freelance & internships",
                  },
                  {
                    label: "Education",
                    value: "B.Tech — Computer Science (2022–2026)",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 border-b border-[var(--border-subtle)] last:border-b-0"
                  >
                    <span className="text-[0.75rem] text-[var(--text-muted)] uppercase tracking-[0.08em] font-semibold">
                      {label}
                    </span>
                    <span className="text-[0.85rem] text-[var(--text-secondary)] text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
