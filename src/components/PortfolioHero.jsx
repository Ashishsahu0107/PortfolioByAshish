import { useLayoutEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
            opacity: 0.9,
            duration: 0.1,
            repeat: 9,
            yoyo: true,
            ease: "steps(1)",
          })
          .fromTo(
            ".hero-title",
            { autoAlpha: 0, x: -70 },
            { autoAlpha: 1, x: 0, duration: 0.85, ease: "power3.out" },
            2,
          )
          .fromTo(
            ".hero-copy-detail",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power2.out" },
            2.35,
          )
          .fromTo(
            ".hero-stack",
            { autoAlpha: 0, x: 55 },
            { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
            2.05,
          )
          .fromTo(
            ".hero-photo-caption",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
            2.1,
          );
        gsap.to(".hero-portrait-frame", {
          yPercent: -4,
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
          <p className="eyebrow hero-copy-detail"><span className="status-dot" />Available for select projects</p>
          <h1 className="hero-title" id="hero-title">{developer.firstName}<br /><span>{developer.lastName}</span></h1>
          <p className="hero-role hero-copy-detail">{developer.role}<span> / </span>{developer.roleSecondary}</p>
          <p className="hero-intro hero-copy-detail">{developer.tagline} I focus on clean engineering, thoughtful interfaces, and products that solve real problems.</p>
          <div className="hero-facts hero-copy-detail">
            <div><span>Course</span><strong>B.Tech · Computer Science</strong></div>
            <div><span>Years</span><strong>2022 — 2026</strong></div>
            <div><span>Based in</span><strong>{developer.location} · Remote</strong></div>
          </div>
          <div className="hero-actions hero-copy-detail">
            <a className="button button-lime" href="#projects">Explore my work <ArrowDownRight size={17} /></a>
            <a className="text-link" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
          </div>
          <div className="hero-socials hero-copy-detail" aria-label="Social links">
            <span>Find me elsewhere</span>
            <a href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a>
            <a href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a>
          </div>
        </div>
        <div className="hero-stage">
          <figure className="hero-profile">
            <div className="hero-portrait-frame">
              <img
                className="hero-portrait-image"
                src="https://github.com/Ashishsahu0107.png?size=640"
                alt="Ashish Sahu"
                width="640"
                height="640"
                fetchPriority="high"
              />
              <span className="hero-portrait-index">AS / 01</span>
            </div>
            <figcaption className="hero-photo-caption"><span>ASHISH SAHU</span><span>FULL STACK · INDIA</span></figcaption>
          </figure>
          <aside className="hero-stack" aria-label="Technology stack">
            <p className="hero-stack-heading">CURRENT STACK</p>
            <ul>{techStack.map((technology, index) => <li key={technology.name} style={{ "--stack-index": index }}>{technology.name}</li>)}</ul>
            <p className="hero-stack-foot">BUILD / SHIP / REPEAT</p>
          </aside>
        </div>
      </div>
      <div className="hero-bottom wrap"><span>Independent developer · India</span><a href="#about">Scroll to explore <span>↓</span></a><span>© {new Date().getFullYear()}</span></div>
    </section>
  );
}
