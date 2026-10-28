import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../../components/icons";

export default function TemplateCompact({ data }) {
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
    <div className="w-full bg-white text-zinc-900 font-sans p-6 sm:p-8 text-[11.5px] leading-snug shadow-sm">
      {/* Condensed Top Header */}
      <header className="border-b-2 border-zinc-900 pb-3 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            {personalInfo.headline && (
              <p className="text-xs font-semibold text-zinc-700 tracking-wide">
                {personalInfo.headline}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-zinc-600 sm:justify-end">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={11} className="text-zinc-500" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone size={11} className="text-zinc-500" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-zinc-500" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <GithubIcon size={11} className="text-zinc-700" />
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub
                </a>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinIcon size={11} className="text-blue-700" />
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Two-Column Dense Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column (Skills, Education, Certs) - 4 cols */}
        <div className="md:col-span-4 space-y-3.5 border-r md:border-zinc-200 md:pr-4">
          {/* Skills */}
          {hasSkills && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-2">
                Technical Stack
              </h2>
              <div className="space-y-2 text-[10.5px]">
                {skills.languages?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-900 block text-[10px] uppercase text-zinc-500">Languages</span>
                    <p className="text-zinc-700 font-medium">{Array.isArray(skills.languages) ? skills.languages.join(", ") : skills.languages}</p>
                  </div>
                )}
                {skills.frontend?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-900 block text-[10px] uppercase text-zinc-500">Frontend</span>
                    <p className="text-zinc-700 font-medium">{Array.isArray(skills.frontend) ? skills.frontend.join(", ") : skills.frontend}</p>
                  </div>
                )}
                {skills.backend?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-900 block text-[10px] uppercase text-zinc-500">Backend & APIs</span>
                    <p className="text-zinc-700 font-medium">{Array.isArray(skills.backend) ? skills.backend.join(", ") : skills.backend}</p>
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-900 block text-[10px] uppercase text-zinc-500">Databases</span>
                    <p className="text-zinc-700 font-medium">{Array.isArray(skills.databases) ? skills.databases.join(", ") : skills.databases}</p>
                  </div>
                )}
                {skills.toolsDevOps?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-900 block text-[10px] uppercase text-zinc-500">Tools & Cloud</span>
                    <p className="text-zinc-700 font-medium">{Array.isArray(skills.toolsDevOps) ? skills.toolsDevOps.join(", ") : skills.toolsDevOps}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-2">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu, i) => (
                  <div key={edu.id || i} className="text-[10.5px]">
                    <div className="font-bold text-zinc-900">{edu.degree}</div>
                    <div className="text-zinc-600">{edu.institution}</div>
                    <div className="text-zinc-500 text-[10px]">
                      {edu.startYear ? `${edu.startYear} - ${edu.graduationYear}` : edu.graduationYear}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-2">
                Certifications
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {certifications.map((cert, i) => (
                  <div key={cert.id || i}>
                    <span className="font-semibold text-zinc-900 block">{cert.name}</span>
                    <span className="text-zinc-500 text-[10px]">{cert.issuer} {cert.date ? `(${cert.date})` : ""}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-2">
                Key Highlights
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {achievements.map((ach, i) => (
                  <div key={ach.id || i}>
                    <span className="font-bold text-zinc-900 block">{ach.title}</span>
                    <p className="text-zinc-600 text-[10px]">{ach.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Summary, Experience, Projects) - 8 cols */}
        <div className="md:col-span-8 space-y-3.5">
          {/* Summary */}
          {summary && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-1.5">
                Executive Profile
              </h2>
              <p className="text-zinc-700 leading-normal text-[11px]">
                {summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {workExperience?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
                Work Experience
              </h2>
              <div className="space-y-2.5">
                {workExperience.map((exp, i) => (
                  <div key={exp.id || i} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-zinc-900 text-[11.5px]">{exp.title}</span>
                      <span className="text-zinc-500 text-[10px] font-medium">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-zinc-700 font-semibold text-[10.5px]">
                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                    </div>
                    {exp.description && (
                      <p className="mt-1 text-zinc-600 leading-normal whitespace-pre-line text-[10.5px]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects */}
          {projects?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
                Key Engineering Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj, i) => (
                  <div key={proj.id || i} className="bg-zinc-50/70 p-2 rounded border border-zinc-200/80 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900 text-[11px]">{proj.name}</span>
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            <ExternalLink size={10} />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-zinc-900">
                            <GithubIcon size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="mt-0.5 text-zinc-600 text-[10.5px] leading-tight">
                        {proj.description}
                      </p>
                    )}
                    {(() => {
                      const techList = Array.isArray(proj.technologies)
                        ? proj.technologies
                        : typeof proj.technologies === "string"
                        ? proj.technologies.split(/[,|•]/).map((t) => t.trim()).filter(Boolean)
                        : [];

                      if (techList.length === 0) return null;

                      return (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {techList.map((tech, tidx) => (
                            <span
                              key={tidx}
                              className="bg-white border border-zinc-200 px-1 py-0.2 rounded text-[9.5px] font-mono text-zinc-700"
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
        </div>
      </div>
    </div>
  );
}
