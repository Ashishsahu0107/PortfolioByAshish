import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FolderGit2,
  Layers,
  Pause,
  Sparkles,
} from "lucide-react";
import { projects as fallbackProjects } from "../data/projects";
import { projectsApi } from "../services/api";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  sectionLede,
  sectionSurface,
  sectionTitle,
} from "./portfolioStyles";

const AUTO_SLIDE_INTERVAL = 3800; // 3.8 seconds auto slide

export default function PortfolioProjects() {
  const [projectList, setProjectList] = useState(fallbackProjects);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);

  useGsapReveal(sectionRef);

  useEffect(() => {
    async function loadLiveProjects() {
      try {
        const live = await projectsApi.getAll();
        if (Array.isArray(live) && live.length > 0) {
          setProjectList(live);
        }
      } catch (err) {
        console.warn("Using fallback projects:", err.message);
      }
    }
    loadLiveProjects();
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projectList.length);
  }, [projectList.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projectList.length) % projectList.length);
  }, [projectList.length]);

  // Auto-slide effect that pauses when isPaused is true
  useEffect(() => {
    if (isPaused || projectList.length <= 1) return undefined;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, projectList.length]);

  const activeProject = projectList[activeIndex] || projectList[0] || {};

  // Helper to calculate 3D Coverflow position for each card
  const getCardStyle = (index) => {
    let offset = index - activeIndex;
    const half = projectList.length / 2;

    if (offset > half) offset -= projectList.length;
    if (offset < -half) offset += projectList.length;

    const isCenter = offset === 0;
    const absOffset = Math.abs(offset);

    // Dynamic horizontal spacing per card offset
    const stepX = 230; // pixels
    const translateX = offset * stepX;

    // Scale: center card is enlarged (1.15x), immediate neighbors (0.88x), far neighbors (0.76x)
    const scale = isCenter ? 1.15 : absOffset === 1 ? 0.88 : 0.74;

    // Opacity: center card is 1, near neighbors 0.75, far neighbors 0.4
    const opacity = isCenter ? 1 : absOffset === 1 ? 0.75 : absOffset === 2 ? 0.4 : 0;

    // Grayscale: side cards are 100% grayscale just like in the user reference image
    const filter = isCenter ? "grayscale(0%)" : "grayscale(100%)";

    const zIndex = 30 - absOffset * 10;
    const pointerEvents = absOffset > 2 ? "none" : "auto";

    return {
      transform: `translate3d(calc(-50% + ${translateX}px), -50%, 0) scale(${scale})`,
      opacity,
      filter,
      zIndex,
      pointerEvents,
    };
  };

  return (
    <section
      className={`${sectionSurface} bg-canvas overflow-hidden`}
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-title"
    >
      <div className={contentWidth}>
        {/* Section Header */}
        <div className="reveal">
          <p className={eyebrow}>
            <span className="text-action">03</span> Selected Work
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className={`${sectionTitle} max-w-[620px]`} id="projects-title">
              Things made{" "}
              <span className="italic font-normal text-action">with intent.</span>
            </h2>
            <p className={`${sectionLede} max-w-[360px] pb-2`}>
              3D interactive project showcase. Slides automatically from left to right;
              hover your mouse over the cards to pause.
            </p>
          </div>
        </div>

        {/* Top Controls: Status pill & Prev/Next buttons */}
        <div className="reveal mt-8 flex items-center justify-between border-b border-border/80 pb-4">
          {/* Pause / Auto-sliding Live Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors ${
                isPaused
                  ? "border border-amber-500/40 bg-amber-500/10 text-amber-500"
                  : "border border-action/40 bg-action/10 text-action"
              }`}
            >
              {isPaused ? (
                <>
                  <Pause size={12} className="shrink-0" />
                  <span>Paused on hover</span>
                </>
              ) : (
                <>
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>Auto-sliding</span>
                </>
              )}
            </span>

            <span className="hidden font-mono text-[10px] text-secondary sm:inline">
              (Hover mouse on card to inspect)
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="grid size-9 place-items-center rounded-full border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action cursor-pointer shadow-xs"
              aria-label="Previous project"
              title="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-mono text-[12px] font-semibold text-primary px-2">
              <span className="text-action">{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="text-secondary/60"> / </span>
              <span className="text-secondary">{String(projectList.length).padStart(2, "0")}</span>
            </span>
            <button
              onClick={nextSlide}
              className="grid size-9 place-items-center rounded-full border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action cursor-pointer shadow-xs"
              aria-label="Next project"
              title="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 
          3D COVERFLOW HORIZONTAL STRIP (Matching User's Reference Image):
          - Center card is enlarged, full color, and elevated.
          - Flanking cards are stepped down, scaled, and grayscale.
          - When mouse enters this zone, isPaused = true (automatic sliding stops).
          - When mouse leaves, isPaused = false (sliding resumes).
        */}
        <div
          className="reveal relative mt-10 h-[430px] w-full max-w-full overflow-hidden sm:h-[480px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {projectList.map((project, index) => {
            const isCenter = index === activeIndex;
            const cardStyle = getCardStyle(index);

            return (
              <div
                key={project.id}
                onClick={() => setActiveIndex(index)}
                style={cardStyle}
                className="absolute left-1/2 top-1/2 w-[250px] h-[370px] sm:w-[280px] sm:h-[410px] select-none rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden flex flex-col justify-between"
                aria-label={`Project: ${project.title}`}
              >
                {/* Card Background / Artwork Container */}
                <div
                  className={`absolute inset-0 size-full transition-colors ${
                    isCenter
                      ? "bg-gradient-to-br from-surface via-surface-alt to-surface"
                      : "bg-surface-alt"
                  }`}
                >
                  {/* Subtle Blueprint & Mesh Pattern */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
                      backgroundSize: "18px 18px",
                    }}
                  />

                  {/* Accent Color Band */}
                  <div
                    className="absolute top-0 inset-x-0 h-32 opacity-25"
                    style={{
                      background: `linear-gradient(180deg, ${project.color || "var(--color-accent)"}, transparent)`,
                    }}
                  />

                  {/* Giant Decorative Number in Corner */}
                  <div className="absolute right-4 top-4 font-serif text-7xl font-bold tracking-tight text-primary/10 select-none">
                    {project.number}
                  </div>

                  {/* Visual Blueprint Code Graphics in card center */}
                  <div className="absolute inset-x-5 top-16 rounded-lg border border-border/70 bg-canvas/70 p-3 shadow-xs">
                    <div className="flex items-center gap-1.5 border-b border-border/60 pb-1.5">
                      <span className="size-1.5 rounded-full bg-action/80" />
                      <span className="size-1.5 rounded-full bg-action/50" />
                      <span className="size-1.5 rounded-full bg-action/30" />
                      <span className="ml-auto font-mono text-[8px] text-secondary">
                        {project.year}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-[9px] text-secondary">
                      <p className="flex items-center gap-1 text-action font-semibold">
                        <Code2 size={11} />
                        <span>{project.category}</span>
                      </p>
                      <p className="truncate text-primary/80">
                        {project.tags.slice(0, 3).join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top Corner Pill: Year & Featured */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="rounded-full border border-border bg-canvas/80 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-primary backdrop-blur-xs">
                    {project.number} / {project.year}
                  </span>
                  {isCenter && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-action/40 bg-action/15 px-2.5 py-0.5 font-mono text-[9px] font-medium text-action backdrop-blur-xs">
                      <Sparkles size={10} /> Active
                    </span>
                  )}
                </div>

                {/* 
                  Bottom Glassmorphic Dark Overlay Pill (Matching Reference Image):
                  - Name & Title in prominent font
                  - Subtitle in muted text
                  - Small monogram logo
                */}
                <div className="relative z-10 m-3 rounded-xl border border-white/10 bg-charcoal/90 p-3.5 text-off-white shadow-xl backdrop-blur-md">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-serif text-[15px] sm:text-[16px] font-bold text-white truncate leading-snug">
                        {project.title}
                      </h4>
                      <p className="font-mono text-[10px] text-zinc-300 truncate mt-0.5">
                        {project.subtitle}
                      </p>
                    </div>
                    <span className="grid size-6 shrink-0 place-items-center rounded-sm bg-white/10 font-serif text-[9px] font-bold text-action">
                      AS
                    </span>
                  </div>

                  {/* Micro tags in pill */}
                  <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden">
                    {project.tech.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-xs bg-white/10 px-1.5 py-0.5 font-mono text-[8px] text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto font-mono text-[8px] text-zinc-400">
                      {project.category.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots */}
        <div className="reveal mt-4 flex items-center justify-center gap-2">
          {projectList.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? "w-8 bg-action"
                  : "w-2 bg-border hover:bg-secondary"
              }`}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>

        {/* 
          DETAILED ACTIVE PROJECT CASE STUDY (Synced with the Center Card):
          - Comprehensive narrative & architectural breakdown
          - Features checklist with green checkmarks
          - Tech stack pills
          - 1-click GitHub source & Live Showcase buttons
        */}
        <div className="reveal mt-12 rounded-xl border border-border bg-surface p-6 sm:p-9 shadow-md">
          <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-action uppercase tracking-wider">
                <Layers size={14} />
                <span>Featured Project Deep Dive</span>
              </div>
              <h3 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">
                {activeProject.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-secondary">
                {activeProject.category} · Developed {activeProject.year}
              </p>
            </div>

            {/* Live CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={activeProject.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-canvas px-4 py-2 font-mono text-[11px] text-secondary no-underline transition-colors hover:border-action hover:text-action"
              >
                <FolderGit2 size={15} className="text-action" />
                <span>View Source Code</span>
              </a>

              {activeProject.live && (
                <a
                  href={activeProject.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-action px-4 py-2 font-mono text-[11px] font-semibold text-canvas no-underline transition-all hover:bg-action-hover shadow-xs"
                >
                  <span>Launch Live Demo</span>
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Description & Problem / Solution Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[14px] leading-relaxed text-secondary sm:text-[15px]">
                {activeProject.description}
              </p>

              <div className="grid grid-cols-1 gap-3 rounded-lg border border-border/70 bg-canvas/60 p-4 sm:grid-cols-2">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-action font-semibold">
                    The Problem:
                  </span>
                  <p className="mt-1 text-[12px] leading-relaxed text-secondary">
                    {activeProject.problem}
                  </p>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-action font-semibold">
                    The Solution:
                  </span>
                  <p className="mt-1 text-[12px] leading-relaxed text-secondary">
                    {activeProject.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Highlights Checklist */}
            <div className="lg:col-span-5 rounded-lg border border-border bg-surface-alt/40 p-5">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-3">
                Key Architecture & Features:
              </span>
              <ul className="space-y-2">
                {activeProject.features.slice(0, 6).map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] leading-snug text-primary/90"
                  >
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack Tags */}
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xs border border-border bg-canvas px-2.5 py-1 font-mono text-[9px] text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
