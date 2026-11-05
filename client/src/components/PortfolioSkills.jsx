import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { skillsApi } from "../services/api";
import { usePortfolioSync } from "../hooks/usePortfolioSync";
import { usePortfolioSkills } from "../context/PortfolioDataContext";
import { useGsapReveal } from "../hooks/useGsapReveal";
import TechIcon from "./TechIcon";
import {
  CheckCircle2,
  Info,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Server,
  Code2,
} from "lucide-react";
import {
  contentWidth,
  eyebrow,
  sectionLede,
  sectionSurface,
  sectionTitle,
} from "./portfolioStyles";

/**
 * Natural technology interleaver: mixes backend, databases, tools, and devops
 * evenly across the slider rather than rigid category blocks.
 */
function mixBackendTechnologies(categories) {
  const backendCat = categories.find((c) => c.id === "backend")?.skills || [];
  const databaseCat = categories.find((c) => c.id === "database")?.skills || [];
  const toolsCat = categories.find((c) => c.id === "tools")?.skills || [];
  const otherCat = categories.find((c) => c.id === "other")?.skills || [];

  // Tag each with parent category label for display
  const taggedBackend = backendCat.map((s) => ({ ...s, categoryLabel: "Backend & API" }));
  const taggedDatabase = databaseCat.map((s) => ({ ...s, categoryLabel: "Database" }));
  const taggedTools = toolsCat.map((s) => ({ ...s, categoryLabel: "DevOps & Tools" }));
  const taggedOther = otherCat.map((s) => ({ ...s, categoryLabel: "Core & Systems" }));

  // Interleave round-robin across arrays
  const buckets = [taggedBackend, taggedDatabase, taggedTools, taggedOther];
  const mixed = [];
  let index = 0;
  let remaining = true;

  while (remaining) {
    remaining = false;
    for (let b = 0; b < buckets.length; b++) {
      if (index < buckets[b].length) {
        mixed.push(buckets[b][index]);
        remaining = true;
      }
    }
    index++;
  }

  // Fallback if categories are custom/flat
  if (mixed.length === 0) {
    return categories
      .filter((c) => c.id !== "frontend")
      .flatMap((c) => (c.skills || []).map((s) => ({ ...s, categoryLabel: c.label || "Backend" })));
  }

  return mixed;
}

/**
 * Individual modern skill card
 */
