import { useEffect, useState } from "react";
import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { useDeveloper } from "../context/DeveloperContext";
import { contentWidth } from "./portfolioStyles";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";

const links = [
  { label: "About", href: "#about", number: "01" },
  { label: "Skills", href: "#skills", number: "02" },
  { label: "Work", href: "#projects", number: "03" },
  { label: "Process", href: "#process", number: "04" },
  { label: "Experience", href: "#experience", number: "05" },
  { label: "Contact", href: "#contact", number: "06" },
];

export default function PortfolioNavbar({ theme, toggleTheme }) {
  const { developer } = useDeveloper();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { openResumeModal } = useResumeModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);

      // Section scroll-spy for active indicator
      const sectionIds = [
        "about",
        "skills",
        "projects",
        "process",
        "experience",
        "contact",
      ];
      const scrollPos = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      if (window.scrollY < 180) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = developer?.name
    ? developer.name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AS";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[800] transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-canvas/85 backdrop-blur-xl shadow-xs"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Hairline Scroll Accent Line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-action/40 to-transparent transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0 }}
        aria-hidden="true"
      />

      <nav
        className={`${contentWidth} flex h-[58px] sm:h-[62px] items-center justify-between`}
        aria-label="Main navigation"
      >
        {/* Unique Monogram Logo */}
        <a
          className="group flex items-center gap-2 no-underline"
          href="#home"
          aria-label={`${developer?.name || "Portfolio"}, return to top`}
        >
          {/* Monogram Emblem */}
          <div className="relative flex size-8 sm:size-[34px] items-center justify-center rounded-lg border border-border/90 bg-surface/90 shadow-xs transition-all duration-300 group-hover:border-action group-hover:bg-surface-alt group-hover:shadow-md group-hover:shadow-action/10">
            <span className="font-mono text-xs sm:text-[13px] font-bold tracking-tight text-primary transition-colors group-hover:text-action">
              {initials}
            </span>
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-action animate-pulse" />
          </div>
        </a>

        {/* Desktop Navigation Links with Animated Bottom Hover Line */}
        <div className="hidden items-center gap-6 lg:gap-8 min-[880px]:flex">
          {links.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className="group relative flex items-center py-2 no-underline"
              >
                <span
                  className={`font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
                    isActive
                      ? "text-action font-semibold"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {link.label}
                </span>

                {/* Animated Bottom Hover Line */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-action transition-all duration-300 ease-out ${
                    isActive
                      ? "w-full shadow-[0_0_8px_var(--color-accent)]"
                      : "w-0 group-hover:w-full group-hover:shadow-[0_0_6px_var(--color-accent)]"
                  }`}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>

        {/* Actions Group (Resume CTA + Theme Toggle + Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Resume PDF Template Selector Button */}
          <button
            type="button"
            id="navbar-resume-btn"
            onClick={() => openResumeModal("modern")}
            className="group/resume inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 sm:px-3 sm:py-1.5 font-mono text-[9px] sm:text-[10px] font-medium tracking-wider text-secondary transition-all duration-300 hover:border-action hover:bg-surface-alt hover:text-action hover:shadow-xs cursor-pointer shrink-0"
            title="Open Resume PDF Template Selector"
          >
            <Download
              size={12}
              className="transition-transform duration-300 group-hover/resume:-translate-y-0.5 shrink-0"
            />
            <span>
              <span className="hidden min-[360px]:inline">Resume</span>
              <span className="min-[360px]:hidden">CV</span>
              <span className="hidden min-[440px]:inline"> PDF</span>
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            className="group grid size-8 sm:size-[34px] place-items-center rounded-full border border-border bg-surface text-primary transition-all duration-300 hover:border-action hover:bg-surface-alt hover:text-action hover:rotate-12 hover:shadow-xs cursor-pointer"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun
                size={15}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <Moon
                size={15}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-primary transition-colors hover:border-action hover:text-action min-[880px]:hidden cursor-pointer"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="flex flex-col border-b border-border bg-canvas/95 px-6 pb-6 pt-3 backdrop-blur-xl min-[880px]:hidden">
          <div className="flex flex-col space-y-1">
            {links.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  className={`group flex items-center justify-between border-b border-border/40 py-2.5 font-serif text-base font-medium no-underline transition-colors ${
                    isActive ? "text-action" : "text-primary hover:text-action"
                  }`}
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[10px] text-secondary">
                    {link.number}
                  </span>
                </a>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openResumeModal("modern");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-action px-4 py-1.5 font-mono text-[11px] font-semibold text-canvas transition-transform active:scale-95 cursor-pointer"
              >
                <Download size={13} />
                <span>Resume PDF</span>
              </button>
              {developer?.location && (
                <span className="font-mono text-[10px] text-secondary">
                  {developer.location}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
