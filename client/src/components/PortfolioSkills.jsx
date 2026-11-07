import { useRef, useMemo, useState } from "react";
import { usePortfolioSkills } from "../context/PortfolioDataContext";
import { useGsapReveal } from "../hooks/useGsapReveal";
import TechIcon from "./TechIcon";
import { Wrench, Layers, Sparkles } from "lucide-react";
import {
  contentWidth,
  sectionSurface,
  eyebrow,
  sectionTitle,
  sectionLede,
} from "./portfolioStyles";
import AllSkillsModal from "./AllSkillsModal";

/**
 * Natural technology interleaver: mixes backend, databases, tools, and devops
 * evenly across the slider rather than rigid category blocks.
 */
function mixBackendTechnologies(categories) {
  const backendCat = categories.find((c) => c.id === "backend")?.skills || [];
  const databaseCat = categories.find((c) => c.id === "database")?.skills || [];
  const toolsCat = categories.find((c) => c.id === "tools")?.skills || [];
  const otherCat = categories.find((c) => c.id === "other")?.skills || [];

  const taggedBackend = backendCat.map((s) => ({
    ...s,
    categoryLabel: "Backend",
  }));
  const taggedDatabase = databaseCat.map((s) => ({
    ...s,
    categoryLabel: "Database",
  }));
  const taggedTools = toolsCat.map((s) => ({ ...s, categoryLabel: "Tools" }));
  const taggedOther = otherCat.map((s) => ({ ...s, categoryLabel: "Core" }));

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

  // Fallback if categories are flat
  if (mixed.length === 0) {
    return categories
      .filter((c) => c.id !== "frontend")
      .flatMap((c) =>
        (c.skills || []).map((s) => ({
          ...s,
          categoryLabel: c.label || "Backend",
        })),
      );
  }

  return mixed;
}

/**
 * Clean card skill badge inspired by the reference design
 * Displays official icon and technology name (rounded-md, no percentage)
 * Clicking opens the complete stack modal
 */
function SkillPill({ skill, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/pill inline-flex items-center gap-2 sm:gap-3 rounded-md border border-border bg-surface px-3.5 py-1.5 sm:px-5 sm:py-2.5 transition-all duration-300 hover:border-action hover:bg-surface-alt hover:shadow-lg hover:shadow-action/10 hover:scale-[1.04] select-none cursor-pointer shrink-0 text-left focus:outline-hidden"
      role="button"
      aria-label={`${skill.name} - Click to view all skills`}
      title={`${skill.name} (Click to view full stack breakdown)`}
    >
      {/* Official Technology Brand Icon */}
      <div className="flex size-4.5 sm:size-6 items-center justify-center shrink-0">
        <TechIcon
          name={skill.name}
          iconKey={skill.icon}
          size={16}
          className="transition-transform duration-300 group-hover/pill:scale-110 sm:scale-110"
        />
      </div>

      {/* Technology Name */}
      <span className="text-xs sm:text-sm font-semibold text-primary transition-colors group-hover/pill:text-action whitespace-nowrap">
        {skill.name}
      </span>
    </button>
  );
}

