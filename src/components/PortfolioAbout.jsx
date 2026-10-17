import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { developer } from "../data/developer";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { contentWidth, eyebrow, sectionSurface, textLink } from "./portfolioStyles";

export default function PortfolioAbout() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  return (
    <section className={`${sectionSurface} bg-canvas`} id="about" ref={sectionRef} aria-labelledby="about-title">
      <div className={contentWidth}>
        <div className="reveal mb-[35px]"><p className={eyebrow}><span className="text-action">01</span> A little about me</p></div>
        <div className="grid items-start gap-[12%] lg:grid-cols-[1.25fr_.75fr] max-lg:grid-cols-1 max-lg:gap-[30px]">
          <h2 className="reveal m-0 max-w-[670px] font-display text-[clamp(38px,5.1vw,68px)] font-medium leading-[1.08] text-primary" id="about-title">Good software should feel <span className="text-action">inevitable.</span></h2>
          <div className="reveal pt-1 text-[15px] leading-[1.9] text-secondary max-lg:max-w-[540px] max-[620px]:text-[14px]">
            <p className="mb-[18px]">{developer.bio}</p>
            <p className="mb-[18px] text-[14px] text-primary">I care about the details users notice, and the engineering they never have to.</p>
            <a className={`${textLink} mt-[13px]`} href={developer.github} target="_blank" rel="noreferrer">More about my work <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className="reveal mt-[84px] grid grid-cols-4 border-y border-border max-[900px]:mt-[55px] max-[620px]:mt-[42px] max-[620px]:grid-cols-2">
          {developer.stats.slice(0, 3).map((stat, index) => <div className={`flex min-h-[104px] flex-col justify-center gap-2 border-r border-border px-6 py-3 max-[900px]:px-4 max-[620px]:min-h-[84px] max-[620px]:border-b max-[620px]:px-[13px] ${index === 1 ? "max-[620px]:border-r-0" : ""} ${index === 2 ? "max-[620px]:border-b-0" : ""} ${index === 0 ? "pl-0 max-[620px]:pl-[13px]" : ""}`} key={stat.label}><strong className="font-display text-[25px] font-medium leading-none text-primary max-[620px]:text-[21px]">{stat.value}</strong><span className="font-mono text-[9px] uppercase text-secondary max-[620px]:text-[8px]">{stat.label}</span></div>)}
          <div className="flex min-h-[104px] flex-col justify-center gap-2 px-6 py-3 max-[900px]:px-4 max-[620px]:min-h-[84px] max-[620px]:border-b-0 max-[620px]:px-[13px]"><strong className="font-display text-[25px] font-medium leading-none text-primary max-[620px]:text-[21px]">{developer.location}</strong><span className="font-mono text-[9px] uppercase text-secondary max-[620px]:text-[8px]">Based · Available worldwide</span></div>
        </div>
      </div>
    </section>
  );
}
