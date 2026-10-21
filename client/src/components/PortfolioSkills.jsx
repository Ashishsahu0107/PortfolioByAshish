import { useEffect, useRef, useState } from "react";
import { skillsApi } from "../services/api";
import {
  Code2,
  FileCode,
  Globe,
  Palette,
  Wind,
  Route,
  Server,
  Zap,
  Network,
  ShieldCheck,
  KeyRound,
  Database,
  TableProperties,
  GitBranch,
  Terminal,
  Send,
  Coffee,
  Binary,
  Radio,
  Cloud,
  Eye,
  CheckCircle2,
  Info,
} from "lucide-react";
import { GithubIcon } from "./icons";
import { skillCategories } from "../data/skills";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  sectionLede,
  sectionSurface,
  sectionTitle,
} from "./portfolioStyles";

const ICON_MAP = {
  Code2,
  FileCode,
  Globe,
  Palette,
  Wind,
  Route,
  Server,
  Zap,
  Network,
  ShieldCheck,
  KeyRound,
  Database,
  TableProperties,
  GitBranch,
  Github: GithubIcon,
  Terminal,
  Send,
  Coffee,
  Binary,
  Radio,
  Cloud,
  Eye,
};

function SkillIcon({ iconKey }) {
  const IconComponent = ICON_MAP[iconKey] || Code2;
  return (
    <span
      className="flex items-center justify-center size-7 rounded-sm bg-surface text-action group-hover:bg-action group-hover:text-canvas transition-colors shrink-0"
      aria-hidden="true"
    >
      <IconComponent size={15} />
    </span>
  );
}


export default function PortfolioSkills() {
  const [categories, setCategories] = useState(skillCategories);
  const [activeTab, setActiveTab] = useState("all");
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  useEffect(() => {
    async function loadSkills() {
      try {
        const live = await skillsApi.get();
        if (Array.isArray(live) && live.length > 0) {
          setCategories(live);
        }
      } catch (err) {
        console.warn("Using fallback skills:", err.message);
      }
    }
    loadSkills();
  }, []);

  const displayedCategories =
    activeTab === "all"
      ? categories
      : categories.filter((cat) => cat.id === activeTab);

  return (
    <section
      className={`${sectionSurface} bg-surface-alt/40`}
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
    >
      <div className={contentWidth}>
        {/* Section Heading */}
        <div className="reveal max-w-[650px]">
          <p className={eyebrow}>
            <span className="text-action">02</span> Tools of the Trade
          </p>
          <h2 className={sectionTitle} id="skills-title">
            A considered <span className="italic font-normal text-action">toolkit.</span>
          </h2>
          <p className={sectionLede}>
            Every technology in my workflow is chosen for reliability, developer ergonomics,
            and end-user performance.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="reveal mb-8 mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Skill categories"
        >
          <button
            className={`min-h-9 rounded-sm border px-3.5 font-mono text-[11px] font-medium transition-all cursor-pointer ${
              activeTab === "all"
                ? "border-action bg-action text-canvas"
                : "border-border bg-surface text-secondary hover:border-action hover:text-primary"
            }`}
            onClick={() => setActiveTab("all")}
            role="tab"
            aria-selected={activeTab === "all"}
          >
            All Disciplines
          </button>
          {skillCategories.map((category) => (
            <button
              key={category.id}
              className={`min-h-9 rounded-sm border px-3.5 font-mono text-[11px] font-medium transition-all cursor-pointer ${
                activeTab === category.id
                  ? "border-action bg-action text-canvas"
                  : "border-border bg-surface text-secondary hover:border-action hover:text-primary"
              }`}
              onClick={() => setActiveTab(category.id)}
              role="tab"
              id={`tab-${category.id}`}
              aria-selected={activeTab === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Categorized Skills Grid */}
        <div className="space-y-8">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="reveal rounded-lg border border-border bg-surface p-6 shadow-xs"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-action" />
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    {category.label}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase text-secondary">
                  {category.skills.length} Technologies
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex flex-col justify-between rounded-sm border border-border/70 bg-canvas/60 p-3.5 transition-all hover:-translate-y-0.5 hover:border-action hover:bg-canvas"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-sm font-semibold text-primary group-hover:text-action">
                        {skill.name}
                      </span>
                      <SkillIcon iconKey={skill.icon} />
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-secondary">
                      {skill.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[9px] text-secondary">
                      <span className="flex items-center gap-1 text-action">
                        <CheckCircle2 size={11} />
                        <span>Proficient</span>
                      </span>
                      <span>Level {skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PRD Section 3.4 Integrity Notice */}
        <div className="reveal mt-8 flex items-center gap-3 rounded-md border border-border/70 bg-surface px-4 py-3 text-[11px] text-secondary">
          <Info size={16} className="shrink-0 text-action" />
          <span>
            <strong>Integrity Notice:</strong> Skill percentages represent comparative self-assessment and practical project depth rather than absolute mastery. Always growing, always learning.
          </span>
        </div>
      </div>
    </section>
  );
}
