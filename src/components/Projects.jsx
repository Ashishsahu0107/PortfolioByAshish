import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { GithubIcon } from "./icons";
import { projects } from "../data/projects";

function FeaturedProject({ project, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20"
    >
      <div
        className="rounded-3xl p-1 relative overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, ${project.color}30, transparent 40%, transparent 60%, ${project.color}15)`,
        }}
      >
        <div className="bg-[var(--bg-card)] rounded-[22px] overflow-hidden backdrop-blur-xl border border-[var(--border-subtle)] relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0">
            {/* Left: Image/Video placeholder */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full bg-[var(--bg-secondary)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] overflow-hidden group-hover:bg-[var(--bg-card-hover)] transition-colors duration-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center pl-1 bg-[var(--bg-tertiary)] backdrop-blur-md border border-[var(--border-medium)] group-hover:scale-110 transition-transform duration-500"
                  style={{ color: project.color }}
                >
                  <Play size={28} fill="currentColor" />
                </div>
              </div>

              {/* Tag */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(10,10,10,0.6)] backdrop-blur-md border border-[var(--border-subtle)]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: project.color,
                    boxShadow: `0 0 8px ${project.color}`,
                  }}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Featured Project
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                {project.title}
              </div>
              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                {project.shortDescription}
              </p>

              <div className="flex gap-2 flex-wrap mb-10">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[0.7rem] font-semibold bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-auto pt-8 border-t border-[var(--border-subtle)]">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-gradient-to-br from-blue-600 to-sky-500 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] flex-1 sm:flex-none"
                  style={
                    project.gradient ? { background: project.gradient } : {}
                  }
                >
                  View Live Site <ExternalLink size={16} />
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  aria-label="View source code"
                >
                  <GithubIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full flex flex-col rounded-3xl p-px overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--border-medium)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex-1 bg-[var(--bg-card)] border border-transparent backdrop-blur-xl rounded-[23px] overflow-hidden flex flex-col transition-all duration-300 group-hover:bg-[var(--bg-card-hover)]">
        {/* Top/Visual */}
        <div className="h-48 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] relative overflow-hidden flex items-center justify-center">
          <div className="font-mono text-[8rem] font-black text-[var(--border-subtle)] absolute -bottom-8 -right-4 select-none transition-transform duration-500 group-hover:scale-110">
            {project.number}
          </div>
          <div
            className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--bg-tertiary)] border border-[var(--border-medium)] backdrop-blur-md transform group-hover:-translate-y-2 transition-transform duration-300"
            style={{ color: project.color }}
          >
            <Play size={20} fill="currentColor" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3
              className="text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
              style={{ backgroundImage: project.gradient || "none" }}
            >
              {project.title}
            </h3>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-[1.7] mb-6 flex-1">
            {project.shortDescription}
          </p>

          <div className="flex gap-1.5 flex-wrap mb-6">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[0.65rem] font-medium bg-[var(--bg-tertiary)] border border-[var(--border-medium)] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[0.65rem] font-medium bg-transparent text-[var(--text-muted)]">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mt-auto pt-5 border-t border-[var(--border-subtle)]">
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-1.5 hover:gap-2 transition-all"
              style={{ color: project.color }}
            >
              Live App <ArrowRight size={14} />
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <GithubIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const featuredProject = projects.find((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);
  const displayedProjects = showAll
    ? regularProjects
    : regularProjects.slice(0, 3);

  return (
    <section
      id="projects"
      className="py-24 lg:py-32"
      aria-label="Projects section"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
            Work
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-2">
            Selected
            <br />
            <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Projects.
            </span>
          </h2>
        </motion.div>

        {featuredProject && (
          <FeaturedProject project={featuredProject} inView={inView} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {regularProjects.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-transparent text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--bg-card)] hover:border-blue-600/40 hover:-translate-y-0.5"
            >
              {showAll ? "Show Less" : "View All Projects"}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
