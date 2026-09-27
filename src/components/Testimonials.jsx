import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "../data/socialLinks";

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      className="py-24 lg:py-32 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest justify-center mb-6">
            Testimonials
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-2">
            What People Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] relative"
            >
              <Quote
                className="absolute top-6 right-6 text-blue-600/20"
                size={40}
              />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] overflow-hidden border border-[var(--border-medium)]">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[var(--text-muted)]">
                      {t.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">
                    {t.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                    {t.role}
                  </div>
                </div>
              </div>

              <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.8] italic">
                "{t.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
