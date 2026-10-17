import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { GithubIcon } from "./icons";
import { projects } from "../data/projects";
import { useGsapReveal } from "../hooks/useGsapReveal";

function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const tilt = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    gsap.to(cardRef.current, { rotateY: (x - 0.5) * 5, rotateX: (0.5 - y) * 5, transformPerspective: 900, duration: 0.35, ease: "power2.out" });
    cardRef.current.style.setProperty("--pointer-x", `${x * 100}%`);
    cardRef.current.style.setProperty("--pointer-y", `${y * 100}%`);
  };
  const resetTilt = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });

  return (
    <article className="project-card reveal" ref={cardRef} onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div className="project-visual" aria-hidden="true">
        <div className="mock-window"><div className="mock-top"><i /><i /><i /><span>{project.category} / {project.year}</span></div><div className="mock-body"><div className="mock-side"><b /><i /><i /><i /></div><div className="mock-content"><b /><span /><span /><div className="mock-chart"><i /><i /><i /><i /><i /><i /><i /></div></div></div></div>
        <span className="project-number">{project.number}</span>
      </div>
      <div className="project-info">
        <div className="project-title-line"><div><p className="eyebrow">{project.subtitle}</p><h3>{project.title}</h3></div><span className="project-year">{project.year}</span></div>
        <p className="project-description">{project.shortDescription}</p>
        <div className="project-tags">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-links">{project.live !== "#" && <a href={project.live} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15} /></a>}<a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><GithubIcon size={16} /><span>Source</span></a></div>
      </div>
    </article>
  );
}

export default function PortfolioProjects() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, ".projects-heading, .project-card");

  return (
    <section className="section projects-section" id="projects" ref={sectionRef} aria-labelledby="projects-title">
      <div className="wrap">
        <div className="projects-heading reveal"><p className="eyebrow"><span>03</span> Selected work</p><div className="projects-title-row"><h2 className="section-title" id="projects-title">Things made <span>with intent.</span></h2><p className="section-lede">A few experiments in turning complex problems into clear experiences.</p></div></div>
        <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </div>
    </section>
  );
}
