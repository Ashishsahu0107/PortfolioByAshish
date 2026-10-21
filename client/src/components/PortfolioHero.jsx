import { useLayoutEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  Download,
  Flag,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";
import { developer as initialDeveloper } from "../data/developer";
import { techStack } from "../data/skills";
import { contentWidth, primaryButton, outlineButton } from "./portfolioStyles";
import heroPortrait from "../assets/hero.png";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";
import { developerApi } from "../services/api";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioHero() {
  const [developer, setDeveloper] = useState(initialDeveloper);
  const heroRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const { openResumeModal } = useResumeModal();

  useEffect(() => {
    async function loadDeveloper() {
      try {
        const live = await developerApi.get();
        if (live) setDeveloper((prev) => ({ ...prev, ...live }));
      } catch {
        // Fallback loaded
      }
    }
    loadDeveloper();
  }, []);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .fromTo(
            ".hero-status-pill",
            { autoAlpha: 0, y: -16 },
            { autoAlpha: 1, y: 0, duration: 0.6 }
          )
          .fromTo(
            ".hero-title-first",
            { autoAlpha: 0, x: -40 },
            { autoAlpha: 1, x: 0, duration: 0.7 },
            "-=0.4"
          )
          .fromTo(
            ".hero-title-last",
            { autoAlpha: 0, x: 40 },
            { autoAlpha: 1, x: 0, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".hero-role-bar",
            { autoAlpha: 0, y: 15 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.4"
          )
          .fromTo(
            ".hero-bio-copy",
            { autoAlpha: 0, y: 15 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.3"
          )
          .fromTo(
            ".hero-actions",
            { autoAlpha: 0, y: 15 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.3"
          )
          .fromTo(
            ".hero-profile-container",
            { autoAlpha: 0, scale: 0.92 },
            { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
            "-=0.6"
          )
          .fromTo(
            ".hero-floating-code",
            { autoAlpha: 0, y: 25, rotate: 2 },
            { autoAlpha: 1, y: 0, rotate: 0, duration: 0.6 },
            "-=0.4"
          )
          .fromTo(
            ".hero-stack-item",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.4 },
            "-=0.4"
          )
          .fromTo(
            ".hero-metrics-bar",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.3"
          );

        // Ambient continuous orbital breathing
        gsap.to(".hero-portrait-orbit", {
          scale: 1.04,
          opacity: 0.85,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Continuous subtle float for developer code card
        gsap.to(".hero-floating-code", {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Scroll prompt arrow bounce
        gsap.to(".hero-scroll-icon", {
          y: 4,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Subtle parallax on scroll
        gsap.to(".hero-profile-container", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }, heroRef);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-canvas pb-6 pt-[92px] text-primary"
      id="home"
      ref={heroRef}
      aria-labelledby="hero-title"
    >
      {/* Engineering Blueprint Background Grid & Ambient Glows */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-48 top-20 -z-10 size-[420px] rounded-full bg-action/10 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-20 -z-10 size-[380px] rounded-full bg-action/8 blur-[90px]"
        aria-hidden="true"
      />

      {/* Main Hero Container */}
      <div
        className={`${contentWidth} relative z-10 grid flex-1 grid-cols-1 items-center gap-10 py-6 lg:grid-cols-[1.1fr_0.95fr] lg:gap-14 xl:grid-cols-[1.15fr_0.95fr]`}
      >
        {/* Left Column: Editorial Identity & Story */}
        <div className="flex flex-col justify-center">
          {/* Status Pill */}
          <div className="hero-status-pill mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] font-medium tracking-wide text-secondary shadow-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {developer.statusPhrase}
            </span>
            <span className="font-mono text-[10px] text-secondary">
              · Batch {developer.graduatingYear}
            </span>
          </div>

          {/* Split Editorial Typography */}
          <h1
            className="mb-3 font-serif text-[clamp(52px,7.5vw,94px)] font-bold tracking-tight text-primary leading-[0.94]"
            id="hero-title"
          >
            <span className="hero-title-first block">{developer.firstName}</span>
            <span className="hero-title-last block italic font-normal text-action">
              {developer.lastName}
            </span>
          </h1>

          {/* Monospaced Subheading Bar */}
          <div className="hero-role-bar mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold tracking-[0.16em] uppercase text-primary">
            <span>FULL STACK DEVELOPER</span>
            <span className="h-px w-12 bg-action/60" />
            <span className="text-[10px] text-secondary">CSE 2026</span>
          </div>

          {/* Punchy Bio Description */}
          <p className="hero-bio-copy mb-6 max-w-[500px] text-[15px] leading-[1.8] text-secondary max-sm:text-[14px]">
            Engineering modern web platforms combining scalable backends with
            refined editorial aesthetics. Focused on React, Next.js, Node.js, and
            clean algorithmic architecture.
          </p>

          {/* Dual Action CTAs (View Work + 1-Click Download Resume) */}
          <div className="hero-actions mb-8 flex flex-wrap items-center gap-3.5">
            <a className={primaryButton} href="#projects">
              <span>View My Work</span>
              <ArrowDownRight size={16} />
            </a>
            <button
              type="button"
              className={`${outlineButton} cursor-pointer`}
              onClick={() => openResumeModal("modern")}
            >
              <Download size={15} />
              <span>Resume PDF</span>
            </button>
          </div>

          {/* Social Links Row */}
          <div className="flex items-center gap-4 text-secondary">
            <span className="font-mono text-[9px] uppercase tracking-wider text-secondary/80">
              Connect:
            </span>
            <a
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-action hover:text-action"
              href={developer.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Ashish Sahu GitHub"
            >
              <GithubIcon size={15} />
            </a>
            <a
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-action hover:text-action"
              href={developer.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Ashish Sahu LinkedIn"
            >
              <LinkedinIcon size={15} />
            </a>
            <a
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-action hover:text-action"
              href={`mailto:${developer.email}`}
              aria-label="Email Ashish Sahu"
            >
              <MailIcon size={15} />
            </a>
            <span className="ml-2 font-mono text-[10px] text-secondary/70">
              {developer.locationShort}
            </span>
          </div>
        </div>

        {/* Right Column: Visual Composition with Cutout Portrait & Code Card */}
        <div className="relative flex flex-col items-center justify-center lg:items-end">
          {/* Main Portrait Frame with Orbital Ring */}
          <div className="hero-profile-container relative w-full max-w-[370px] aspect-square">
            {/* Orbital Halo */}
            <div
              className="hero-portrait-orbit pointer-events-none absolute -inset-3 -z-10 rounded-full border border-action/40 shadow-[0_0_35px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
              aria-hidden="true"
            />

            {/* Inner Frame with Image or Monogram Fallback */}
            <div className="relative size-full overflow-hidden rounded-full border-2 border-action/60 bg-surface shadow-2xl">
              {!imageError ? (
                <img
                  className="size-full object-cover object-[center_30%]"
                  src={heroPortrait}
                  alt="Ashish Sahu - Full Stack Developer"
                  width="640"
                  height="640"
                  fetchPriority="high"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="grid size-full place-items-center bg-surface-alt font-serif text-6xl font-bold text-action">
                  AS
                </div>
              )}

              {/* Monogram Coordinate Pill */}
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border/80 bg-canvas/85 px-3 py-1 font-mono text-[9px] font-medium tracking-widest text-primary backdrop-blur-xs">
                AS // 2026
              </span>
            </div>

            {/* Floating Handwritten Annotation Note */}
            <div className="absolute -top-4 -right-2 z-20 flex items-center gap-1.5 rounded-md border border-border bg-surface/95 px-3 py-1.5 font-handwriting text-[15px] font-semibold text-action shadow-lg backdrop-blur-xs max-sm:text-[13px]">
              <Sparkles size={14} className="text-action" />
              <span>Turning Ideas into Products</span>
            </div>

            {/* Floating Syntax Highlighted Code Card (`developer.ts`) */}
            <div className="hero-floating-code absolute -bottom-6 -left-6 z-20 w-[230px] rounded-lg border border-border bg-canvas/95 p-3.5 shadow-xl backdrop-blur-md max-sm:w-[200px] max-sm:-left-2">
              <div className="mb-2 flex items-center gap-1.5 border-b border-border/60 pb-1.5">
                <span className="size-2 rounded-full bg-red-500/70" />
                <span className="size-2 rounded-full bg-yellow-500/70" />
                <span className="size-2 rounded-full bg-green-500/70" />
                <span className="ml-auto font-mono text-[8px] text-secondary">
                  developer.ts
                </span>
              </div>
              <pre className="font-mono text-[9px] leading-relaxed text-secondary overflow-hidden">
                <code>
                  <span className="text-action font-semibold">const</span> engineer = {"{\n"}
                  {"  "}name: <span className="text-primary font-medium">&quot;Ashish&quot;</span>,{"\n"}
                  {"  "}stack: [<span className="text-action">&quot;MERN&quot;</span>, <span className="text-action">&quot;Next&quot;</span>],{"\n"}
                  {"  "}ready: <span className="text-emerald-500">true</span>{"\n"}
                  {"}"};
                </code>
              </pre>
            </div>
          </div>

          {/* Quick Tech Stack Row */}
          <div className="mt-8 flex w-full max-w-[390px] flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-secondary">
              <span>Core Stack</span>
              <a
                href="#skills"
                className="text-action underline-offset-2 hover:underline"
              >
                All Skills →
              </a>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {techStack.slice(0, 4).map((tech) => (
                <div
                  key={tech.name}
                  className="hero-stack-item flex flex-col items-center justify-center rounded-sm border border-border bg-surface py-2 text-center transition-colors hover:border-action"
                >
                  <span className="font-mono text-[10px] font-semibold text-primary">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar: Key Metrics & Academic Milestones */}
      <div className="hero-metrics-bar border-t border-border bg-surface-alt/40 pt-4 pb-2 mt-4">
        <div
          className={`${contentWidth} flex flex-wrap items-center justify-between gap-6`}
        >
          {/* Key Metrics Counters */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {developer.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-baseline gap-2 ${
                  i !== developer.stats.length - 1
                    ? "sm:border-r sm:border-border sm:pr-8"
                    : ""
                }`}
              >
                <span className="font-serif text-2xl font-bold text-action sm:text-3xl">
                  {stat.value}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wide text-secondary">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Graduation Milestone Timeline Chip */}
          <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-[10px] text-secondary">
            <GraduationCap size={15} className="text-action" />
            <span>
              <strong className="text-primary font-semibold">2022</strong> B.Tech Start
            </span>
            <span className="h-2 w-px bg-border" />
            <Flag size={14} className="text-action" />
            <span>
              <strong className="text-primary font-semibold">2026</strong> Graduation Ready
            </span>
          </div>

          {/* Smooth Scroll Down Indicator */}
          <a
            href="#about"
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-secondary no-underline transition-colors hover:text-action"
          >
            <ArrowDown size={13} className="hero-scroll-icon text-action" />
            <span>Scroll Down</span>
          </a>
        </div>
      </div>
    </section>
  );
}
