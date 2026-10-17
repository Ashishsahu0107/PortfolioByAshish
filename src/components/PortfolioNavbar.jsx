import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { developer } from "../data/developer";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
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
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <nav className="nav-wrap wrap" aria-label="Main navigation">
        <a className="brand-mark" href="#home" aria-label={`${developer.name}, home`}><span>AS</span><i>.</i></a>
        <div className="desktop-nav">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-pressed={theme === "light"} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
        <a className="nav-availability" href="#contact"><span className="status-dot" />Available for work</a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </nav>
      {menuOpen && <div className="mobile-nav">{links.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}</div>}
    </header>
  );
}
