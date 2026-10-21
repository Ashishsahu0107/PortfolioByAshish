import { createElement } from "react";
import TemplateModern from "./components/templates/TemplateModern";
import TemplateClassicATS from "./components/templates/TemplateClassicATS";
import TemplateExecutiveSidebar from "./components/templates/TemplateExecutiveSidebar";
import TemplateDeveloper from "./components/templates/TemplateDeveloper";
import TemplateEditorial from "./components/templates/TemplateEditorial";
import TemplateCompact from "./components/templates/TemplateCompact";

export const RESUME_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    tagline: "Modern Blue & Balanced",
    badge: "Recommended",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Vibrant blue accents, modern typography, badge skills, and clear timeline hierarchy.",
    accent: "#2563eb",
    Component: TemplateModern,
  },
  {
    id: "minimal",
    altId: "classic",
    name: "Minimal",
    tagline: "Ultra-Clean ATS Standard",
    badge: "ATS 99%",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Monochrome high-contrast serif/sans layout designed for zero ATS parsing errors.",
    accent: "#18181b",
    Component: TemplateClassicATS,
  },
  {
    id: "professional",
    altId: "executive",
    name: "Professional",
    tagline: "Executive Sidebar",
    badge: "Corporate",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description: "Navy blue left sidebar with quick contact & skill pills, structured experience right pane.",
    accent: "#1e3a8a",
    Component: TemplateExecutiveSidebar,
  },
  {
    id: "developer",
    name: "Developer",
    tagline: "Terminal & Code Centric",
    badge: "Tech Focus",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description: "Dark terminal header with git branch styling, monospace tech tags, and code accents.",
    accent: "#059669",
    Component: TemplateDeveloper,
  },
  {
    id: "elegant",
    altId: "editorial",
    name: "Elegant",
    tagline: "Editorial Warm Serif",
    badge: "Refined",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    description: "Editorial typography with warm cream tones, tailored for creative engineering portfolios.",
    accent: "#b45309",
    Component: TemplateEditorial,
  },
  {
    id: "compact",
    name: "Compact",
    tagline: "High-Density Single Page",
    badge: "1-Page Ready",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Dense 2-column layout engineered to fit maximum technical depth into minimal vertical space.",
    accent: "#7c3aed",
    Component: TemplateCompact,
  },
];

export function getTemplateById(id) {
  const found = RESUME_TEMPLATES.find(
    (t) => t.id === id || (t.altId && t.altId === id)
  );
  return found || RESUME_TEMPLATES[0];
}

export function renderResumeTemplate(templateId, data) {
  const template = getTemplateById(templateId);
  const TemplateComponent = template.Component;
  return createElement(TemplateComponent, { data });
}
