import { useRef, useState, useEffect, useCallback } from "react";
import { Check, Compass, Layers, Code, Server, Rocket } from "lucide-react";
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

export default function PortfolioProcess() {
  const [steps, setSteps] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      console.warn("[PortfolioProcess] Could not load process section:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProcessSection();
  }, [loadProcessSection]);

  // Real-time synchronization whenever sections are modified in Admin
  usePortfolioSync(loadProcessSection, "sections");

  const headingText = sectionData?.content?.heading || "How ideas become software.";
  const subheadingText = sectionData?.content?.subheading || "A systematic approach that balances high-speed iteration with architectural rigor.";

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
            <span className="text-action">04</span> {sectionData?.name || "Engineering Process"}
          </p>
          <h2 className={sectionTitle} id="process-title">
            {headingText}
          </h2>
          <p className={sectionLede}>
            {subheadingText}
          </p>
        </div>

        {/* Loading State */}
        {loading && steps.length === 0 && (
          <div className="mt-12 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 animate-pulse rounded-lg border border-border bg-surface" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && steps.length === 0 && (
          <div className="reveal mt-12 rounded-lg border border-border bg-surface p-12 text-center max-w-lg mx-auto">
            <Rocket size={36} className="mx-auto text-secondary/50 mb-3" />
            <h3 className="text-base font-semibold text-primary mb-1">No Process Steps</h3>
            <p className="text-sm text-secondary">
              Configure your engineering process steps in the Admin Dashboard to display them here.
            </p>
          </div>
        )}

        {/* Process Steps Roadmap */}
        {steps.length > 0 && (
          <div className="mt-12 space-y-6">
            {steps.map((item, index) => {
              const StepIcon = stepIcons[index % stepIcons.length] || Compass;
              return (
                <div
                  key={item.step || index}
                  className="reveal group relative rounded-lg border border-border bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-action/60 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left: Step counter & Phase Info */}
                    <div className="flex items-start gap-5">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-2xl font-bold text-action sm:text-3xl">
                          {item.step || String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-2 grid size-9 place-items-center rounded-sm border border-border bg-canvas text-secondary group-hover:border-action group-hover:text-action transition-colors">
                          <StepIcon size={17} />
                        </span>
                      </div>

                      <div className="max-w-[480px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-action">
                            Phase {item.step || String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-secondary/50" />
                          <h3 className="font-serif text-xl font-bold text-primary sm:text-2xl">
                            {item.phase}
                          </h3>
                        </div>

                        {item.tagline && (
                          <p className="mt-0.5 font-mono text-xs font-medium text-primary/80">
                            {item.tagline}
                          </p>
                        )}

                        <p className="mt-3 text-[13px] leading-relaxed text-secondary sm:text-[14px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Concrete Deliverables Checklist */}
                    {Array.isArray(item.deliverables) && item.deliverables.length > 0 && (
                      <div className="w-full lg:max-w-[340px] rounded-md border border-border/70 bg-canvas/60 p-4 shrink-0">
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-secondary/80 mb-2.5">
                          Key Deliverables
                        </span>
                        <ul className="space-y-1.5 font-mono text-[11px] text-primary">
                          {item.deliverables.map((deliv, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <Check
                                size={13}
                                className="mt-0.5 shrink-0 text-action"
                              />
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
