import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../../components/icons";

export default function TemplateExecutiveSidebar({ data }) {
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
    <div className="w-full bg-white font-sans text-[12px] leading-normal shadow-sm flex flex-col md:flex-row min-h-[1050px]">
      {/* Left Sidebar (32% width) */}
      <aside className="w-full md:w-[34%] bg-slate-900 text-slate-100 p-7 flex flex-col gap-6">
        {/* Profile Details */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            {personalInfo.fullName || "Your Name"}
          </h2>
          {personalInfo.headline && (
            <p className="mt-1 text-xs font-semibold text-sky-400">
              {personalInfo.headline}
            </p>
          )}
        </div>

        {/* Contact info list */}
        <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-4">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            Contact Details
          </span>
          {personalInfo.email && (
            <p className="flex items-center gap-2 truncate">
              <Mail size={12} className="text-sky-400 shrink-0" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-white truncate">
                {personalInfo.email}
              </a>
            </p>
          )}
          {personalInfo.phone && (
            <p className="flex items-center gap-2">
              <Phone size={12} className="text-sky-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </p>
          )}
          {personalInfo.location && (
            <p className="flex items-center gap-2">
              <MapPin size={12} className="text-sky-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </p>
          )}
          {personalInfo.linkedin && (
            <p className="flex items-center gap-2 truncate">
              <LinkedinIcon size={12} className="text-sky-400 shrink-0" />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-white truncate">
                LinkedIn Profile
              </a>
            </p>
          )}
          {personalInfo.github && (
            <p className="flex items-center gap-2 truncate">
              <GithubIcon size={12} className="text-sky-400 shrink-0" />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-white truncate">
                GitHub Repositories
              </a>
            </p>
          )}
          {personalInfo.portfolioUrl && (
            <p className="flex items-center gap-2 truncate">
              <ExternalLink size={12} className="text-sky-400 shrink-0" />
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-white truncate">
                Live Portfolio
              </a>
            </p>
          )}
        </div>

        {/* Skills list */}
        {hasSkills && (
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Core Skills
            </span>
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <span className="text-[10.5px] font-semibold text-sky-300 block mb-1">
                  Languages
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.languages.map((s) => (
                    <span key={s} className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.frontend && skills.frontend.length > 0 && (
              <div>
                <span className="text-[10.5px] font-semibold text-sky-300 block mb-1">
                  Frontend
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.frontend.map((s) => (
                    <span key={s} className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.backend && skills.backend.length > 0 && (
              <div>
                <span className="text-[10.5px] font-semibold text-sky-300 block mb-1">
                  Backend & APIs
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.backend.map((s) => (
                    <span key={s} className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.databases && skills.databases.length > 0 && (
              <div>
                <span className="text-[10.5px] font-semibold text-sky-300 block mb-1">
                  Databases
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.databases.map((s) => (
                    <span key={s} className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.toolsDevOps && skills.toolsDevOps.length > 0 && (
              <div>
                <span className="text-[10.5px] font-semibold text-sky-300 block mb-1">
                  DevOps & Tools
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.toolsDevOps.map((s) => (
                    <span key={s} className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Education in sidebar */}
        {education && education.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Education
            </span>
            {education.map((edu) => (
              <div key={edu.id} className="text-[11px]">
                <strong className="text-white block">{edu.degree}</strong>
                <span className="text-slate-300 block">{edu.institution}</span>
                <span className="text-sky-400 text-[10px] font-mono">
                  {edu.graduationYear} {edu.gradeGpa && `(${edu.gradeGpa})`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications in sidebar */}
        {certifications && certifications.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Certifications
            </span>
            {certifications.map((c) => (
              <div key={c.id} className="text-[11px]">
                <strong className="text-white block">{c.name}</strong>
                <span className="text-slate-400 text-[10px]">
                  {c.issuer} ({c.date})
                </span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Right Content Area (66% width) */}
      <main className="w-full md:w-[66%] p-8 space-y-5 text-slate-800">
        {/* Executive Summary */}
        {summary && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-2">
              Executive Profile
            </h3>
            <p className="text-[12px] leading-relaxed text-slate-700 text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Professional Experience
            </h3>
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-[13px] text-slate-900">
                      {exp.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold text-sky-700">
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="mt-1 text-[11.5px] leading-relaxed text-slate-700 whitespace-pre-line">
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
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Technical Project Deliverables
            </h3>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-[13px] text-slate-900">
                      {proj.name}
                    </h4>
                    <div className="space-x-2 text-[10.5px]">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                          GitHub
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.technologies && (
                    <p className="text-[11px] font-mono text-sky-800">
                      Stack: {proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-700">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Recognitions & Milestones
            </h3>
            <div className="space-y-1.5 text-[11.5px]">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-baseline break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div>
                    <strong className="text-slate-900">{ach.title}</strong>
                    <span className="text-slate-600 block text-[11px]">
                      {ach.issuer} — {ach.description}
                    </span>
                  </div>
                  {ach.year && (
                    <span className="text-slate-500 font-mono text-[10.5px]">
                      {ach.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
