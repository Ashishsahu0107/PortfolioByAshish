import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, X, Menu } from "lucide-react";
import { developer } from "../data/developer";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[500] transition-all duration-300"
        aria-label="Main navigation"
      >
        <div
          className={`mx-4 md:mx-6 mt-4 px-4 md:px-6 py-3 flex items-center justify-between rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "bg-[rgba(5,5,5,0.80)] backdrop-blur-2xl border-[var(--border-subtle)]"
              : "border-transparent"
          } ${theme === "light" && scrolled ? "!bg-[rgba(250,250,250,0.85)]" : ""}`}
        >
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => scrollTo(e, "#home")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 no-underline font-mono text-[1.05rem] font-bold text-[var(--text-primary)] tracking-tight"
            aria-label={`${developer.name} — Home`}
          >
            <span className="text-blue-600">&lt;</span>
            AS
            <span className="text-blue-600">/&gt;</span>
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb] ml-0.5"
            />
          </motion.a>

          {/* Desktop nav */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`relative px-3 py-1 text-sm font-medium no-underline transition-colors duration-150 ${
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-[-2px] left-0 right-0 h-px bg-blue-600"
                    />
                  )}
                </a>
              );
            })}
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center justify-center hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>

            {/* Let's Talk — desktop */}
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, "#contact")}
              className="hidden md:inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-gradient-to-br from-blue-600 to-sky-500 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]"
            >
              Let's Talk
            </a>

            {/* Hamburger — mobile */}
            <motion.button
              onClick={() => setMenuOpen(true)}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="md:hidden w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center cursor-pointer"
            >
              <Menu size={18} />
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`fixed inset-0 z-[600] flex flex-col justify-center px-8 backdrop-blur-2xl ${theme === "light" ? "bg-[rgba(250,250,250,0.97)]" : "bg-[rgba(5,5,5,0.97)]"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-2xl font-bold py-3 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-8 left-8 right-8 flex justify-between items-center"
            >
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {developer.name}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {developer.role}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
