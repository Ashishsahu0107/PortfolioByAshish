import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { developer } from "../data/developer";
import { contentWidth } from "./portfolioStyles";

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
    <header className={`fixed inset-x-0 top-0 z-[800] border-b border-transparent transition-[background-color,border-color] duration-300 ${scrolled ? "border-border bg-canvas/90 backdrop-blur-lg" : ""}`}>
      <nav className={`${contentWidth} flex h-[82px] items-center justify-between max-sm:h-[68px]`} aria-label="Main navigation">
        <a className="font-display text-[22px] font-bold text-primary no-underline" href="#home" aria-label={`${developer.name}, home`}><span>AS</span><i className="text-action not-italic">.</i></a>
        <div className="hidden items-center gap-[35px] min-[621px]:flex">{links.map((link) => <a className="text-[13px] text-secondary no-underline transition-colors hover:text-action" key={link.href} href={link.href}>{link.label}</a>)}</div>
        <a className="flex items-center gap-2.5 text-[13px] text-primary no-underline transition-colors hover:text-action max-[620px]:hidden" href="#contact"><span className="size-[7px] rounded-full bg-action" />Available for work</a>
        <div className="flex items-center gap-2 max-[620px]:ml-auto">
          <button className="grid size-9 place-items-center rounded-full border border-border bg-surface text-primary transition-colors hover:border-action hover:text-action-hover" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-pressed={theme === "light"} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button className="hidden size-9 place-items-center text-primary max-[620px]:inline-grid" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </nav>
      {menuOpen && <div className="flex flex-col gap-0 border-b border-border bg-canvas/95 px-5 pb-[18px] pt-1 backdrop-blur-lg min-[621px]:hidden">{links.map((link) => <a className="border-b border-border py-[14px] font-display text-xl font-medium text-primary no-underline" key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}</div>}
    </header>
  );
}
