import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Terminal,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../../components/icons";

export default function TemplateDeveloper({ data }) {
  const {
    personalInfo = {},
    summary = "",
    skills = {},
    workExperience = [],
    projects = [],
    education = [],
    certifications = [],
    achievements = [],
  } = data;

  const hasSkills = Object.values(skills).some((arr) => arr && arr.length > 0);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-8 sm:p-10 text-[12.5px] leading-normal shadow-sm">
      {/* Dev Terminal Header */}
      <header className="rounded-lg bg-zinc-900 text-white p-6 shadow-md mb-6 border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500 inline-block" />
            <span className="size-3 rounded-full bg-amber-500 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 font-mono text-xs text-zinc-400 flex items-center gap-1.5">
              <Terminal size={12} className="text-emerald-400" />
              <span>~/ashish-sahu/fullstack-resume.sh</span>
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            status: open_for_opportunities
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            {personalInfo.headline && (
              <p className="mt-1 text-sm font-medium text-emerald-400 font-mono">
                &gt; {personalInfo.headline}
              </p>
            )}
          </div>
          {personalInfo.location && (
            <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
              <MapPin size={13} className="text-zinc-500" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>

        {/* Contact links */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-300 font-mono border-t border-zinc-800/80 pt-3">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5 hover:text-white">
              <Mail size={12} className="text-emerald-400" />
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-emerald-400" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5 hover:text-white">
              <GithubIcon size={12} className="text-emerald-400" />
              <a href={personalInfo.github} target="_blank" rel="noreferrer">
                {personalInfo.github.replace("https://", "")}
              </a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5 hover:text-white">
              <LinkedinIcon size={12} className="text-blue-400" />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                {personalInfo.linkedin.replace("https://", "")}
              </a>
            </span>
          )}
          {personalInfo.portfolioUrl && (
            <span className="flex items-center gap-1.5 hover:text-white">
              <ExternalLink size={12} className="text-purple-400" />
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer">
                {personalInfo.portfolioUrl.replace("https://", "")}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5 mb-2">
            <span className="text-emerald-600">//</span> Summary
          </h2>
          <p className="text-zinc-700 leading-relaxed text-[12.5px] bg-zinc-50/70 p-3 rounded border border-zinc-200/60 font-sans">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills */}
      {hasSkills && (
        <section className="mb-5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5 mb-2.5">
            <span className="text-emerald-600">//</span> Technical Skills & Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
            {skills.languages && skills.languages.length > 0 && (
              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200/60">
                <span className="font-mono font-bold text-zinc-800 text-[11px] block mb-1">
                  Languages:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.languages.map((item, i) => (
                    <span
                      key={i}
                      className="inline-block rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-[11px] text-zinc-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skills.frontend && skills.frontend.length > 0 && (
              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200/60">
                <span className="font-mono font-bold text-blue-700 text-[11px] block mb-1">
                  Frontend:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.frontend.map((item, i) => (
                    <span
                      key={i}
                      className="inline-block rounded bg-blue-50 border border-blue-200/50 px-1.5 py-0.5 font-mono text-[11px] text-blue-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skills.backend && skills.backend.length > 0 && (
              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200/60">
                <span className="font-mono font-bold text-emerald-700 text-[11px] block mb-1">
                  Backend & APIs:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.backend.map((item, i) => (
                    <span
                      key={i}
                      className="inline-block rounded bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 font-mono text-[11px] text-emerald-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skills.databases && skills.databases.length > 0 && (
              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200/60">
                <span className="font-mono font-bold text-amber-700 text-[11px] block mb-1">
                  Databases:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.databases.map((item, i) => (
                    <span
                      key={i}
                      className="inline-block rounded bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 font-mono text-[11px] text-amber-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skills.toolsDevOps && skills.toolsDevOps.length > 0 && (
              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200/60 sm:col-span-2">
                <span className="font-mono font-bold text-purple-700 text-[11px] block mb-1">
                  DevOps, Cloud & Tooling:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.toolsDevOps.map((item, i) => (
                    <span
                      key={i}
                      className="inline-block rounded bg-purple-50 border border-purple-200/50 px-1.5 py-0.5 font-mono text-[11px] text-purple-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5 mb-3">
            <span className="text-emerald-600">//</span> Professional Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp, i) => (
              <div key={exp.id || i} className="border-l-2 border-emerald-500 pl-3.5 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-bold text-zinc-900 text-[13px] font-mono">
                    {exp.title}
                  </h3>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11.5px] text-zinc-600 font-medium">
                  <span className="text-emerald-700 font-semibold">{exp.company}</span>
                  {exp.location && <span>• {exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="mt-1.5 text-zinc-700 leading-relaxed whitespace-pre-line text-[12px]">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <span className="text-emerald-600">//</span> Featured Engineering Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((proj, i) => (
              <div
                key={proj.id || i}
                className="bg-zinc-50/80 p-3 rounded-md border border-zinc-200 flex flex-col justify-between break-inside-avoid"
                style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-mono font-bold text-zinc-900 text-[12.5px]">
                      {proj.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-600">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Source Code"
                          className="hover:text-zinc-900"
                        >
                          <GithubIcon size={12} />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Demo"
                          className="hover:text-emerald-600"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="mt-1 text-zinc-700 text-[11.5px] leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  )}
                </div>
                {(() => {
                  const techList = Array.isArray(proj.technologies)
                    ? proj.technologies
                    : typeof proj.technologies === "string"
                    ? proj.technologies.split(/[,|•]/).map((t) => t.trim()).filter(Boolean)
                    : [];

                  if (techList.length === 0) return null;

                  return (
                    <div className="mt-2 flex flex-wrap gap-1 pt-1.5 border-t border-zinc-200/50">
                      {techList.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 border border-zinc-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5 mb-2.5" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              <span className="text-emerald-600">//</span> Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu, i) => (
                <div key={edu.id || i} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-zinc-900 text-[12px]">
                      {edu.degree}
                    </h3>
                    <span className="font-mono text-[10.5px] text-zinc-500">
                      {edu.startYear ? `${edu.startYear} - ${edu.graduationYear}` : edu.graduationYear}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-[11.5px]">{edu.institution}</p>
                  {edu.details && (
                    <p className="text-zinc-500 text-[11px] mt-0.5">{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5 mb-2.5" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              <span className="text-emerald-600">//</span> Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={cert.id || i} className="text-[11.5px] break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-800">{cert.name}</span>
                    <span className="font-mono text-[10.5px] text-zinc-500">{cert.date}</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Honors & Key Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="mt-4 pt-3 border-t border-zinc-200/80 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <span className="text-emerald-600">//</span> Achievements & Awards
          </h2>
          <div className="space-y-1.5">
            {achievements.map((ach, i) => (
              <div key={ach.id || i} className="flex justify-between items-baseline text-[11.5px] break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <span className="font-semibold text-zinc-900">{ach.title}</span>
                {ach.description && <span className="text-zinc-500 text-[11px]">{ach.description}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
