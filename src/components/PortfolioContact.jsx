import { useRef, useState } from "react";
import { ArrowUpRight, Download, Mail, MapPin, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { developer } from "../data/developer";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  primaryButton,
  sectionLede,
  sectionSurface,
} from "./portfolioStyles";

export default function PortfolioContact() {
  const sectionRef = useRef(null);
  const [state, setState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  useGsapReveal(sectionRef);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const subject = formData.get("subject")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Client-side validation per PRD Section 5.4
    if (!name || name.length < 2) {
      setErrorMessage("Please enter your name (at least 2 characters).");
      setState("error");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setState("error");
      return;
    }
    if (!subject || subject.length < 4) {
      setErrorMessage("Subject must be at least 4 characters.");
      setState("error");
      return;
    }
    if (!message || message.length < 15) {
      setErrorMessage("Message must be at least 15 characters.");
      setState("error");
      return;
    }

    const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = developer;

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      // Graceful fallback to mailto link
      window.location.href = `mailto:${developer.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      setState("unconfigured");
      return;
    }

    setState("sending");
    setErrorMessage("");

    try {
      await emailjs.sendForm(
        emailjsServiceId,
        emailjsTemplateId,
        form,
        emailjsPublicKey
      );
      form.reset();
      setState("sent");
    } catch {
      setState("error");
      setErrorMessage(
        "Could not send automatically. Please reach out directly via email."
      );
    }
  };

  return (
    <section
      className={`${sectionSurface} bg-surface-alt/40`}
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
    >
      <div className={contentWidth}>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left Column: Direct Contact & Availability */}
          <div className="contact-copy reveal">
            <p className={eyebrow}>
              <span className="text-action">06</span> Start a Conversation
            </p>
            <h2
              className="mb-4 mt-6 font-serif text-[clamp(42px,5.5vw,72px)] font-bold leading-[1.02] text-primary"
              id="contact-title"
            >
              Have a project<br />
              in <span className="italic font-normal text-action">mind?</span>
            </h2>
            <p className={`${sectionLede} max-w-[420px]`}>
              Whether you are looking to build a full stack product from scratch,
              discuss an internship or full-time opportunity, or talk engineering — my
              inbox is open.
            </p>

            {/* Direct Email Link */}
            <a
              className="mt-8 inline-flex max-w-full items-center gap-2.5 border-b border-action pb-2 font-mono text-[14px] text-primary no-underline transition-colors hover:text-action max-sm:text-[13px]"
              href={`mailto:${developer.email}`}
            >
              <Mail size={16} className="text-action shrink-0" />
              <span>{developer.email}</span>
              <ArrowUpRight className="shrink-0 text-action" size={16} />
            </a>

            {/* Location & Status Info */}
            <p className="mt-5 flex items-center gap-2 font-mono text-[11px] text-secondary">
              <MapPin className="text-action" size={15} />
              <span>{developer.location} · Available worldwide (Remote & On-site)</span>
            </p>

            {/* Direct Resource Links (Resume, GitHub, LinkedIn) */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={developer.resumeUrl}
                download="Ashish_Sahu_Resume.pdf"
                className="inline-flex items-center gap-2 rounded-sm border border-action bg-action/10 px-4 py-2 font-mono text-[11px] font-semibold text-action transition-all hover:bg-action hover:text-canvas"
              >
                <Download size={14} />
                <span>Download Resume (PDF)</span>
              </a>
              <a
                href={developer.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href={developer.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>

          {/* Right Column: Reactive Contact Form */}
          <div className="reveal rounded-lg border border-border bg-surface p-7 sm:p-8 shadow-xs">
            {state === "sent" ? (
              <div className="py-8 text-center">
                <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Send size={22} />
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Message Sent Successfully
                </h3>
                <p className="mt-2 text-sm text-secondary">
                  Thank you for reaching out. I usually respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className={`${primaryButton} mt-6`}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form space-y-5" onSubmit={submit}>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    required
                    className="mt-1.5 block w-full rounded-sm border border-border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 focus:border-action"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    required
                    className="mt-1.5 block w-full rounded-sm border border-border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 focus:border-action"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="Project Inquiry / Opportunity"
                    required
                    className="mt-1.5 block w-full rounded-sm border border-border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 focus:border-action"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell me a bit about your project, timeline, or inquiry..."
                    required
                    className="mt-1.5 block w-full resize-y rounded-sm border border-border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 focus:border-action"
                  />
                </div>

                <button
                  className={`${primaryButton} w-full mt-2`}
                  type="submit"
                  disabled={state === "sending"}
                >
                  <span>{state === "sending" ? "Sending Payload..." : "Send Message"}</span>
                  <Send size={15} />
                </button>

                {state === "unconfigured" && (
                  <p
                    className="mt-3 text-[11px] leading-relaxed text-secondary"
                    role="status"
                  >
                    Opened your email client directly. If it didn&apos;t open, email me at{" "}
                    <a className="text-action underline" href={`mailto:${developer.email}`}>
                      {developer.email}
                    </a>
                    .
                  </p>
                )}

                {state === "error" && (
                  <p
                    className="mt-3 text-[11px] leading-relaxed text-red-400"
                    role="alert"
                  >
                    {errorMessage ||
                      "Something went wrong. Please email me directly."}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
