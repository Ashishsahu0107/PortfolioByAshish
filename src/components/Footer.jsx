import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { developer } from "../data/developer";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./icons";
import { navLinks, socialLinks } from "../data/socialLinks";

const iconMap = {
  github: <GithubIcon size={18} />,
  linkedin: <LinkedinIcon size={18} />,
  twitter: <TwitterIcon size={18} />,
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pt-20 pb-10 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] rounded-[100%] blur-[100px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #2563eb, #0ea5e9)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand/Bio */}
          <div className="lg:col-span-2">
            <a
              href="#home"
              className="inline-block no-underline font-mono text-[1.25rem] font-bold text-[var(--text-primary)] tracking-tight mb-5"
            >
              <span className="text-blue-600">&lt;</span>
              AS
              <span className="text-blue-600">/&gt;</span>
            </a>
            <p className="text-[0.9rem] text-[var(--text-secondary)] leading-[1.7] max-w-md mb-6">
              A passionate Full Stack Developer focused on building scalable,
              performant, and beautifully designed digital experiences.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  whileHover={{
                    y: -3,
                    borderColor: "rgba(37,99,235,0.4)",
                    color: "#3b82f6",
                  }}
                  className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] transition-colors duration-200"
                >
                  {iconMap[link.id]}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.9rem] font-bold text-[var(--text-primary)] tracking-tight mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[0.85rem] text-[var(--text-muted)] hover:text-blue-500 transition-colors inline-block no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-[0.9rem] font-bold text-[var(--text-primary)] tracking-tight mb-5">
              Location
            </h4>
            <p className="text-[0.85rem] text-[var(--text-muted)] leading-[1.6]">
              {developer.location}
              <br />
              Available for remote work worldwide.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[0.75rem] font-semibold text-emerald-500 uppercase tracking-wider">
                Open to work
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-[0.8rem] text-[var(--text-muted)]">
            © {new Date().getFullYear()} {developer.name}. All rights reserved.
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-blue-500 transition-colors"
            aria-label="Scroll to top"
          >
            Back to top <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
