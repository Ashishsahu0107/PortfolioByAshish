import { useRef } from "react";
import { Check, Compass, Layers, Code, Server, Rocket } from "lucide-react";
import { processSteps } from "../data/process";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  sectionLede,
  sectionSurface,
  sectionTitle,
} from "./portfolioStyles";

const stepIcons = [Compass, Layers, Code, Server, Rocket];

export default function PortfolioProcess() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  return (
    <section
      className={`${sectionSurface} bg-surface-alt/40`}
      id="process"
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      <div className={contentWidth}>
        {/* Section Heading */}
        <div className="reveal max-w-[650px]">
          <p className={eyebrow}>
            <span className="text-action">04</span> Engineering Methodology
          </p>
          <h2 className={sectionTitle} id="process-title">
            How ideas become <span className="italic font-normal text-action">reality.</span>
          </h2>
          <p className={sectionLede}>
            A structured, 5-phase engineering lifecycle ensuring reliability,
            scalable code architecture, and on-time execution.
          </p>
        </div>

        {/* 5-Step Progress Grid */}
        <div className="mt-14 relative">
          {/* Desktop Connecting Line behind cards */}
          <div
            className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 bg-border -z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => {
              const Icon = stepIcons[index] || Compass;
              return (
                <div
                  key={step.step}
                  className="reveal group relative flex flex-col justify-between rounded-lg border border-border bg-surface p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-action"
                >
                  <div>
                    {/* Top Step Badge with Icon */}
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <span className="grid size-11 place-items-center rounded-full border border-border bg-canvas text-action font-mono text-sm font-bold shadow-xs transition-colors group-hover:border-action group-hover:bg-action group-hover:text-canvas">
                        <Icon size={18} />
                      </span>
                      <span className="font-mono text-xs font-semibold text-secondary/70">
                        STEP {step.step}
                      </span>
                    </div>

                    {/* Step Title & Phase */}
                    <h3 className="font-serif text-lg font-bold text-primary group-hover:text-action transition-colors">
                      {step.phase}
                    </h3>
                    <p className="font-mono text-[10px] text-action uppercase tracking-wider mt-0.5">
                      {step.tagline}
                    </p>

                    {/* Narrative Description */}
                    <p className="mt-2.5 text-[12px] leading-relaxed text-secondary">
                      {step.description}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-secondary/80 mb-1.5">
                      Deliverables:
                    </span>
                    <ul className="space-y-1">
                      {step.deliverables.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-1.5 text-[10px] text-primary/80"
                        >
                          <Check size={11} className="text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
