import { useEffect, useMemo } from "react";
import {
  X,
  Code2,
  Server,
  Database,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";
import TechIcon from "./TechIcon";

const categoryIconMap = {
  frontend: Code2,
  backend: Server,
  database: Database,
  tools: Terminal,
  other: Cpu,
};

export default function AllSkillsModal({ isOpen, onClose, categories = [] }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Flattened total count
  const totalSkillsCount = useMemo(() => {
    return categories.reduce(
      (sum, cat) => sum + (Array.isArray(cat.skills) ? cat.skills.length : 0),
      0,
    );
  }, [categories]);

  // Filter categories with active skills
  const validCategories = useMemo(() => {
    return categories.filter(
      (cat) => Array.isArray(cat.skills) && cat.skills.length > 0,
    );
  }, [categories]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[950] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-skills-title"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-border bg-canvas shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-border p-4 sm:p-6 bg-surface/40">
          <div>
            <h2
              className="text-lg sm:text-2xl font-bold text-primary"
              id="all-skills-title"
            >
              All Skills &amp; Technologies
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-secondary">
              Comprehensive breakdown of all frontend, backend, database, and
              devops competencies ({totalSkillsCount} total).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 sm:size-9 place-items-center rounded-full border border-border bg-surface text-secondary transition-all hover:border-action hover:text-action hover:scale-105 cursor-pointer shrink-0 ml-3"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Body (Directly Displaying All Skills) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-7">
          {validCategories.map((category) => {
            const IconComp = categoryIconMap[category.id] || Layers;
            const categorySkills = category.skills || [];

            return (
              <div key={category.id} className="space-y-3">
                {/* Category Title Header */}
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-md border border-border bg-surface text-action">
                      <IconComp size={13} />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">
                      {category.label || category.name || category.id}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-secondary">
                    {categorySkills.length}{" "}
                    {categorySkills.length === 1
                      ? "technology"
                      : "technologies"}
                  </span>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {categorySkills.map((skill, idx) => (
                    <div
                      key={`${category.id}-${skill.name}-${idx}`}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-surface/70 p-3 transition-all duration-200 hover:border-action hover:bg-surface-alt hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      {/* Official Tech Icon */}
                      <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-canvas transition-transform duration-200 group-hover:scale-105">
                        <TechIcon
                          name={skill.name}
                          iconKey={skill.icon}
                          size={20}
                        />
                      </div>

                      {/* Skill Name & Detail */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-primary truncate transition-colors group-hover:text-action">
                          {skill.name}
                        </h4>
                        <p className="text-[11px] text-secondary/80 truncate">
                          {skill.description || category.label || "Technology"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6 bg-surface/30">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <CheckCircle2 size={14} className="text-action" />
            <span>Dynamic MongoDB live synchronization</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:border-action hover:text-action transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
