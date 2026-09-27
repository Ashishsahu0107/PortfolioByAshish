import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skillCategories } from "../data/skills";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

function SkillCard({ skill, inView, index, categoryColor }) {
  return (
    <motion.div
      variants={fadeUp(index * 0.05)}
      whileHover={{ y: -4, borderColor: "var(--border-accent)" }}
      className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Hover gradient bg */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top left, ${categoryColor}08, transparent 60%)`,
        }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
        style={{
          background: `${categoryColor}12`,
          border: `1px solid ${categoryColor}20`,
        }}
      >
        <span className="text-lg">{skill.icon}</span>
      </div>

      <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
        {skill.name}
      </div>
      <div className="text-[0.72rem] text-[var(--text-muted)] leading-[1.5] mb-3">
        {skill.description}
      </div>

      {/* Bar */}
      <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${skill.level}%` : "0%" }}
          transition={{
            duration: 1,
            delay: index * 0.05 + 0.3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{
            background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}99)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState("frontend");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const activeCategory = skillCategories.find((c) => c.id === activeTab);

  return (
    <section
      id="skills"
      className="py-24 lg:py-32"
      aria-label="Skills section"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Label */}
          <motion.div variants={fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
              Skills
            </div>
          </motion.div>

          {/* Heading row */}
          <motion.div
            variants={fadeUp(0.1)}
            className="flex justify-between items-end flex-wrap gap-4 mb-10"
          >
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight">
              My Technical
              <br />
              <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
                Expertise.
              </span>
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[360px] text-right">
              A curated set of technologies I build with regularly.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={fadeUp(0.2)}
            className="flex gap-2 mb-8 flex-wrap"
            role="tablist"
            aria-label="Skill categories"
          >
            {skillCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`skills-panel-${cat.id}`}
                  onClick={() => setActiveTab(cat.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-200"
                  style={{
                    background: isActive ? `${cat.color}15` : "transparent",
                    borderColor: isActive
                      ? `${cat.color}40`
                      : "var(--border-subtle)",
                    color: isActive ? cat.color : "var(--text-muted)",
                  }}
                >
                  {cat.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Grid */}
          <motion.div
            key={activeTab}
            id={`skills-panel-${activeTab}`}
            role="tabpanel"
            aria-label={`${activeCategory?.label} skills`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {activeCategory?.skills.map((skill, i) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                inView={inView}
                index={i}
                categoryColor={activeCategory.color}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
