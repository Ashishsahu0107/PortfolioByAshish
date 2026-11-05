import { useState, useEffect, useCallback } from "react";
import PortfolioHero from "../components/PortfolioHero";
import PortfolioAbout from "../components/PortfolioAbout";
import PortfolioSkills from "../components/PortfolioSkills";
import PortfolioProjects from "../components/PortfolioProjects";
import PortfolioProcess from "../components/PortfolioProcess";
import PortfolioExperience from "../components/PortfolioExperience";
import PortfolioContact from "../components/PortfolioContact";
import PortfolioFooter from "../components/PortfolioFooter";
import { sectionsApi } from "../services/api";
import { contentWidth, sectionSurface, eyebrow, sectionLede } from "../components/portfolioStyles";
import { usePortfolioSync } from "../hooks/usePortfolioSync";
import { usePortfolioSections } from "../context/PortfolioDataContext";

// Built-in section component mapping
const SECTION_COMPONENTS = {
  hero: PortfolioHero,
  home: PortfolioHero,
  about: PortfolioAbout,
  skills: PortfolioSkills,
  projects: PortfolioProjects,
  process: PortfolioProcess,
  experience: PortfolioExperience,
  contact: PortfolioContact,
};

// Generic custom section renderer for dynamic user-created sections
function DynamicCustomSection({ section }) {
  const content = section.content || {};
  return (
    <section id={section.slug} className={`${sectionSurface} border-t border-border`}>
      <div className={contentWidth}>
        <p className={eyebrow}>
          <span className="text-action font-mono">0{section.order || 8}</span> {section.name}
        </p>
        <h2 className="mb-4 mt-6 font-serif text-[clamp(36px,4.5vw,56px)] font-bold text-primary">
          {content.heading || section.name}
        </h2>
        {content.subheading && (
          <p className={`${sectionLede} max-w-2xl mb-6`}>{content.subheading}</p>
        )}
        {content.body && (
          <div className="prose prose-zinc dark:prose-invert max-w-3xl text-sm leading-relaxed text-secondary whitespace-pre-wrap">
            {content.body}
          </div>
        )}
        {content.formSlug && (
          <div className="mt-8 max-w-2xl">
            <iframe
              src={`/form/${content.formSlug}?embed=true`}
              title={section.name}
              className="w-full min-h-[520px] rounded-xl border border-border bg-surface"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { sections, refreshSections } = usePortfolioSections();

  // Real-time synchronization whenever sections are enabled, disabled, reordered, or added in Admin
  usePortfolioSync(refreshSections, "sections");

  if (!sections || sections.length === 0) {
    return (
      <main id="main-content" className="min-h-screen bg-canvas flex items-center justify-center p-8">
        <div className="text-center max-w-md p-8 rounded-xl border border-border bg-surface">
          <h2 className="text-lg font-bold text-primary mb-2">No Active Sections Found</h2>
          <p className="text-sm text-secondary">
            Sections have not been enabled yet in the database. Enable or create sections in the Admin Dashboard to display them.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {sections.map((section) => {
        if (!section.enabled) return null;

        // Check if matching built-in component exists
        const BuiltinComp =
          SECTION_COMPONENTS[section.id] ||
          SECTION_COMPONENTS[section.slug?.toLowerCase()];

        if (BuiltinComp) {
          return <BuiltinComp key={section.id} />;
        }

        // Otherwise render dynamic custom section
        return <DynamicCustomSection key={section.id} section={section} />;
      })}
      <PortfolioFooter />
    </main>
  );
}
