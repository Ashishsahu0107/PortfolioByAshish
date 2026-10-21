import { useRef } from "react";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  Server,
  Terminal,
} from "lucide-react";
import { developer } from "../data/developer";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  sectionSurface,
  textLink,
} from "./portfolioStyles";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";

const iconMap = {
  Code2: Code2,
  Server: Server,
  Database: Database,
  Cpu: Cpu,
  Terminal: Terminal,
};

export default function PortfolioAbout() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);
  const { openResumeModal } = useResumeModal();

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
              Good software should feel{" "}
              <span className="italic font-normal text-action">inevitable.</span>
            </h2>

            <div className="space-y-4 text-[15px] leading-[1.9] text-secondary">
              <p>{developer.bio}</p>
              <p className="text-[14px] text-primary font-medium">
                {developer.philosophy}
              </p>
              <p>
                From designing normalized database schemas in MongoDB to crafting
                fluid, accessible user interfaces in React, I approach every
                project with an engineer’s eye for structural integrity and a
                designer’s reverence for typography, balance, and motion.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                className={textLink}
                href={developer.github}
                target="_blank"
                rel="noreferrer"
              >
                <span>Inspect my GitHub commits</span>
                <ArrowUpRight size={16} />
              </a>
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

          {/* Right Column (5 cols): 5 Core Engineering Focus Areas */}
          <div className="reveal lg:col-span-5 flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 shadow-xs">
            <div className="mb-2 flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                Core Competencies
              </span>
              <span className="font-mono text-[9px] text-action">
                Full Stack Scope
              </span>
            </div>

            <div className="space-y-3.5">
              {developer.focusAreas.map((area, index) => {
                const IconComponent = iconMap[area.icon] || Code2;
                return (
                  <div
                    key={area.title}
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
                      <p className="mt-0.5 text-[11px] leading-relaxed text-secondary">
                        {area.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Editorial Stats Bar */}
        <div className="reveal mt-16 grid grid-cols-2 border-y border-border sm:grid-cols-4">
          {developer.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-center gap-1.5 p-6 sm:p-7 ${
                index !== developer.stats.length - 1
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
      </div>
    </section>
  );
}
