import { ArrowUp, Heart } from "lucide-react";
import { useDeveloper } from "../context/DeveloperContext";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";
import { contentWidth } from "./portfolioStyles";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";

export default function PortfolioFooter() {
  const { developer } = useDeveloper();
  const { openResumeModal } = useResumeModal();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const firstName = developer?.firstName || developer?.name?.split(" ")[0] || "Portfolio";
  const lastName = developer?.lastName || developer?.name?.split(" ").slice(1).join(" ") || "";
  const tagline = developer?.tagline || developer?.role || "Full Stack Developer";
  const graduatingYear = developer?.graduatingYear;
  const fullName = developer?.name || `${firstName} ${lastName}`.trim();
  const location = developer?.locationShort || developer?.location || "India";

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
              aria-label={`${fullName}, return to top`}
            >
              <span>{firstName}</span>{" "}
              {lastName && (
                <span className="italic font-normal text-action">
                  {lastName}
                </span>
              )}
            </a>
            <p className="mt-1 font-mono text-[11px] text-secondary">
              {tagline} {graduatingYear ? `· Class of ${graduatingYear}` : ""}
            </p>
          </div>

          {/* Social Links & Back to Top Trigger */}
          <div className="flex items-center gap-4">
            {developer?.github && (
              <a
                href={developer.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
              >
                <GithubIcon size={16} />
              </a>
            )}
            {developer?.linkedin && (
              <a
                href={developer.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
              >
                <LinkedinIcon size={16} />
              </a>
            )}
            {developer?.email && (
              <a
                href={`mailto:${developer.email}`}
                aria-label={`Email ${fullName}`}
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
              >
                <MailIcon size={16} />
              </a>
            )}
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
            © {new Date().getFullYear()} {fullName}. Crafted with{" "}
            <Heart size={11} className="inline text-action mx-0.5" /> in {location}.
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
            {developer?.github && (
              <a
                href={developer.github}
                target="_blank"
                rel="noreferrer"
                className="text-secondary hover:text-action"
              >
                Source on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
