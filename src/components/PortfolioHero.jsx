import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Flag, GraduationCap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubIcon, LinkedinIcon } from "./icons";
import { developer } from "../data/developer";
import { techStack } from "../data/skills";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioHero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const intro = gsap.timeline();
        intro
          .to(".hero-portrait-image", {
            opacity: 0.68,
            duration: 0.12,
            repeat: 7,
            yoyo: true,
            ease: "steps(1)",
          })
          .fromTo(".hero-title", { autoAlpha: 0, x: -75 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" }, 2)
          .fromTo(".hero-stack", { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" }, 3)
          .fromTo(".hero-copy-detail", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09, ease: "power2.out" }, 4)
          .fromTo(".hero-course-card", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 4.6)
          .fromTo(".hero-actions", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }, 5)
          .fromTo(".hero-metrics, .hero-socials, .hero-scroll", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }, 5.55);
        gsap.to(".hero-portrait-frame", {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }, heroRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-copy-detail"><span className="status-dot" />Hello, I’m</p>
          <h1 className="hero-title" id="hero-title">{developer.firstName}<br /><span>{developer.lastName}</span></h1>
          <p className="hero-role hero-copy-detail">FULL STACK <span>DEVELOPER</span></p>
          <p className="hero-intro hero-copy-detail">I build modern, scalable web applications with clean code and thoughtful design. Turning ideas into digital products that feel effortless.</p>
          <div className="hero-actions">
            <a className="button button-lime" href="#projects">View my work <ArrowDownRight size={17} /></a>
            <a className="hero-outline-button" href="#contact">Contact me <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <figure className="hero-profile">
          <div className="hero-portrait-orbit" aria-hidden="true" />
          <div className="hero-portrait-frame">
            <img className="hero-portrait-image" src="https://github.com/Ashishsahu0107.png?size=640" alt="Ashish Sahu" width="640" height="640" fetchPriority="high" />
            <span className="hero-portrait-index">AS / 01</span>
          </div>
          <span className="hero-availability"><span className="status-dot" />Available for opportunities</span>
          <figcaption className="hero-photo-caption">{developer.name}<span>BUILDING IDEAS INTO REAL PRODUCTS</span></figcaption>
        </figure>
        <aside className="hero-stack" aria-label="Technology stack">
          <div className="hero-stack-heading"><span>Tech stack</span><a href="#skills">Explore my skills <ArrowUpRight size={12} /></a></div>
          <ul>{techStack.map((technology, index) => <li key={technology.name} style={{ "--stack-index": index }}><span className="hero-tech-mark" aria-hidden="true">{technology.name === "JavaScript" ? "JS" : technology.name.slice(0, 1)}</span><span>{technology.name}</span></li>)}</ul>
          <p className="hero-stack-foot">DESIGN · BUILD · DEPLOY</p>
        </aside>
        <div className="hero-lower">
          <div className="hero-metrics">
            {developer.stats.slice(0, 3).map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          </div>
          <div className="hero-course-card">
            <div className="hero-course-item"><span className="hero-course-icon"><GraduationCap size={19} /></span><div><strong>2022</strong><span>Course started</span><small>B.Tech · Computer Science</small></div></div>
            <span className="hero-course-track"><i /></span>
            <div className="hero-course-item"><span className="hero-course-icon"><Flag size={17} /></span><div><strong>2026</strong><span>Course completion</span><small>Ready for what’s next</small></div></div>
          </div>
        </div>
      </div>
      <div className="hero-bottom wrap"><div className="hero-socials" aria-label="Social links"><span>Find me on</span><a href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a><a href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a></div><a className="hero-scroll" href="#about"><ArrowDown size={14} /><span>Scroll down</span></a><span>© {new Date().getFullYear()} · {developer.location}</span></div>
    </section>
  );
}
