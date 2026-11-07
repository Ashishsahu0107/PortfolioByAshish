import { useRef, useState, useEffect, useCallback } from "react";
import {
  Check,
  Compass,
  Layers,
  Code,
  Server,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Workflow,
} from "lucide-react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { usePortfolioSync } from "../hooks/usePortfolioSync";
import {
  contentWidth,
  eyebrow,
  sectionLede,
  sectionSurface,
  sectionTitle,
} from "./portfolioStyles";
import { sectionsApi } from "../services/api";

const stepIcons = [Compass, Layers, Code, Server, Rocket];

const stepStageLabels = [
  "Initial Scoping & Discovery",
  "Architecture & Blueprints",
  "Full-Stack Development",
  "APIs & Systems Integration",
  "Quality Assurance & Production Ship",
];

const stageArtifacts = [
  "Requirements & User Flows",
  "Design Tokens & Component Specs",
  "Modular Client & Server Code",
  "REST Endpoints & Database Models",
  "CI/CD Pipelines & Production Builds",
];

export default function PortfolioProcess() {
  const [steps, setSteps] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  const loadProcessSection = useCallback(async () => {
    try {
      setLoading(true);
      const sec = await sectionsApi.getById("process");
      if (sec) {
        setSectionData(sec);
        if (sec.content?.items && Array.isArray(sec.content.items)) {
          setSteps(sec.content.items);
        } else {
          setSteps([]);
        }
      }
    } catch (err) {
      console.warn(
        "[PortfolioProcess] Could not load process section:",
        err.message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProcessSection();
  }, [loadProcessSection]);

  // Real-time synchronization whenever sections are modified in Admin
  usePortfolioSync(loadProcessSection, "sections");

  const headingText =
    sectionData?.content?.heading || "How ideas become software.";
  const subheadingText =
    sectionData?.content?.subheading ||
    "A systematic, sequential engineering pipeline that balances rapid iteration with architectural rigor.";

  return (
    <section
      className={`${sectionSurface} bg-surface-alt/25 relative overflow-hidden`}
      id="process"
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      <div className={contentWidth}>
        {/* Section Heading */}
        <div className="reveal max-w-[680px]">
          <p className={eyebrow}>
            <span className="text-action font-semibold">04</span>{" "}
            {sectionData?.name || "Engineering Process"}
          </p>
          <h2 className={sectionTitle} id="process-title">
            {headingText}
          </h2>
          <p className={sectionLede}>{subheadingText}</p>
        </div>

        {/* Loading State */}
        {loading && steps.length === 0 && (
          <div className="mt-12 space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 animate-pulse rounded-xl border border-border bg-surface"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && steps.length === 0 && (
          <div className="reveal mt-12 rounded-xl border border-border bg-surface p-12 text-center max-w-lg mx-auto">
            <Rocket size={36} className="mx-auto text-secondary/50 mb-3" />
            <h3 className="text-base font-semibold text-primary mb-1">
              No Process Steps Configured
            </h3>
            <p className="text-sm text-secondary">
              Configure your engineering process steps in the Admin Dashboard to
              display them here.
            </p>
          </div>
        )}

        {/* Sequential Workflow Pipeline */}
        {steps.length > 0 && (
          <div className="mt-12 space-y-10 sm:space-y-12">
            {/* 1. Horizontal Pipeline Flow Overview (Quick Roadmap Tracker) */}
            <div className="reveal hidden lg:block rounded-2xl border border-border bg-surface/80 p-5 shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Workflow size={15} className="text-action" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Sequential Workflow Pipeline
                  </span>
                </div>
                <span className="font-mono text-[10px] text-secondary">
                  Step 01 &rarr; Step 05 Complete Delivery
                </span>
              </div>

              {/* Horizontal Stepper Path */}
              <div className="grid grid-cols-5 gap-3 items-center">
                {steps.map((item, idx) => {
                  const StepIcon = stepIcons[idx % stepIcons.length] || Compass;
                  const isCurrent = activeStep === idx;
                  const isLast = idx === steps.length - 1;

                  return (
                    <div
                      key={`overview-${item.step || idx}`}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setActiveStep(idx);
                        const el = document.getElementById(`process-step-${idx + 1}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                    >
                      <div
                        className={`rounded-xl border p-3.5 transition-all duration-300 ${
                          isCurrent
                            ? "border-action bg-surface-alt shadow-sm ring-1 ring-action/40 scale-[1.02]"
                            : "border-border bg-canvas/70 hover:border-action/60 hover:bg-surface-alt/60 hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] font-bold text-action">
                            PHASE {item.step || String(idx + 1).padStart(2, "0")}
                          </span>
                          <StepIcon
                            size={14}
                            className={`transition-colors ${
                              isCurrent ? "text-action" : "text-secondary group-hover:text-action"
                            }`}
                          />
                        </div>
                        <h4 className="text-xs font-bold text-primary truncate">
                          {item.phase}
                        </h4>
                        <p className="text-[10px] text-secondary/80 truncate mt-0.5">
                          {item.tagline || stepStageLabels[idx] || "Stage"}
                        </p>
                      </div>

                      {/* Connecting Arrow between pipeline nodes */}
                      {!isLast && (
                        <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 size-4 items-center justify-center rounded-full bg-surface border border-border text-action pointer-events-none">
                          <ArrowRight size={10} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Connected Vertical Timeline Pipeline (Fixed & Mathematically Centered) */}
            <div className="space-y-0">
              {steps.map((item, index) => {
                const StepIcon = stepIcons[index % stepIcons.length] || Compass;
                const stepNum = item.step || String(index + 1).padStart(2, "0");
                const isLast = index === steps.length - 1;

                return (
                  <div
                    key={item.step || index}
                    id={`process-step-${index + 1}`}
                    onMouseEnter={() => setActiveStep(index)}
                    className="reveal group flex items-stretch gap-4 sm:gap-6 md:gap-8"
                  >
                    {/* Left Rail: 100% Mathematically Centered Stepper Node + Connecting Line */}
                    <div className="relative flex flex-col items-center shrink-0 w-10 sm:w-12">
                      {/* Continuous Connecting Line to Next Step (Zero Gap, seamless connection) */}
                      {!isLast && (
                        <div
                          className="pointer-events-none absolute top-5 sm:top-6 -bottom-5 sm:-bottom-6 w-0.5 bg-gradient-to-b from-action via-action to-action/50"
                          aria-hidden="true"
                        />
                      )}

                      {/* Step Number Circle (Centered, sitting directly on top of line with z-10) */}
                      <div className="relative z-10 flex size-10 sm:size-12 items-center justify-center rounded-full border-2 border-action bg-canvas shadow-md transition-all duration-300 group-hover:border-action-hover group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-action/15">
                        <span className="font-mono text-xs sm:text-sm font-bold text-action">
                          {stepNum}
                        </span>
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-action animate-pulse" />
                      </div>
                    </div>

                    {/* Right Rail: Professional & Unique Stage Card */}
                    <div className="flex-1 pb-8 sm:pb-12">
                      <div className="group/card relative rounded-2xl border border-border bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-action/80 hover:bg-surface-alt/40 hover:shadow-xl hover:shadow-action/5">
                        {/* Card Top Header: Step Badge + Phase Category + Progress Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4 mb-6">
                          <div className="flex items-center gap-3">
                            {/* Phase Badge */}
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-action/30 bg-action/10 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-bold text-action">
                              <span className="size-1.5 rounded-full bg-action animate-pulse" />
                              <span>STAGE {stepNum} OF {String(steps.length).padStart(2, "0")}</span>
                            </span>

                            {/* Stage Category */}
                            <span className="font-mono text-[11px] text-secondary font-medium hidden min-[480px]:inline">
                              {stepStageLabels[index] || "Lifecycle"}
                            </span>
                          </div>

                          {/* Progress Badge + Stage Icon */}
                          <div className="flex items-center gap-3">
                            {/* Progress Pill Badge */}
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-canvas/80 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] font-semibold text-secondary shadow-2xs">
                              <span>Progress:</span>
                              <span className="text-action font-bold">
                                {Math.round(((index + 1) / steps.length) * 100)}%
                              </span>
                            </span>

                            {/* Stage Icon */}
                            <div className="flex items-center gap-2 font-mono text-[11px] text-secondary">
                              <div className="grid size-7 place-items-center rounded-lg border border-border bg-canvas text-action transition-transform duration-300 group-hover/card:scale-110">
                                <StepIcon size={14} />
                              </div>
                              <span className="font-medium text-primary hidden sm:inline">{item.phase}</span>
                            </div>
                          </div>
                        </div>

                        {/* Main Content 2-Column Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
                          {/* Left Column: Heading, Tagline & Detailed Narrative */}
                          <div className="lg:col-span-7 space-y-3.5">
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                                {item.phase}
                              </h3>
                              {item.tagline && (
                                <p className="mt-1 font-mono text-xs sm:text-[13px] font-semibold text-action">
                                  {item.tagline}
                                </p>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm leading-relaxed text-secondary sm:leading-relaxed">
                              {item.description}
                            </p>

                            {/* Artifact Status Badges */}
                            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-canvas/80 px-2.5 py-1 text-secondary">
                                <span className="size-1.5 rounded-full bg-action" />
                                <span>Artifact: {stageArtifacts[index] || "Specification"}</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-canvas/80 px-2.5 py-1 text-secondary">
                                <CheckCircle2 size={12} className="text-action" />
                                <span>Verified &amp; Approved</span>
                              </span>
                            </div>
                          </div>

                          {/* Right Column: Concrete Deliverables Terminal Box */}
                          <div className="lg:col-span-5">
                            <div className="rounded-xl border border-border/80 bg-canvas/80 p-4 shadow-xs transition-colors group-hover/card:border-action/40">
                              {/* Terminal Header */}
                              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-red-500/60" />
                                  <span className="size-2 rounded-full bg-yellow-500/60" />
                                  <span className="size-2 rounded-full bg-emerald-500/60" />
                                  <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-secondary font-semibold">
                                    Deliverables Produced
                                  </span>
                                </div>
                                <span className="font-mono text-[10px] text-action font-semibold">
                                  {Array.isArray(item.deliverables) ? `${item.deliverables.length} Items` : ""}
                                </span>
                              </div>

                              {/* Deliverables List */}
                              {Array.isArray(item.deliverables) && item.deliverables.length > 0 ? (
                                <ul className="space-y-2 text-xs text-primary">
                                  {item.deliverables.map((deliv, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-2.5">
                                      <span className="grid size-4 place-items-center rounded-sm bg-action/15 text-action shrink-0 mt-0.5">
                                        <Check size={11} />
                                      </span>
                                      <span className="leading-snug text-secondary/90 hover:text-primary transition-colors">
                                        {deliv}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-secondary italic">
                                  Standard technical verification artifacts.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
