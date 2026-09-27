import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, MapPin, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";
import { developer } from "../data/developer";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !developer.emailjsServiceId ||
      developer.emailjsServiceId === "YOUR_SERVICE_ID"
    ) {
      alert(
        "Please add your EmailJS keys to developer.js to enable the contact form.",
      );
      return;
    }

    setStatus("submitting");

    try {
      await emailjs.sendForm(
        developer.emailjsServiceId,
        developer.emailjsTemplateId,
        e.target,
        developer.emailjsPublicKey,
      );

      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      alert(
        "Failed to send message. Please check your network connection or keys.",
      );
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      className="py-24 lg:py-32"
      aria-label="Contact section"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest justify-center mb-6">
            Contact
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-2">
            Let's build something
            <br />
            <span className="bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent">
              together.
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">
              Get in touch
            </h3>
            <p className="text-[0.95rem] text-[var(--text-secondary)] leading-[1.7] mb-10">
              I'm currently available for freelance work and internship
              opportunities. Whether you have a project in mind, need a
              developer for your team, or just want to say hi — my inbox is
              always open.
            </p>

            <div className="flex flex-col gap-6">
              <a
                href={`mailto:${developer.email}`}
                className="flex items-start gap-4 group no-underline text-[var(--text-primary)]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
                    Email
                  </div>
                  <div className="font-medium group-hover:text-blue-400 transition-colors">
                    {developer.email}
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-blue-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
                    Location
                  </div>
                  <div className="font-medium">{developer.location}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 lg:p-10 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold ml-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold ml-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold ml-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer mt-2 w-full sm:w-auto self-start ${
                  status === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-gradient-to-br from-blue-600 to-sky-500 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]"
                }`}
              >
                {status === "submitting" ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : status === "success" ? (
                  "Message Sent!"
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
