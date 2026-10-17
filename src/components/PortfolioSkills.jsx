import { useRef, useState } from "react";
import { skillCategories } from "../data/skills";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { contentWidth, eyebrow, sectionLede, sectionSurface, sectionTitle } from "./portfolioStyles";

export default function PortfolioSkills() {
  const [activeTab, setActiveTab] = useState("frontend");
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, ".skills-heading, .skills-controls, .skills-list .skill-row");
  const activeCategory = skillCategories.find((category) => category.id === activeTab);

  return (
    <section className={`${sectionSurface} bg-surface-alt`} id="skills" ref={sectionRef} aria-labelledby="skills-title">
      <div className={contentWidth}>
        <div className="skills-heading reveal max-w-[630px]"><p className={eyebrow}><span className="text-action">02</span> Tools of the trade</p><h2 className={sectionTitle} id="skills-title">A considered <span className="text-action">toolkit.</span></h2><p className={sectionLede}>The right tools for building reliable, useful things.</p></div>
        <div className="skills-controls reveal mb-[17px] mt-[42px] flex flex-wrap gap-[7px] max-[620px]:mt-[30px] max-[620px]:gap-[6px]" role="tablist" aria-label="Skill categories">
          {skillCategories.map((category) => <button className={`min-h-9 rounded-sm border px-[14px] font-mono text-[10px] text-secondary transition-colors duration-200 max-[620px]:min-h-[33px] max-[620px]:px-[10px] max-[620px]:text-[9px] ${activeTab === category.id ? "border-action bg-action/10 text-action-hover" : "border-border bg-transparent hover:border-action hover:bg-action/10 hover:text-action-hover"}`} key={category.id} role="tab" id={`tab-${category.id}`} aria-selected={activeTab === category.id} aria-controls="skills-panel" onClick={() => setActiveTab(category.id)}>{category.label}</button>)}
        </div>
        <div className="skills-list border-t border-border" id="skills-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} key={activeTab}>
          {activeCategory?.skills.map((skill, index) => (
            <div className="skill-row reveal grid min-h-[70px] grid-cols-[50px_minmax(160px,1fr)_minmax(100px,.62fr)_38px] items-center gap-[17px] border-b border-border max-[620px]:min-h-[65px] max-[620px]:grid-cols-[25px_minmax(0,1fr)_38px] max-[620px]:gap-[9px]" key={skill.name}>
              <span className="font-mono text-[10px] text-secondary/80">{String(index + 1).padStart(2, "0")}</span><div className="flex items-baseline gap-[13px] max-[620px]:flex-col max-[620px]:gap-1"><strong className="text-[13px] font-medium text-primary max-[620px]:text-[12px]">{skill.name}</strong><span className="text-[11px] text-secondary max-[620px]:text-[9px]">{skill.description}</span></div><div className="h-0.5 bg-border max-[620px]:hidden" role="meter" aria-label={`${skill.name} proficiency`} aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}><span className="block h-full bg-action" style={{ width: `${skill.level}%` }} /></div><span className="text-right font-mono text-[10px] text-secondary">{String(skill.level).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