function SkillCard({ skill }) {
  return (
    <div
      className="group/card relative w-[290px] sm:w-[320px] shrink-0 select-none rounded-xl border border-border/80 bg-surface/90 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-action/80 hover:bg-surface hover:shadow-xl hover:shadow-action/10"
      role="article"
      aria-label={`${skill.name} - ${skill.level}% proficiency`}
    >
      {/* Top Header: Tech Icon, Name & Category Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-alt/70 p-2 shadow-inner transition-transform duration-300 group-hover/card:scale-105 group-hover/card:border-action/40">
            <TechIcon
              name={skill.name}
              iconKey={skill.icon}
              size={22}
              className="transition-transform duration-300 group-hover/card:scale-110"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-mono text-sm font-bold text-primary transition-colors group-hover/card:text-action truncate">
              {skill.name}
            </h4>
            <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-secondary/80">
              {skill.categoryLabel || "Proficiency"}
            </span>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-border/60 bg-surface-alt/40 px-2 py-0.5 font-mono text-[9px] font-medium text-action">
          {skill.level}%
        </span>
      </div>

      {/* Description */}
      <p className="mt-2.5 line-clamp-2 min-h-[34px] text-xs leading-relaxed text-secondary">
        {skill.description || "Production-grade implementation, patterns, and architectural depth."}
      </p>

      {/* Footer: Level Progress Bar & Status */}
      <div className="mt-3.5 border-t border-border/40 pt-2.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-action/60 to-action transition-all duration-700 ease-out"
            style={{ width: `${Math.max(10, Math.min(100, skill.level || 80))}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-secondary">
          <span className="flex items-center gap-1 text-action">
            <CheckCircle2 size={11} className="shrink-0" />
            <span>Production Ready</span>
          </span>
          <span className="text-[10px] text-secondary/70">Mastery {skill.level}%</span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSkills() {
  const { skills: initialSkills, refreshSkills } = usePortfolioSkills();
  const [categories, setCategories] = useState(() => initialSkills || []);
  const [loading, setLoading] = useState(() => !initialSkills || initialSkills.length === 0);
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  const loadSkills = useCallback(async () => {
    try {
      if (!categories || categories.length === 0) {
        setLoading(true);
      }
      const live = await skillsApi.get();
      if (Array.isArray(live) && live.length > 0) {
        setCategories(live);
      }
    } catch (err) {
      console.warn("[PortfolioSkills] Live skills fetch warning:", err.message);
    } finally {
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Real-time synchronization whenever skills are updated in Admin
  usePortfolioSync(loadSkills, "skills");

  // Keep synced with context
  useEffect(() => {
    if (Array.isArray(initialSkills) && initialSkills.length > 0) {
      setCategories(initialSkills);
      setLoading(false);
    }
  }, [initialSkills]);

  // Extract frontend skills
  const frontendSkills = useMemo(() => {
    const frontCat = categories.find((c) => c.id === "frontend");
    if (frontCat && Array.isArray(frontCat.skills)) {
      return frontCat.skills.map((s) => ({ ...s, categoryLabel: "Frontend & UI" }));
    }
    return [];
  }, [categories]);

  // Extract & naturally mix backend, database, tools, and systems skills
  const mixedBackendSkills = useMemo(() => {
    return mixBackendTechnologies(categories);
  }, [categories]);

  // Multipliers for seamless infinite marquee loop
  const ltrTrackItems = useMemo(() => {
    if (frontendSkills.length === 0) return [];
    // Duplicate 4x to ensure uninterrupted track loop
    return [...frontendSkills, ...frontendSkills, ...frontendSkills, ...frontendSkills];
  }, [frontendSkills]);

  const rtlTrackItems = useMemo(() => {
    if (mixedBackendSkills.length === 0) return [];
    // Duplicate 3x to ensure uninterrupted track loop
    return [...mixedBackendSkills, ...mixedBackendSkills, ...mixedBackendSkills];
  }, [mixedBackendSkills]);

  return (
    <section
      className={`${sectionSurface} relative overflow-hidden bg-surface-alt/30 py-20 sm:py-24`}
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
    >
      <div className={contentWidth}>
        {/* Section Heading */}
        <div className="reveal max-w-[650px]">
          <p className={eyebrow}>
            <span className="text-action font-mono">02</span> Tools of the Trade
          </p>
          <h2 className={sectionTitle} id="skills-title">
            A considered <span className="italic font-normal text-action">toolkit.</span>
          </h2>
          <p className={sectionLede}>
            Every technology in my workflow is chosen for reliability, developer ergonomics,
            and end-user performance. Continuously sliding across disciplines.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && categories.length === 0 && (
        <div className="mt-12 space-y-8 px-4">
          <div className="h-44 w-full animate-pulse rounded-2xl border border-border bg-surface/60" />
          <div className="h-44 w-full animate-pulse rounded-2xl border border-border bg-surface/60" />
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="reveal mx-auto mt-12 max-w-lg rounded-xl border border-border bg-surface p-12 text-center">
          <Wrench size={36} className="mx-auto mb-3 text-secondary/50" />
          <h3 className="mb-1 text-base font-semibold text-primary">No Skills Configured</h3>
          <p className="text-sm text-secondary">
            Add your tech stack in the Admin Dashboard to activate the dual-direction sliders.
          </p>
        </div>
      )}

      {/* Animated Dual-Direction Sliders */}
      {categories.length > 0 && (
        <div className="mt-14 space-y-12">
          {/* ========================================================= */}
          {/* SLIDER 1: FRONTEND SKILLS (Continuous Left to Right - LTR) */}
          {/* ========================================================= */}
          {frontendSkills.length > 0 && (
            <div className="reveal space-y-3.5">
              <div className={`${contentWidth} flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-md border border-action/30 bg-action/10 text-action">
                    <Code2 size={14} />
                  </span>
                  <h3 className="font-serif text-lg font-bold text-primary sm:text-xl">
                    Frontend Engineering
                  </h3>
                  <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-secondary">
                    {frontendSkills.length} Technologies
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-secondary">
                  <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 px-2.5 py-1">
                    <ArrowRight size={12} className="text-action animate-pulse" />
                    <span>Left to Right</span>
                  </span>
                  <span className="hidden sm:inline text-secondary/60">&bull; Hover to pause</span>
                </div>
              </div>

              {/* Slider Viewport with Gradient Edge Masks */}
              <div
                className="slider-pause-on-hover relative w-full overflow-hidden py-3"
                role="region"
                aria-label="Frontend skills continuous slider"
              >
                {/* Left Edge Fade Mask */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-canvas via-canvas/80 to-transparent"
                  aria-hidden="true"
                />
                {/* Right Edge Fade Mask */}
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-canvas via-canvas/80 to-transparent"
                  aria-hidden="true"
                />

                {/* Infinite Moving Track */}
                <div className="flex w-max gap-5 sm:gap-6 animate-skills-ltr">
                  {ltrTrackItems.map((skill, idx) => (
                    <SkillCard key={`frontend-ltr-${skill.name}-${idx}`} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SLIDER 2: BACKEND & SYSTEMS (Continuous Right to Left - RTL) */}
          {/* ========================================================= */}
          {mixedBackendSkills.length > 0 && (
            <div className="reveal space-y-3.5 pt-2">
              <div className={`${contentWidth} flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-md border border-action/30 bg-action/10 text-action">
                    <Server size={14} />
                  </span>
                  <h3 className="font-serif text-lg font-bold text-primary sm:text-xl">
                    Backend, Databases & Cloud Systems
                  </h3>
                  <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-secondary">
                    {mixedBackendSkills.length} Technologies Mixed
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-secondary">
                  <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 px-2.5 py-1">
                    <ArrowLeft size={12} className="text-action animate-pulse" />
                    <span>Right to Left</span>
                  </span>
                  <span className="hidden sm:inline text-secondary/60">&bull; Hover to pause</span>
                </div>
              </div>

              {/* Slider Viewport with Gradient Edge Masks */}
              <div
                className="slider-pause-on-hover relative w-full overflow-hidden py-3"
                role="region"
                aria-label="Backend and systems skills continuous slider"
              >
                {/* Left Edge Fade Mask */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-canvas via-canvas/80 to-transparent"
                  aria-hidden="true"
                />
                {/* Right Edge Fade Mask */}
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-canvas via-canvas/80 to-transparent"
                  aria-hidden="true"
                />

                {/* Infinite Moving Track */}
                <div className="flex w-max gap-5 sm:gap-6 animate-skills-rtl">
                  {rtlTrackItems.map((skill, idx) => (
                    <SkillCard key={`backend-rtl-${skill.name}-${idx}`} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integrity Notice */}
      <div className={`${contentWidth} mt-12`}>
        <div className="reveal flex items-center gap-3 rounded-lg border border-border/70 bg-surface/70 px-4 py-3 text-[11px] text-secondary backdrop-blur-sm">
          <Info size={16} className="shrink-0 text-action" />
          <span>
            <strong>Integrity Notice:</strong> Skill percentages represent comparative self-assessment and practical project depth rather than absolute mastery. Continuous dual-track integration ensures both interface aesthetics and distributed system resilience.
          </span>
        </div>
      </div>
    </section>
  );
}
