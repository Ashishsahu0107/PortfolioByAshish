import { useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { GithubIcon, LinkedinIcon } from "./icons";
import { developer } from "../data/developer";

export default function PortfolioHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(".hero-enter", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out", delay: 0.15 });
        gsap.fromTo(".hero-console", { autoAlpha: 0, scale: 0.96, y: 18 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 });
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
          <p className="eyebrow hero-enter"><span className="status-dot" />Available for select projects</p>
          <h1 className="hero-title hero-enter" id="hero-title">Engineering<br /><span>what's next.</span></h1>
          <p className="hero-intro hero-enter">I’m <strong>{developer.name}</strong>, a full stack developer building thoughtful digital products from first sketch to final deployment.</p>
          <div className="hero-actions hero-enter">
            <a className="button button-lime" href="#projects">Explore my work <ArrowDownRight size={17} /></a>
            <a className="text-link" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
          </div>
          <div className="hero-socials hero-enter" aria-label="Social links">
            <span>Find me elsewhere</span>
            <a href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a>
            <a href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a>
          </div>
        </div>
        <div className="hero-console" aria-label="Code preview">
          <div className="console-top"><div className="window-dots"><i /><i /><i /></div><span>ashish / portfolio.ts</span><span className="console-live">LIVE</span></div>
          <div className="code-lines" aria-hidden="true">
            <p><span className="code-number">01</span><span className="code-key">const</span> developer = <span className="code-brace">&#123;</span></p>
            <p><span className="code-number">02</span>&nbsp;&nbsp;name: <span className="code-string">"Ashish Sahu"</span>,</p>
            <p><span className="code-number">03</span>&nbsp;&nbsp;role: <span className="code-string">"Full Stack Developer"</span>,</p>
            <p><span className="code-number">04</span>&nbsp;&nbsp;craft: <span className="code-string">"Digital products"</span>,</p>
            <p><span className="code-number">05</span>&nbsp;&nbsp;stack: <span className="code-brace">[</span></p>
            <p><span className="code-number">06</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">"React"</span>, <span className="code-string">"Node.js"</span>,</p>
            <p><span className="code-number">07</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">"MongoDB"</span>, <span className="code-string">"Express"</span></p>
            <p><span className="code-number">08</span>&nbsp;&nbsp;<span className="code-brace">]</span>,</p>
            <p><span className="code-number">09</span>&nbsp;&nbsp;available: <span className="code-bool">true</span></p>
            <p><span className="code-number">10</span><span className="code-brace">&#125;</span><span className="code-cursor" /></p>
          </div>
          <div className="console-foot"><span><span className="status-dot" />SYSTEMS OPERATIONAL</span><span>22° 34' N&nbsp; / &nbsp;INDIA</span></div>
          <span className="console-index">01 / 04</span>
        </div>
      </div>
      <div className="hero-bottom wrap"><span>Independent developer · India</span><a href="#about">Scroll to explore <span>↓</span></a><span>© {new Date().getFullYear()}</span></div>
    </section>
  );
}
