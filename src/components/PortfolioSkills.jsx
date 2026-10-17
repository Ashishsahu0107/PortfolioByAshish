import { useRef, useState } from "react";
import { skillCategories } from "../data/skills";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function PortfolioSkills() {
  const [activeTab, setActiveTab] = useState("frontend");
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, ".skills-heading, .skills-controls");
  const activeCategory = skillCategories.find((category) => category.id === activeTab);

  return (
    <section className="section skills-section" id="skills" ref={sectionRef} aria-labelledby="skills-title">
      <div className="wrap">
        <div className="skills-heading reveal"><p className="eyebrow"><span>02</span> Tools of the trade</p><h2 className="section-title" id="skills-title">A considered <span>toolkit.</span></h2><p className="section-lede">The right tools for building reliable, useful things.</p></div>
        <div className="skills-controls reveal" role="tablist" aria-label="Skill categories">
          {skillCategories.map((category) => <button className={`skill-tab${activeTab === category.id ? " is-active" : ""}`} key={category.id} role="tab" id={`tab-${category.id}`} aria-selected={activeTab === category.id} aria-controls="skills-panel" onClick={() => setActiveTab(category.id)}>{category.label}</button>)}
        </div>
        <div className="skills-list" id="skills-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} key={activeTab}>
          {activeCategory?.skills.map((skill, index) => (
            <div className="skill-row" key={skill.name} style={{ "--skill-delay": `${index * 45}ms` }}>
              <span className="skill-index">{String(index + 1).padStart(2, "0")}</span><div className="skill-name"><strong>{skill.name}</strong><span>{skill.description}</span></div><div className="skill-meter" aria-label={`${skill.level}% proficiency`}><span style={{ width: `${skill.level}%` }} /></div><span className="skill-level">{String(skill.level).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