export default function PortfolioSkills() {
  const { skills } = usePortfolioSkills();
  const categories = skills || [];
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Total count of all technologies across categories
  const totalSkillsCount = useMemo(() => {
    return categories.reduce(
      (sum, cat) => sum + (Array.isArray(cat.skills) ? cat.skills.length : 0),
      0,
    );
  }, [categories]);

  // Extract frontend skills
  const frontendSkills = useMemo(() => {
    const frontCat = categories.find((c) => c.id === "frontend");
    if (frontCat && Array.isArray(frontCat.skills)) {
      return frontCat.skills.map((s) => ({ ...s, categoryLabel: "Frontend" }));
    }
    return [];
  }, [categories]);

  // Extract & naturally mix backend, database, tools, and systems skills
  const mixedBackendSkills = useMemo(() => {
    return mixBackendTechnologies(categories);
  }, [categories]);

  // Multipliers for seamless infinite marquee loop (no gaps or jumps)
  const ltrTrackItems = useMemo(() => {
    if (frontendSkills.length === 0) return [];
    // Duplicate 4x to ensure uninterrupted track loop
    return [
      ...frontendSkills,
      ...frontendSkills,
      ...frontendSkills,
      ...frontendSkills,
    ];
  }, [frontendSkills]);

  const rtlTrackItems = useMemo(() => {
    if (mixedBackendSkills.length === 0) return [];
    // Duplicate 3x to ensure uninterrupted track loop
    return [
      ...mixedBackendSkills,
      ...mixedBackendSkills,
      ...mixedBackendSkills,
    ];
  }, [mixedBackendSkills]);

  return (
    <section
      className={`${sectionSurface} relative overflow-hidden bg-canvas`}
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
    >
      {/* Background Blueprint Grid (Preserving Theme Identity) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Section Header (Consistent with Portfolio Design System) */}
      <div className={`${contentWidth} mb-12 sm:mb-16`}>
        <div className="reveal">
          <p className={eyebrow}>
            <span className="text-action">02</span> Skills &amp; Capabilities
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className={`${sectionTitle} max-w-[640px]`} id="skills-title">
              Technical skills &amp;{" "}
              <span className="italic font-normal text-action">
                technologies.
              </span>
            </h2>
            <div className="flex flex-col items-start md:items-end gap-2 pb-2">
              <p className={`${sectionLede} max-w-[420px]`}>
                A curated stack of frontend, backend, database, and system
                technologies I rely on to build resilient, high-performance web
                applications.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-secondary hover:border-action hover:text-action hover:bg-surface-alt transition-all cursor-pointer shadow-xs"
              >
                <Layers size={13} className="text-action" />
                <span>View All Skills ({totalSkillsCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="reveal mx-auto my-12 max-w-lg rounded-xl border border-border bg-surface p-12 text-center">
          <Wrench size={36} className="mx-auto mb-3 text-secondary/50" />
          <h3 className="mb-1 text-base font-semibold text-primary">
            No Skills Configured
          </h3>
          <p className="text-sm text-secondary">
            Add your tech stack in the Admin Dashboard to activate the
            dual-direction sliders.
          </p>
        </div>
      )}

      {/* Sliders Container */}
      {categories.length > 0 && (
        <div className="space-y-4 sm:space-y-5">
          {/* ========================================================= */}
          {/* SLIDER 1: FRONTEND SKILLS (Continuous Left to Right - LTR) */}
          {/* ========================================================= */}
          {frontendSkills.length > 0 && (
            <div
              className="skills-slider-mask slider-pause-on-hover relative w-full overflow-hidden py-2"
              role="region"
              aria-label="Frontend skills slider"
            >
              {/* Left Edge Fade Mask */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-24 md:w-48 lg:w-72 bg-gradient-to-r from-canvas via-canvas/80 to-transparent"
                aria-hidden="true"
              />
              {/* Right Edge Fade Mask */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-24 md:w-48 lg:w-72 bg-gradient-to-l from-canvas via-canvas/80 to-transparent"
                aria-hidden="true"
              />

              {/* Infinite Moving Track (Left to Right) */}
              <div className="flex w-max gap-3.5 sm:gap-4 animate-skills-ltr">
                {ltrTrackItems.map((skill, idx) => (
                  <SkillPill
                    key={`frontend-pill-${skill.name}-${idx}`}
                    skill={skill}
                    onClick={() => setIsModalOpen(true)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SLIDER 2: BACKEND & DATABASE (Continuous Right to Left - RTL) */}
          {/* ========================================================= */}
          {mixedBackendSkills.length > 0 && (
            <div
              className="skills-slider-mask slider-pause-on-hover relative w-full overflow-hidden py-2"
              role="region"
              aria-label="Backend and database skills slider"
            >
              {/* Left Edge Fade Mask */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-24 md:w-48 lg:w-72 bg-gradient-to-r from-canvas via-canvas/80 to-transparent"
                aria-hidden="true"
              />
              {/* Right Edge Fade Mask */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-24 md:w-48 lg:w-72 bg-gradient-to-l from-canvas via-canvas/80 to-transparent"
                aria-hidden="true"
              />

              {/* Infinite Moving Track (Right to Left) */}
              <div className="flex w-max gap-3.5 sm:gap-4 animate-skills-rtl">
                {rtlTrackItems.map((skill, idx) => (
                  <SkillPill
                    key={`backend-pill-${skill.name}-${idx}`}
                    skill={skill}
                    onClick={() => setIsModalOpen(true)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Exploration Hint */}
      <div className={`${contentWidth} mt-10 text-center`}>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="reveal inline-flex items-center gap-2 text-xs text-secondary/75 hover:text-action transition-colors cursor-pointer"
        >
          <Sparkles size={13} className="text-action" />
          <span>
            Click any skill card to view full frontend, backend &amp; database
            breakdown
          </span>
        </button>
      </div>

      {/* All Skills Modal Dialog */}
      <AllSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
      />
    </section>
  );
}
