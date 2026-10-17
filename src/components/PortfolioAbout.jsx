import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { developer } from "../data/developer";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function PortfolioAbout() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  return (
    <section className="section about-section" id="about" ref={sectionRef} aria-labelledby="about-title">
      <div className="wrap">
        <div className="section-heading reveal"><p className="eyebrow"><span>01</span> A little about me</p></div>
        <div className="about-grid">
          <h2 className="about-statement reveal" id="about-title">Good software should feel <span>inevitable.</span></h2>
          <div className="about-copy reveal">
            <p>{developer.bio}</p>
            <p className="about-note">I care about the details users notice, and the engineering they never have to.</p>
            <a className="text-link" href={developer.github} target="_blank" rel="noreferrer">More about my work <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className="stats-row reveal">
          {developer.stats.slice(0, 3).map((stat) => <div className="stat-item" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          <div className="stat-item stat-location"><strong>{developer.location}</strong><span>Based · Available worldwide</span></div>
        </div>
      </div>
    </section>
  );
}
