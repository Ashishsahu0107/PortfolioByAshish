import { useState, useEffect } from "react";
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
      </div>
    </section>
  );
}

export default function Home() {
  const [sections, setSections] = useState([
    { id: "hero", slug: "home", type: "builtin", enabled: true, order: 1 },
    { id: "about", slug: "about", type: "builtin", enabled: true, order: 2 },
    { id: "skills", slug: "skills", type: "builtin", enabled: true, order: 3 },
    { id: "projects", slug: "projects", type: "builtin", enabled: true, order: 4 },
    { id: "process", slug: "process", type: "builtin", enabled: true, order: 5 },
    { id: "experience", slug: "experience", type: "builtin", enabled: true, order: 6 },
    { id: "contact", slug: "contact", type: "builtin", enabled: true, order: 7 },
  ]);

  useEffect(() => {
    async function loadDynamicSections() {
      try {
        const liveSections = await sectionsApi.getAll(false); // only enabled sections
        if (Array.isArray(liveSections) && liveSections.length > 0) {
          setSections(liveSections);
        }
      } catch (err) {
        console.warn("Using default section layout:", err.message);
      }
    }
    loadDynamicSections();
  }, []);

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
