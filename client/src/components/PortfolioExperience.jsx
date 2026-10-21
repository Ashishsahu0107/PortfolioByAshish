import { useRef, useState, useEffect } from "react";
import { Award, Briefcase, FolderOpen, GraduationCap } from "lucide-react";
import { experience as initialExperience } from "../data/experience";
import { experienceApi } from "../services/api";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  sectionLede,
  sectionSurface,
  sectionTitle,
} from "./portfolioStyles";

const typeConfig = {
  education: {
    icon: GraduationCap,
    label: "Education",
    color: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  },
  project: {
    icon: FolderOpen,
    label: "Full Stack Work",
    color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  },
  internship: {
    icon: Briefcase,
    label: "Industry Experience",
    color: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  },
  work: {
    icon: Briefcase,
    label: "Work Experience",
    color: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  },
  certification: {
    icon: Award,
    label: "Mastery & Cert",
    color: "text-purple-500 border-purple-500/30 bg-purple-500/10",
  },
};

export default function PortfolioExperience() {
  const [experienceList, setExperienceList] = useState(initialExperience);
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  useEffect(() => {
    async function loadExperience() {
      try {
        const live = await experienceApi.getAll();
        if (Array.isArray(live) && live.length > 0) {
          setExperienceList(live);
        }
      } catch (err) {
        console.warn("Using fallback experience:", err.message);
      }
    }
    loadExperience();
  }, []);

  return (
    <section
      className={`${sectionSurface} bg-canvas`}
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-title"
    >
      <div className={contentWidth}>
        {/* Section Heading */}
        <div className="reveal max-w-[650px]">
          <p className={eyebrow}>
            <span className="text-action">05</span> Background & Experience
          </p>
          <h2 className={sectionTitle} id="experience-title">
            The path of <span className="italic font-normal text-action">growth.</span>
          </h2>
          <p className={sectionLede}>
            Academic foundations in Computer Science paired with continuous hands-on full stack
            engineering and algorithmic problem solving.
          </p>
        </div>

        {/* Chronological Resume Feed */}
        <div className="mt-12 space-y-6">
          {experienceList.map((item) => {
            const config = typeConfig[item.type] || typeConfig.education;
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="reveal group rounded-lg border border-border bg-surface p-6 sm:p-7 transition-all duration-300 hover:border-action/70 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  {/* Left: Icon, Title, Organization */}
                  <div className="flex items-start gap-4">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-md border ${config.color}`}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-primary group-hover:text-action transition-colors">
                          {item.title}
                        </h3>
                        <span className="rounded-full border border-border bg-surface-alt px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
                          {config.label}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-action font-medium">
                        {item.organization} · {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Right: Period & Status */}
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {item.period}
                    </span>
                    {item.status && (
                      <span className="font-mono text-[10px] text-secondary">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description Narrative */}
                <p className="mt-4 text-[13px] leading-relaxed text-secondary">
                  {item.description}
                </p>

                {/* Highlights / Badges Checklist */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-4 border-t border-border/60 pt-3.5">
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {item.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-[11px] text-secondary leading-snug"
                        >
                          <span className="size-1 rounded-full bg-action mt-1.5 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
