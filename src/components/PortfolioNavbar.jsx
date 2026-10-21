import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { developer } from "../data/developer";
import { contentWidth } from "./portfolioStyles";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioNavbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[800] border-b border-transparent transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-border bg-canvas/90 backdrop-blur-md shadow-xs"
          : "bg-transparent"
      }`}
    >
      <nav
        className={`${contentWidth} flex h-[82px] items-center justify-between max-sm:h-[68px]`}
        aria-label="Main navigation"
      >
        {/* Wordmark Logo */}
        <a
          className="group flex items-baseline font-serif text-[24px] font-bold text-primary no-underline transition-colors"
          href="#home"
          aria-label={`${developer.name}, return to top`}
        >
          <span>AS</span>
          <span className="font-serif text-action transition-transform group-hover:scale-125">
            .
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-[28px] lg:gap-[34px] min-[880px]:flex">
          {links.map((link) => (
            <a
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-secondary no-underline transition-colors hover:text-action"
              key={link.href}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions Group (Resume Builder + Resume CTA + Theme Toggle + Mobile Hamburger) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Resume Builder Link */}
          <Link
            to="/resume-builder"
            className="inline-flex items-center gap-1.5 rounded-sm border border-action/40 bg-action/10 px-3 py-1.5 font-mono text-[10px] font-medium tracking-wider text-action transition-all hover:border-action hover:bg-action hover:text-canvas"
            title="Interactive Full Stack Resume Builder"
          >
            <Sparkles size={12} />
            <span className="hidden xs:inline">Resume Builder</span>
            <span className="xs:hidden">Builder</span>
          </Link>

          {/* Resume CTA (FR-1.2: 1-click download) */}
          <a
            href={developer.resumeUrl}
            download="Ashish_Sahu_Resume.pdf"
            className="hidden items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 font-mono text-[10px] font-medium tracking-wider text-secondary transition-all hover:border-action hover:text-action md:inline-flex"
            title="Download PDF Resume"
          >
            <Download size={12} />
            <span>PDF</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            className="grid size-9 place-items-center rounded-full border border-border bg-surface text-primary transition-colors hover:border-action hover:text-action cursor-pointer"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="hidden size-9 place-items-center text-primary min-[880px]:hidden cursor-pointer"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="flex flex-col border-b border-border bg-canvas/95 px-6 pb-6 pt-2 backdrop-blur-xl min-[880px]:hidden">
          {links.map((link) => (
            <a
              className="border-b border-border/50 py-3.5 font-serif text-lg font-medium text-primary no-underline transition-colors hover:text-action"
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2 pt-2">
            <Link
              to="/resume-builder"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-action bg-action/15 px-4 py-2 font-mono text-[11px] font-semibold text-action no-underline"
              onClick={() => setMenuOpen(false)}
            >
              <Sparkles size={14} />
              <span>Full Stack Resume Builder</span>
            </Link>
            <div className="flex items-center justify-between pt-1">
              <a
                href={developer.resumeUrl}
                download="Ashish_Sahu_Resume.pdf"
                className="inline-flex items-center gap-2 rounded-sm bg-action px-4 py-2 font-mono text-[11px] font-semibold text-canvas no-underline"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>
              <span className="font-mono text-[10px] text-secondary">
                {developer.location}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
