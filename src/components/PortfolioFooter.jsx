import { ArrowUp, Heart } from "lucide-react";
import { developer } from "../data/developer";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";
import { contentWidth } from "./portfolioStyles";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";

export default function PortfolioFooter() {
  const { openResumeModal } = useResumeModal();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-canvas py-10 text-primary">
      <div className={`${contentWidth} flex flex-col gap-8`}>
        {/* Main Footer Row */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          {/* Brand Wordmark & Tagline */}
          <div>
            <a
              className="font-serif text-2xl font-bold tracking-tight text-primary no-underline"
              href="#home"
              aria-label={`${developer.name}, return to top`}
            >
              <span>{developer.firstName}</span>{" "}
              <span className="italic font-normal text-action">
                {developer.lastName}
              </span>
            </a>
            <p className="mt-1 font-mono text-[11px] text-secondary">
              Editorial craft meets engineering precision · Class of {developer.graduatingYear}
            </p>
          </div>

          {/* Social Links & Back to Top Trigger */}
          <div className="flex items-center gap-4">
            <a
              href={developer.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={developer.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
            >
              <LinkedinIcon size={16} />
            </a>
            <a
              href={`mailto:${developer.email}`}
              aria-label="Email Ashish Sahu"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
            >
              <MailIcon size={16} />
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 font-mono text-[10px] text-secondary transition-colors hover:border-action hover:text-action cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col justify-between gap-2 border-t border-border/60 pt-6 text-[11px] text-secondary sm:flex-row sm:items-center">
          <p className="font-mono text-[10px]">
            © {new Date().getFullYear()} {developer.name}. Crafted with{" "}
            <Heart size={11} className="inline text-action mx-0.5" /> in {developer.location}.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => openResumeModal("modern")}
              className="text-secondary hover:text-action cursor-pointer"
            >
              Resume PDF
            </button>
            <span className="text-border">·</span>
            <a
              href={developer.github}
              target="_blank"
              rel="noreferrer"
              className="text-secondary hover:text-action"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
