import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Download, Loader2, Mail, MapPin, Send, AlertCircle, Sparkles } from "lucide-react";
import emailjs from "@emailjs/browser";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useGsapReveal } from "../hooks/useGsapReveal";
import {
  contentWidth,
  eyebrow,
  primaryButton,
  sectionLede,
  sectionSurface,
} from "./portfolioStyles";
import { useResumeModal } from "../resume-builder/context/ResumeModalContext";
import { usePortfolioSync } from "../hooks/usePortfolioSync";
import { contactApi, formsApi } from "../services/api";
import { showToast, toast } from "../utils/toast";

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function PortfolioContact() {
  const sectionRef = useRef(null);
  const [contactData, setContactData] = useState({
    email: "ashishsahu01072005@gmail.com",
    github: "https://github.com/Ashishsahu0107",
    linkedin: "https://linkedin.com/in/ashishsahu0107",
    location: "Bhilai, Chhattisgarh, India",
    locationShort: "India",
    statusPhrase: "Available for full-time & freelance projects",
    availableForWork: true,
    emailjsServiceId: "",
    emailjsTemplateId: "",
    emailjsPublicKey: "",
  });

  const [customForms, setCustomForms] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");

  useGsapReveal(sectionRef);
  const { openResumeModal } = useResumeModal();

  const loadContact = useCallback(async () => {
    try {
      const [contactInfo, formsList] = await Promise.all([
        contactApi.getInfo().catch(() => null),
        formsApi.getAll().catch(() => []),
      ]);
      if (contactInfo) {
        setContactData((prev) => ({ ...prev, ...contactInfo }));
      }
      if (Array.isArray(formsList)) {
        // Show published forms
        setCustomForms(formsList.filter((f) => f.enabled));
      }
    } catch (err) {
      console.warn("[PortfolioContact] Could not load contact or forms:", err.message);
    }
  }, []);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  // Real-time synchronization whenever contact or form settings are updated
  usePortfolioSync(loadContact, "contact");
  usePortfolioSync(loadContact, "forms");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const validateForm = () => {
    const errors = {};
    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanSubject = formData.subject.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName) {
      errors.name = "Please enter your name.";
    } else if (cleanName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (cleanName.length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      errors.email = "Please enter your email address.";
    } else if (!emailRegex.test(cleanEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com).";
    } else if (cleanEmail.length > 120) {
      errors.email = "Email cannot exceed 120 characters.";
    }

    if (!cleanSubject) {
      errors.subject = "Please enter a subject for your message.";
    } else if (cleanSubject.length < 3) {
      errors.subject = "Subject must be at least 3 characters.";
    } else if (cleanSubject.length > 200) {
      errors.subject = "Subject cannot exceed 200 characters.";
    }

    if (!cleanMessage) {
      errors.message = "Please write a brief message.";
    } else if (cleanMessage.length < 10) {
      errors.message = "Message must be at least 10 characters.";
    } else if (cleanMessage.length > 5000) {
      errors.message = "Message cannot exceed 5000 characters.";
    }

    return errors;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      showToast.error(firstError);
      return;
    }

    setSubmitting(true);
    setGeneralError("");
    const toastId = toast.loading("Sending your message...", { id: "contact-submit" });

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    try {
      // 1. Save directly into backend persistent database
      const res = await contactApi.sendMessage(payload);

      // 2. Dispatch via EmailJS if credentials are configured
      const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = contactData;
      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        emailjs
          .send(
            emailjsServiceId,
            emailjsTemplateId,
            {
              from_name: payload.name,
              from_email: payload.email,
              reply_to: payload.email,
              subject: payload.subject,
              message: payload.message,
            },
            emailjsPublicKey
          )
          .catch((emailErr) => {
            console.warn("[PortfolioContact] EmailJS dispatch non-critical error:", emailErr);
          });
      }

      // Reset the form only after successful submission
      setFormData(INITIAL_FORM);
      setFieldErrors({});
      setSubmitSuccess(true);

      toast.success(
        res?.message || "Message sent successfully! Thank you for reaching out.",
        { id: toastId }
      );
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Could not send your message. Please reach out directly via email.";
      setGeneralError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
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
              href={`mailto:${contactData.email}`}
            >
              <Mail size={16} className="text-action shrink-0" />
              <span>{contactData.email}</span>
              <ArrowUpRight className="shrink-0 text-action" size={16} />
            </a>

            {/* Location & Status Info */}
            <p className="mt-5 flex items-center gap-2 font-mono text-[11px] text-secondary">
              <MapPin className="text-action shrink-0" size={15} />
              <span>{contactData.location} · Available worldwide (Remote & On-site)</span>
            </p>

            {/* Direct Resource Links (Resume, GitHub, LinkedIn) */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openResumeModal()}
                className="inline-flex items-center gap-2 rounded-sm border border-action bg-action/10 px-4 py-2 font-mono text-[11px] font-semibold text-action transition-all hover:bg-action hover:text-canvas cursor-pointer"
              >
                <Download size={14} />
                <span>Resume PDF</span>
              </button>
              <a
                href={contactData.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-secondary transition-colors hover:border-action hover:text-action"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>

            {/* Custom Forms & Questionnaires Integration */}
            {customForms.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/60">
                <p className="font-mono text-[10px] uppercase tracking-wider text-secondary mb-2.5">
                  Available Questionnaires & Custom Forms
                </p>
                <div className="flex flex-wrap gap-2">
                  {customForms.map((cf) => (
                    <Link
                      key={cf.id}
                      to={`/form/${cf.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-surface text-xs font-mono text-primary hover:border-action hover:text-action transition-colors no-underline"
                    >
                      <Sparkles size={12} className="text-action" />
                      <span>{cf.name}</span>
                      <ArrowUpRight size={13} className="text-secondary" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reactive Contact Form */}
          <div className="reveal rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-xs">
            {submitSuccess ? (
              <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={28} />
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Message Sent Successfully
                </h3>
                <p className="mt-2 text-sm text-secondary max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out! Your message has been saved to the database and delivered. I will respond to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData(INITIAL_FORM);
                    setFieldErrors({});
                    setGeneralError("");
                  }}
                  className={`${primaryButton} mt-6 inline-flex items-center gap-2`}
                >
                  <Send size={14} />
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form className="contact-form space-y-5" onSubmit={submit} noValidate>
                {/* General Error Banner */}
                {generalError && (
                  <div
                    className="p-3 rounded-sm border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start gap-2.5"
                    role="alert"
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{generalError}</span>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                    >
                      Your Name <span className="text-action">*</span>
                    </label>
                    {fieldErrors.name && (
                      <span className="font-mono text-[10px] text-red-400 flex items-center gap-1">
                        <AlertCircle size={10} />
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    disabled={submitting}
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1.5 block w-full rounded-sm border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.name
                        ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "border-border focus:border-action focus:ring-1 focus:ring-action/20"
                    }`}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                    >
                      Email Address <span className="text-action">*</span>
                    </label>
                    {fieldErrors.email && (
                      <span className="font-mono text-[10px] text-red-400 flex items-center gap-1">
                        <AlertCircle size={10} />
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    disabled={submitting}
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1.5 block w-full rounded-sm border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.email
                        ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "border-border focus:border-action focus:ring-1 focus:ring-action/20"
                    }`}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="contact-subject"
                      className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                    >
                      Subject <span className="text-action">*</span>
                    </label>
                    {fieldErrors.subject && (
                      <span className="font-mono text-[10px] text-red-400 flex items-center gap-1">
                        <AlertCircle size={10} />
                        {fieldErrors.subject}
                      </span>
                    )}
                  </div>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="Project Inquiry / Job Opportunity"
                    disabled={submitting}
                    value={formData.subject}
                    onChange={handleChange}
                    className={`mt-1.5 block w-full rounded-sm border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.subject
                        ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "border-border focus:border-action focus:ring-1 focus:ring-action/20"
                    }`}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-[10px] uppercase tracking-wider text-secondary"
                    >
                      Message <span className="text-action">*</span>
                    </label>
                    {fieldErrors.message && (
                      <span className="font-mono text-[10px] text-red-400 flex items-center gap-1">
                        <AlertCircle size={10} />
                        {fieldErrors.message}
                      </span>
                    )}
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell me a bit about your project, timeline, or inquiry..."
                    disabled={submitting}
                    value={formData.message}
                    onChange={handleChange}
                    className={`mt-1.5 block w-full resize-y rounded-sm border bg-canvas px-3.5 py-2.5 text-[13px] text-primary outline-none transition-colors placeholder:text-secondary/50 disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.message
                        ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "border-border focus:border-action focus:ring-1 focus:ring-action/20"
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className={`${primaryButton} w-full mt-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-75`}
                  type="submit"
                  disabled={submitting}
                  id="contact-submit-btn"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin text-canvas" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

