import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Flag, GraduationCap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubIcon, LinkedinIcon } from "./icons";
import { developer } from "../data/developer";
import { techStack } from "../data/skills";
import { contentWidth, primaryButton, textLink } from "./portfolioStyles";
import heroPortrait from "../assets/hero.png";

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
            opacity: 0.62,
            duration: 0.14,
            repeat: 13,
            yoyo: true,
            ease: "steps(1)",
          })
          .fromTo(
            ".hero-title",
            { autoAlpha: 0, x: -80 },
            { autoAlpha: 1, x: 0, duration: 0.85, ease: "power3.out" },
            2
          )
          .fromTo(
            ".hero-stack",
            { autoAlpha: 0, x: 70 },
            { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
            3.1
          )
          .fromTo(
            ".hero-copy-detail",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09, ease: "power2.out" },
            4.1
          )
          .fromTo(
            ".hero-course-card",
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
            4.7
          )
          .fromTo(
            ".hero-actions",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
            5.3
          )
          .fromTo(
            ".hero-metrics, .hero-socials, .hero-scroll",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
            5.9
          );
        gsap.to(".hero-portrait-orbit", {
          scale: 1.035,
          opacity: 0.75,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".hero-scroll svg", {
          y: 3,
          duration: 0.75,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
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
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-canvas pb-7 pt-[94px] text-primary max-sm:pt-[91px]" id="home" ref={heroRef} aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_49%_46%,color-mix(in_srgb,var(--color-accent)_9%,transparent),transparent_34%)]" aria-hidden="true" />
      <div className={`${contentWidth} relative z-10 grid flex-1 grid-cols-[minmax(0,1fr)_minmax(260px,1.05fr)_minmax(220px,.88fr)] grid-rows-[1fr_auto] items-center gap-x-[clamp(22px,3vw,42px)] gap-y-7 py-[22px] pb-[15px] max-[1120px]:grid-cols-1 max-[1120px]:gap-7 max-[620px]:gap-[25px] max-[620px]:pt-[13px]`}>
        <div className="relative z-[2] max-w-[390px] max-[1120px]:max-w-[720px]">
          <p className="hero-copy-detail m-0 flex items-center gap-3 font-mono text-[11px] font-medium tracking-[.08em] text-secondary"><span className="size-[7px] shrink-0 rounded-full bg-action" />Hello, I'm</p>
          <h1 className="hero-title mb-3 mt-[22px] font-display text-[clamp(56px,6.5vw,88px)] font-semibold uppercase leading-[.94] text-primary max-[620px]:mb-[9px] max-[620px]:mt-[14px] max-[620px]:text-[clamp(53px,14vw,76px)]" id="hero-title">{developer.firstName}<br /><span className="text-action">{developer.lastName}</span></h1>
          <p className="hero-role hero-copy-detail mb-[13px] mt-0 font-mono text-[11px] font-bold tracking-[.18em] text-primary">FULL STACK <span className="text-action">DEVELOPER</span></p>
          <p className="hero-copy-detail m-0 max-w-[390px] text-[13px] leading-[1.7] text-secondary max-[620px]:max-w-full">I build modern, scalable web applications with clean code and thoughtful design. Turning ideas into digital products that feel effortless.</p>
          <div className="hero-actions mt-[23px] flex flex-wrap items-center gap-[14px]">
            <a className={primaryButton} href="#projects">View my work <ArrowDownRight size={17} /></a>
            <a className={`${textLink} min-h-10 rounded-full border border-action px-4 transition-transform hover:-translate-y-0.5 hover:bg-action-hover hover:text-canvas`} href="#contact">Contact me <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <figure className="hero-profile relative isolate m-0 w-full max-w-[390px] justify-self-center max-[1120px]:w-full max-[1120px]:max-w-[360px] max-[620px]:w-[min(68vw,270px)]">
          <div className="hero-portrait-orbit pointer-events-none absolute -inset-[2%] -z-10 rounded-full border border-action shadow-[0_0_22px_color-mix(in_srgb,var(--color-accent)_58%,transparent),0_0_82px_color-mix(in_srgb,var(--color-accent)_24%,transparent)]" aria-hidden="true" />
          <div className="hero-portrait-frame relative aspect-square w-full overflow-hidden rounded-full border border-action bg-surface shadow-[0_0_0_8px_color-mix(in_srgb,var(--color-accent)_7%,transparent)]">
            <img
              className="hero-portrait-image block size-full object-cover object-[center_34%]"
              src={heroPortrait}
              alt="Ashish Sahu"
              width="640"
              height="640"
              fetchPriority="high"
            />
            <span className="absolute right-[18px] top-[15px] border border-border bg-canvas/80 px-2 py-1.5 font-mono text-[9px] text-primary">AS / 01</span>
          </div>
          <span className="absolute -right-[7%] bottom-[17%] inline-flex items-center gap-2 border border-border bg-surface px-[13px] py-[11px] text-[10px] text-primary shadow-lg max-[620px]:-right-[20%] max-[620px]:px-[9px] max-[620px]:py-2 max-[620px]:text-[8px]"><span className="size-1.5 shrink-0 rounded-full bg-action" />Available for opportunities</span>
          <figcaption className="flex flex-col items-center justify-center gap-1 pt-[15px] text-center font-mono text-[8px] tracking-[.13em] text-primary">{developer.name}<span className="text-[7px] text-secondary">BUILDING IDEAS INTO REAL PRODUCTS</span></figcaption>
        </figure>
        <aside className="hero-stack min-w-0 self-center max-[1120px]:w-full" aria-label="Technology stack">
          <div className="mb-[18px] flex items-center justify-between gap-2 font-sans text-[10px] font-semibold tracking-[.13em] text-primary"><span>Tech stack</span><a className="inline-flex items-center gap-1 font-mono text-[8px] tracking-normal text-secondary no-underline hover:text-action-hover" href="#skills">Explore my skills <ArrowUpRight size={12} /></a></div>
          <ul className="m-0 grid list-none grid-cols-4 gap-[10px] max-[1120px]:grid-cols-4 max-sm:gap-[7px]">
            {techStack.map((technology) => <li className="flex min-h-[83px] min-w-0 flex-col items-center justify-center gap-[7px] border border-border bg-surface px-[5px] py-2 text-center font-sans text-[8px] text-secondary transition-[transform,border-color,color] duration-200 hover:-translate-y-[3px] hover:border-action hover:text-primary max-[1120px]:min-h-[72px] max-sm:min-h-[65px] max-sm:gap-[5px] max-sm:px-[3px] max-sm:py-[7px] max-sm:text-[7px]" key={technology.name}><span className="grid size-[30px] place-items-center rounded-lg border border-action/50 font-display text-[11px] font-bold text-action-hover max-sm:size-[26px] max-sm:text-[10px]" aria-hidden="true">{technology.name === "JavaScript" ? "JS" : technology.name.slice(0, 1)}</span><span>{technology.name}</span></li>)}
          </ul>
          <p className="mt-[13px] font-mono text-[7px] leading-[1.7] tracking-[.06em] text-secondary">DESIGN · BUILD · DEPLOY</p>
        </aside>
        <div className="col-span-full grid grid-cols-[minmax(210px,.8fr)_minmax(0,1.5fr)] items-center gap-[clamp(18px,4vw,55px)] mt-[3px] max-[1120px]:grid-cols-[minmax(160px,.7fr)_minmax(0,1.3fr)] max-sm:grid-cols-1 max-sm:gap-[15px]">
          <div className="hero-metrics grid grid-cols-3">
            {developer.stats.slice(0, 3).map((stat, index) => <div className={`flex min-w-0 flex-col gap-1 border-r border-border px-3 py-[5px] first:pl-0 last:border-r-0 ${index === 2 ? "max-sm:border-r-0" : ""}`} key={stat.label}><strong className="font-display text-2xl font-semibold text-action">{stat.value}</strong><span className="text-[8px] leading-[1.4] text-secondary">{stat.label}</span></div>)}
          </div>
          <div className="hero-course-card grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(35px,.55fr)_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border bg-surface px-[18px] py-[15px] max-sm:gap-[7px] max-sm:px-[10px] max-sm:py-3">
            <div className="flex min-w-0 items-center gap-[10px] max-sm:gap-[6px]"><span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-action/10 text-action max-sm:size-7"><GraduationCap size={19} /></span><div className="flex min-w-0 flex-col gap-0.5"><strong className="font-display text-[19px] font-semibold text-action-hover max-sm:text-[17px]">2022</strong><span className="text-[9px] text-primary max-sm:text-[7px]">Course started</span><small className="text-[8px] text-secondary max-sm:text-[7px]">B.Tech · Computer Science</small></div></div>
            <span className="relative h-px bg-border before:absolute before:left-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-action after:absolute after:right-0 after:top-1/2 after:size-1.5 after:-translate-y-1/2 after:rounded-full after:bg-action"><i className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action shadow-[0_0_10px_var(--color-accent)]" /></span>
            <div className="flex min-w-0 items-center gap-[10px] max-sm:gap-[6px]"><span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-action/10 text-action max-sm:size-7"><Flag size={17} /></span><div className="flex min-w-0 flex-col gap-0.5"><strong className="font-display text-[19px] font-semibold text-action-hover max-sm:text-[17px]">2026</strong><span className="text-[9px] text-primary max-sm:text-[7px]">Course completion</span><small className="text-[8px] text-secondary max-sm:text-[7px]">Ready for what&apos;s next</small></div></div>
          </div>
        </div>
      </div>
      <div className={`${contentWidth} flex items-center justify-between border-t border-border pt-[14px]`}><div className="hero-socials m-0 flex items-center gap-[15px]" aria-label="Social links"><span className="mr-1 font-mono text-[8px] uppercase text-secondary">Find me on</span><a className="inline-flex text-secondary transition-colors hover:text-action" href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a><a className="inline-flex text-secondary transition-colors hover:text-action" href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a></div><a className="hero-scroll inline-flex items-center gap-[7px] font-mono text-[8px] uppercase text-secondary no-underline" href="#about"><ArrowDown className="text-action" size={14} /><span>Scroll down</span></a><span className="font-mono text-[8px] text-secondary max-sm:hidden">© {new Date().getFullYear()} · {developer.location}</span></div>
    </section>
  );
}
