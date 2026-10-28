import {
  ExternalLink,
  FolderGit2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../../components/icons";

export default function TemplateEditorial({ data }) {
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
    <div className="w-full bg-[#FAF9F6] text-[#1E201E] font-sans p-8 sm:p-12 text-[12.5px] leading-relaxed shadow-sm">
      {/* Editorial Header */}
      <header className="border-b-2 border-[#24483A] pb-5 mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-[#24483A] uppercase font-bold block mb-1">
            Curriculum Vitae
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          {personalInfo.headline && (
            <p className="mt-1 text-sm font-medium italic text-[#596150] font-serif">
              {personalInfo.headline}
            </p>
          )}
        </div>

        {/* Contact info metadata grid */}
        <div className="flex flex-col gap-1 text-[11px] font-mono text-[#4A4D46]">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-[#24483A]" />
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                {personalInfo.email}
              </a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-[#24483A]" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-[#24483A]" />
              <span>{personalInfo.location}</span>
            </span>
          )}
          <div className="flex items-center gap-2 pt-0.5">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#24483A]">
                <LinkedinIcon size={13} />
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-[#24483A]">
                <GithubIcon size={13} />
              </a>
            )}
            {personalInfo.portfolioUrl && (
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-[#24483A]">
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="font-serif text-[13px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-[12px] text-justify text-[#2D302B] leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills */}
      {hasSkills && (
        <section className="mb-5">
          <h2 className="font-serif text-[13px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-2">
            Technical Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
            {skills.languages && skills.languages.length > 0 && (
              <p>
                <strong className="text-[#171717] font-semibold">Languages: </strong>
                <span className="text-[#4A4D46]">{skills.languages.join(", ")}</span>
              </p>
            )}
            {skills.frontend && skills.frontend.length > 0 && (
              <p>
                <strong className="text-[#171717] font-semibold">Frontend: </strong>
                <span className="text-[#4A4D46]">{skills.frontend.join(", ")}</span>
              </p>
            )}
            {skills.backend && skills.backend.length > 0 && (
              <p>
                <strong className="text-[#171717] font-semibold">Backend: </strong>
                <span className="text-[#4A4D46]">{skills.backend.join(", ")}</span>
              </p>
            )}
            {skills.databases && skills.databases.length > 0 && (
              <p>
                <strong className="text-[#171717] font-semibold">Databases: </strong>
                <span className="text-[#4A4D46]">{skills.databases.join(", ")}</span>
              </p>
            )}
            {skills.toolsDevOps && skills.toolsDevOps.length > 0 && (
              <p className="sm:col-span-2">
                <strong className="text-[#171717] font-semibold">Tools & Infrastructure: </strong>
                <span className="text-[#4A4D46]">{skills.toolsDevOps.join(", ")}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="font-serif text-[13px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Experience History
          </h2>
          <div className="space-y-3.5">
            {workExperience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif font-bold text-[13.5px] text-[#171717]">
                    {exp.title}
                  </h3>
                  <span className="font-mono text-[10.5px] text-[#596150]">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#24483A] font-semibold">
                  {exp.company} {exp.location && `· ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[#3C4039] whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="font-serif text-[13px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Selected Software Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-[13px] text-[#171717]">
                      {proj.name}
                    </h3>
                    {proj.technologies && (
                      <span className="font-mono text-[10px] text-[#596150]">
                        [{proj.technologies}]
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10.5px] font-mono">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[#24483A] hover:underline flex items-center gap-1">
                        <FolderGit2 size={11} /> Repo
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[#24483A] hover:underline flex items-center gap-1">
                        <ExternalLink size={11} /> Live
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#3C4039]">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="font-serif text-[13px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Academic Background
          </h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div>
                  <h3 className="font-serif font-bold text-[12.5px] text-[#171717]">
                    {edu.degree}
                  </h3>
                  <p className="text-[11.5px] text-[#4A4D46]">
                    {edu.institution} {edu.location && `· ${edu.location}`}{" "}
                    {edu.gradeGpa && <span className="font-mono font-medium">({edu.gradeGpa})</span>}
                  </p>
                  {edu.details && (
                    <p className="text-[11px] text-[#596150] mt-0.5">{edu.details}</p>
                  )}
                </div>
                <span className="font-mono text-[10.5px] text-[#596150] shrink-0">
                  {edu.graduationYear}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="font-serif text-[12px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Certifications
            </h2>
            <ul className="space-y-1 text-[11px] text-[#4A4D46]">
              {certifications.map((c) => (
                <li key={c.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <strong className="text-[#171717]">{c.name}</strong> — {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </section>
        )}

        {achievements && achievements.length > 0 && (
          <section>
            <h2 className="font-serif text-[12px] font-bold tracking-wider text-[#24483A] uppercase border-b border-[#D8D4C8] pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Recognitions
            </h2>
            <ul className="space-y-1 text-[11px] text-[#4A4D46]">
              {achievements.map((a) => (
                <li key={a.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <strong className="text-[#171717]">{a.title}</strong> — {a.issuer} ({a.year})
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
