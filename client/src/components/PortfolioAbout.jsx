import { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  Server,
  Terminal,
  Globe,
  Layers,
  Zap,
  Sparkles,
} from "lucide-react";
import { useDeveloper } from "../context/DeveloperContext";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  sectionSurface,
  textLink,
} from "./portfolioStyles";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";
import { aboutApi } from "../services/api";
import { usePortfolioSync } from "../hooks/usePortfolioSync";

const iconMap = {
  Code2,
  Server,
  Database,
  Cpu,
  Terminal,
  Globe,
  Layers,
  Zap,
};

export default function PortfolioAbout() {
  const { developer } = useDeveloper();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);
  const { openResumeModal } = useResumeModal();

  const loadAbout = useCallback(async () => {
    try {
      setLoading(true);
      const live = await aboutApi.get();
      if (live) {
        setAboutData({
          bio: live.bio || developer?.bio || "",
          philosophy: live.philosophy || developer?.philosophy || "",
          github: live.github || developer?.github || "",
          focusAreas: Array.isArray(live.focusAreas) ? live.focusAreas : [],
          stats: Array.isArray(live.stats) && live.stats.length > 0 ? live.stats : (developer?.stats || []),
        });
      }
    } catch (err) {
      console.warn("[PortfolioAbout] Could not load about data:", err.message);
    } finally {
      setLoading(false);
    }
  }, [developer]);

  useEffect(() => {
    loadAbout();
  }, [loadAbout]);

  // Real-time synchronization whenever about content is updated
  usePortfolioSync(loadAbout, "about");

  const bioText = aboutData?.bio || developer?.bio || "";
  const philosophyText = aboutData?.philosophy || developer?.philosophy || "";
  const githubLink = aboutData?.github || developer?.github || "";
  const focusAreas = aboutData?.focusAreas || [];
  const stats = aboutData?.stats || developer?.stats || [];

  return (
    <section
      className={`${sectionSurface} bg-canvas`}
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
    >
      <div className={contentWidth}>
        {/* Section Eyebrow */}
        <div className="reveal mb-8">
          <p className={eyebrow}>
            <span className="text-action">01</span> A Little About Me
          </p>
        </div>

        {/* Asymmetric 2-Column Grid (Story Narrative vs Focus Areas) */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column (7 cols): Editorial Headline & Narrative */}
          <div className="reveal lg:col-span-7">
            <h2
              className="mb-6 font-serif text-[clamp(36px,4.5vw,60px)] font-bold leading-[1.08] text-primary"
              id="about-title"
            >
              {philosophyText ? (
                <span>{philosophyText}</span>
              ) : (
                <>
                  Good software should feel{" "}
                  <span className="italic font-normal text-action">inevitable.</span>
                </>
              )}
            </h2>

            <div className="space-y-4 text-[15px] leading-[1.9] text-secondary">
              {bioText ? (
                <p className="whitespace-pre-line">{bioText}</p>
              ) : loading ? (
                <div className="h-20 animate-pulse rounded bg-surface" />
              ) : (
                <p className="italic text-secondary/70">No biography details added in database.</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {githubLink && (
                <a
                  className={textLink}
                  href={githubLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Inspect my GitHub commits</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              <button
                type="button"
                className={`${textLink} cursor-pointer inline-flex items-center gap-1.5`}
                onClick={() => openResumeModal("modern")}
              >
                <span>Resume PDF (6 Templates)</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Core Engineering Focus Areas */}
          <div className="reveal lg:col-span-5 flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 shadow-xs">
            <div className="mb-2 flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                Core Competencies
              </span>
              <span className="font-mono text-[9px] text-action">
                Full Stack Scope
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-12 animate-pulse rounded bg-canvas" />
                ))}
              </div>
            ) : focusAreas.length === 0 ? (
              <div className="py-8 text-center text-xs text-secondary italic">
                No focus areas configured in database.
              </div>
            ) : (
              <div className="space-y-3.5">
                {focusAreas.map((area, index) => {
                  const IconComponent = iconMap[area.icon] || Code2;
                  return (
                    <div
                      key={area.title || index}
                      className="group flex items-start gap-3.5 rounded-sm p-2 transition-colors hover:bg-surface-alt"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-border bg-canvas text-action transition-colors group-hover:border-action">
                        <IconComponent size={16} />
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-secondary/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <strong className="text-[13px] font-semibold text-primary">
                            {area.title}
                          </strong>
                        </div>
                        {area.description && (
                          <p className="mt-0.5 text-[11px] leading-relaxed text-secondary">
                            {area.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Editorial Stats Bar */}
        {stats.length > 0 && (
          <div className="reveal mt-16 grid grid-cols-2 border-y border-border sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label || index}
                className={`flex flex-col justify-center gap-1.5 p-6 sm:p-7 ${
                  index !== stats.length - 1
                    ? "border-r border-border max-sm:odd:border-r max-sm:even:border-r-0"
                    : ""
                } ${index < 2 ? "max-sm:border-b max-sm:border-border" : ""}`}
              >
                <strong className="font-serif text-3xl font-bold text-action sm:text-4xl">
                  {stat.value}
                </strong>
                <span className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
