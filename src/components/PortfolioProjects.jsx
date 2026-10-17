import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { GithubIcon } from "./icons";
import { projects } from "../data/projects";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { contentWidth, eyebrow, sectionLede, sectionSurface, sectionTitle } from "./portfolioStyles";

function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const tilt = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    gsap.to(cardRef.current, { rotateY: (x - 0.5) * 5, rotateX: (0.5 - y) * 5, transformPerspective: 900, duration: 0.35, ease: "power2.out" });
  };
  const resetTilt = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });

  return (
    <article className="project-card reveal group min-w-0 overflow-hidden rounded-md border border-border bg-surface transition-[border-color,box-shadow] duration-300 hover:border-action hover:shadow-xl [transform-style:preserve-3d]" ref={cardRef} onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div className="relative grid h-[248px] place-items-center overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_50%_45%,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_48%)] bg-surface-alt max-sm:h-[215px]" aria-hidden="true">
        <div className="h-[72%] w-[65%] overflow-hidden border border-border bg-canvas/85 shadow-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.025]"><div className="flex h-[22px] items-center gap-1 border-b border-border px-2"><i className="size-1 rounded-full bg-secondary" /><i className="size-1 rounded-full bg-secondary/80" /><i className="size-1 rounded-full bg-secondary/60" /><span className="ml-auto font-mono text-[7px] text-secondary">{project.category} / {project.year}</span></div><div className="flex h-[calc(100%-22px)]"><div className="flex w-[21%] flex-col gap-[9px] border-r border-border p-2"><b className="mb-1 block h-[7px] w-[70%] bg-action/60" /><i className="block h-1 w-[85%] bg-secondary/20" /><i className="block h-1 w-[85%] bg-secondary/20" /><i className="block h-1 w-[58%] bg-secondary/20" /></div><div className="flex-1 p-3"><b className="mb-[9px] block h-[7px] w-[42%] bg-primary/60" /><span className="mb-[5px] block h-[3px] w-[86%] bg-secondary/20" /><span className="mb-[5px] block h-[3px] w-[61%] bg-secondary/20" /><div className="mt-3 flex h-[46%] items-end gap-[5px] border border-border px-[9px] pt-[7px]"><i className="h-[38%] flex-1 bg-action/60" /><i className="h-[64%] flex-1 bg-action/60" /><i className="h-[84%] flex-1 bg-action/60" /><i className="h-1/2 flex-1 bg-action/60" /><i className="h-[64%] flex-1 bg-action/60" /><i className="h-[38%] flex-1 bg-action/60" /><i className="h-[84%] flex-1 bg-action/60" /></div></div></div></div>
        <span className="absolute bottom-[9px] right-4 font-display text-[42px] text-secondary/30">{project.number}</span>
      </div>
      <div className="flex flex-1 flex-col p-[23px] pb-5 max-sm:p-[19px]">
        <div className="flex items-start justify-between gap-3"><div><p className={`${eyebrow} text-[8px]`}>{project.subtitle}</p><h3 className="mb-0 mt-1.5 font-display text-[21px] font-medium text-primary max-sm:text-[19px]">{project.title}</h3></div><span className="pt-0.5 font-mono text-[9px] text-secondary">{project.year}</span></div>
        <p className="mb-[14px] mt-3 min-h-[43px] text-[12px] leading-[1.7] text-secondary max-sm:min-h-0">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-1.5">{project.tags.slice(0, 4).map((tag) => <span className="border border-border px-2 py-[5px] font-mono text-[8px] text-secondary" key={tag}>{tag}</span>)}</div>
        <div className="mt-auto flex min-h-[44px] items-end gap-[18px] border-t border-border pt-2.5">{project.live !== "#" && <a className="inline-flex items-center gap-1.5 text-[10px] text-secondary no-underline transition-colors hover:text-action" href={project.live} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15} /></a>}<a className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-secondary no-underline transition-colors hover:text-action" href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><GithubIcon size={16} /><span>Source</span></a></div>
      </div>
    </article>
  );
}

export default function PortfolioProjects() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, ".projects-heading, .project-card");

  return (
    <section className={`${sectionSurface} bg-canvas`} id="projects" ref={sectionRef} aria-labelledby="projects-title">
      <div className={contentWidth}>
        <div className="projects-heading reveal"><p className={eyebrow}><span className="text-action">03</span> Selected work</p><div className="mt-5 flex items-end justify-between gap-[30px] max-sm:block"><h2 className={`${sectionTitle} max-w-[610px]`} id="projects-title">Things made <span className="text-action">with intent.</span></h2><p className={`${sectionLede} max-w-[300px] pb-2 max-sm:mt-3`}>A few experiments in turning complex problems into clear experiences.</p></div></div>
        <div className="mt-[47px] grid grid-cols-2 gap-[22px] [perspective:1300px] max-sm:mt-[30px] max-sm:grid-cols-1 max-sm:gap-[15px]">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </div>
    </section>
  );
}
