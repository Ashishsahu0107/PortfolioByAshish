import { useRef, useState } from "react";
import { ArrowUpRight, MapPin, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { developer } from "../data/developer";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { contentWidth, eyebrow, primaryButton, sectionLede, sectionSurface } from "./portfolioStyles";

export default function PortfolioContact() {
  const sectionRef = useRef(null);
  const [state, setState] = useState("idle");
  useGsapReveal(sectionRef);

  const submit = async (event) => {
    event.preventDefault();
    const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = developer;
    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      setState("unconfigured");
      return;
    }
    const form = event.currentTarget;
    setState("sending");
    try {
      await emailjs.sendForm(emailjsServiceId, emailjsTemplateId, form, emailjsPublicKey);
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <section className={`${sectionSurface} bg-surface-alt`} id="contact" ref={sectionRef} aria-labelledby="contact-title">
      <div className={contentWidth}>
        <div className="grid grid-cols-[.95fr_1.05fr] items-start gap-[13%] max-[900px]:gap-[8%] max-sm:grid-cols-1 max-sm:gap-[43px]">
          <div className="contact-copy reveal"><p className={eyebrow}><span className="text-action">04</span> Start a conversation</p><h2 className="mb-[18px] mt-[25px] font-display text-[clamp(48px,6vw,78px)] font-medium leading-[1.02] text-primary max-sm:text-[clamp(52px,14vw,70px)]" id="contact-title">Have a good one<br />in <span className="text-action">mind?</span></h2><p className={`${sectionLede} max-w-[375px]`}>Have a project, an opportunity, or just want to say hello? My inbox is open.</p><a className="mt-[34px] inline-flex max-w-full items-center gap-[11px] border-b border-action pb-[9px] text-[14px] text-primary no-underline max-sm:break-all max-sm:text-[12px]" href={`mailto:${developer.email}`}>{developer.email}<ArrowUpRight className="shrink-0 text-action" size={17} /></a><p className="mt-6 flex items-center gap-2 font-mono text-[10px] text-secondary"><MapPin className="text-action" size={15} />{developer.location} · Open to remote</p></div>
          <form className="contact-form reveal pt-[10px] max-sm:pt-0" onSubmit={submit}>
            <label className="mb-[21px] block font-mono text-[10px] uppercase text-secondary">Your name<input className="mt-[9px] block w-full border-0 border-b border-border bg-transparent py-3 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/80 focus:border-action" name="name" type="text" autoComplete="name" placeholder="Jane Smith" required /></label>
            <label className="mb-[21px] block font-mono text-[10px] uppercase text-secondary">Email address<input className="mt-[9px] block w-full border-0 border-b border-border bg-transparent py-3 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/80 focus:border-action" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required /></label>
            <label className="mb-[21px] block font-mono text-[10px] uppercase text-secondary">What are you thinking?<textarea className="mt-[9px] block w-full resize-y border-0 border-b border-border bg-transparent py-3 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/80 focus:border-action" name="message" rows="4" placeholder="A little about the project..." required /></label>
            <button className={`${primaryButton} mt-1`} type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending..." : state === "sent" ? "Message sent" : "Send a message"}<Send size={16} /></button>
            {state === "unconfigured" && <p className="mt-3 text-[12px] leading-relaxed text-secondary" role="status">The form isn’t connected yet. Email me directly at <a className="text-action underline" href={`mailto:${developer.email}`}>{developer.email}</a>.</p>}
            {state === "error" && <p className="mt-3 text-[12px] leading-relaxed text-secondary" role="status">Something went wrong. Please email me directly instead.</p>}
            {state === "sent" && <p className="mt-3 text-[12px] leading-relaxed text-secondary" role="status">Thanks for reaching out. I’ll be in touch soon.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
