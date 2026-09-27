import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { developer } from "../data/developer";
import { useMousePosition } from "../hooks/useMousePosition";
import { useMediaQuery } from "../hooks/useMediaQuery";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const terminalLines = [
  { prompt: "~", cmd: "whoami", type: "cmd" },
  { output: "Ashish Sahu — Full Stack Developer", type: "output" },
  { prompt: "~", cmd: "cat skills.txt", type: "cmd" },
  { output: "React · Node.js · MongoDB · Express", type: "output" },
  { prompt: "~", cmd: "git log --oneline -1", type: "cmd" },
  { output: "✓ Building something great...", type: "success" },
  { type: "cursor" },
];

const floatingIcons = [
  { emoji: "⚛️", label: "React", className: "top-[12%] right-[5%]", delay: 0 },
  {
    emoji: "🟢",
    label: "Node",
    className: "top-[35%] -right-[2%]",
    delay: 0.8,
  },
  {
    emoji: "🍃",
    label: "MongoDB",
    className: "bottom-[30%] right-[8%]",
    delay: 1.6,
  },
  {
    emoji: "☕",
    label: "Java",
    className: "bottom-[15%] -right-[1%]",
    delay: 0.4,
  },
];

export default function Hero() {
  const mouse = useMousePosition();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const orbRef = useRef(null);

  useEffect(() => {
    if (!isDesktop || !orbRef.current) return;
    const xOffset = (mouse.x / window.innerWidth - 0.5) * 20;
    const yOffset = (mouse.y / window.innerHeight - 0.5) * 20;
    orbRef.current.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }, [mouse, isDesktop]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-[100svh] flex items-center relative overflow-hidden pt-20"
      aria-label="Hero section"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div
          className={`grid gap-16 items-center ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {/* ── Left: text ── */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <motion.div {...fadeUp(0.1)}>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[0.75rem] font-semibold text-emerald-400 tracking-wider uppercase"
                role="status"
                aria-label="Available for work"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Available for work
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div {...fadeUp(0.25)}>
              <p className="font-mono text-xs text-[var(--text-muted)] tracking-[0.12em] uppercase mb-3">
                Hi, I'm
              </p>
              <h1 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black leading-[0.95] tracking-tight bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-muted)] bg-clip-text text-transparent">
                Ashish
                <br />
                <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
                  Sahu.
                </span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.div {...fadeUp(0.4)}>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[var(--text-secondary)] leading-snug tracking-tight">
                Full Stack
                <span className="text-[var(--text-primary)] block">
                  Developer.
                </span>
              </h2>
            </motion.div>

            {/* Tagline */}
            <motion.p
              {...fadeUp(0.55)}
              className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[440px]"
            >
              {developer.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.7)} className="flex gap-4 flex-wrap">
              <motion.button
                onClick={() => scrollTo("projects")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-gradient-to-br from-blue-600 to-sky-500 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-label="View my work"
              >
                View My Work
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </motion.button>

              <motion.button
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-transparent text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--bg-card)] hover:border-blue-600/40 hover:-translate-y-0.5"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Let's connect"
              >
                Let's Connect
              </motion.button>
            </motion.div>

            {/* Social */}
            <motion.div
              {...fadeUp(0.85)}
              className="flex gap-3 items-center mt-2"
            >
              <span className="text-[0.7rem] text-[var(--text-muted)] tracking-[0.08em] uppercase">
                Find me on
              </span>
              <div className="flex gap-2">
                {[
                  {
                    icon: <GithubIcon size={16} />,
                    href: developer.github,
                    label: "GitHub",
                  },
                  {
                    icon: <LinkedinIcon size={16} />,
                    href: developer.linkedin,
                    label: "LinkedIn",
                  },
                ].map(({ icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -2, borderColor: "rgba(37,99,235,0.4)" }}
                    className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: terminal visual ── */}
          {isDesktop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Orb */}
              <div
                ref={orbRef}
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none transition-transform duration-[400ms] ease-out"
                style={{
                  background:
                    "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(14,165,233,0.08) 50%, transparent 70%)",
                  filter: "blur(40px)",
                  zIndex: 0,
                }}
              />

              {/* Terminal */}
              <div
                className="bg-[var(--bg-tertiary)] border border-[var(--border-medium)] rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15),0_0_40px_rgba(37,99,235,0.1)] relative z-10"
                role="presentation"
                aria-label="Developer terminal"
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3.5 bg-[var(--bg-card)] border-b border-[var(--border-subtle)]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c940]" />
                  <span className="ml-3 font-mono text-[0.7rem] text-[var(--text-muted)] tracking-[0.06em]">
                    terminal — zsh
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 font-mono text-sm leading-[1.9]">
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + i * 0.18 }}
                    >
                      {line.type === "cmd" && (
                        <>
                          <span className="text-blue-500 select-none">
                            {line.prompt} $
                          </span>
                          <span className="text-[var(--text-primary)]">
                            {line.cmd}
                          </span>
                        </>
                      )}
                      {line.type === "output" && (
                        <span className="text-[var(--text-muted)] pl-4">
                          {line.output}
                        </span>
                      )}
                      {line.type === "success" && (
                        <span className="text-emerald-400 pl-4">
                          {line.output}
                        </span>
                      )}
                      {line.type === "cursor" && (
                        <>
                          <span className="text-blue-500 select-none">~ $</span>
                          <span
                            className="inline-block w-2 h-[1em] bg-blue-500 animate-pulse ml-1 align-bottom"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Stats bar */}
                <div className="flex gap-6 px-6 py-4 border-t border-[var(--border-subtle)]">
                  {[
                    { label: "Projects", value: "10+" },
                    { label: "Tech", value: "8+" },
                    { label: "Status", value: "Open" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="font-mono font-bold text-[var(--text-primary)] text-base">
                        {value}
                      </div>
                      <div className="font-mono text-[0.65rem] text-[var(--text-muted)] uppercase tracking-[0.08em]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating icons */}
              {floatingIcons.map((icon, i) => (
                <motion.div
                  key={icon.label}
                  className={`absolute flex items-center justify-center rounded-xl backdrop-blur-md border border-[var(--border-subtle)] text-xl w-12 h-12 bg-[var(--bg-secondary)] shadow-sm ${icon.className}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 1.2 + i * 0.15 },
                    scale: { duration: 0.5, delay: 1.2 + i * 0.15 },
                    y: {
                      duration: 3 + i * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: icon.delay,
                    },
                  }}
                  title={icon.label}
                >
                  {icon.emoji}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
          aria-hidden="true"
        >
          <span className="text-[0.65rem] tracking-[0.1em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-blue-600/60 to-transparent"
          />
        </motion.div>
      </div>

      {/* BG decoration */}
      <div
        aria-hidden="true"
        className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
