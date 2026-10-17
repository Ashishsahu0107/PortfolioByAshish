import { useRef, useState } from "react";
import { ArrowUpRight, MapPin, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { developer } from "../data/developer";
import { useGsapReveal } from "../hooks/useGsapReveal";

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
    <section className="section contact-section" id="contact" ref={sectionRef} aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-layout">
          <div className="contact-copy reveal"><p className="eyebrow"><span>04</span> Start a conversation</p><h2 className="contact-title" id="contact-title">Have a good one<br />in <span>mind?</span></h2><p className="section-lede">Have a project, an opportunity, or just want to say hello? My inbox is open.</p><a className="contact-email" href={`mailto:${developer.email}`}>{developer.email}<ArrowUpRight size={17} /></a><p className="contact-location"><MapPin size={15} />{developer.location} · Open to remote</p></div>
          <form className="contact-form reveal" onSubmit={submit}>
            <label>Your name<input name="name" type="text" autoComplete="name" placeholder="Jane Smith" required /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" placeholder="jane@company.com" required /></label>
            <label>What are you thinking?<textarea name="message" rows="4" placeholder="A little about the project..." required /></label>
            <button className="button button-lime" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending..." : state === "sent" ? "Message sent" : "Send a message"}<Send size={16} /></button>
            {state === "unconfigured" && <p className="form-status" role="status">The form isn’t connected yet. Email me directly at <a href={`mailto:${developer.email}`}>{developer.email}</a>.</p>}
            {state === "error" && <p className="form-status" role="status">Something went wrong. Please email me directly instead.</p>}
            {state === "sent" && <p className="form-status" role="status">Thanks for reaching out. I’ll be in touch soon.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
