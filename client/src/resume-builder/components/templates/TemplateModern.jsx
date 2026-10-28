import {
  ExternalLink,
  FolderGit2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../../components/icons";

export default function TemplateModern({ data }) {
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
    <div className="w-full bg-white text-zinc-900 font-sans p-8 sm:p-11 text-[13px] leading-normal shadow-sm">
      {/* Top Header */}
      <header className="border-b-2 border-blue-600 pb-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.headline && (
          <p className="mt-1 text-base font-semibold text-blue-600">
            {personalInfo.headline}
          </p>
        )}

        {/* Contact Links Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-blue-600" />
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                {personalInfo.email}
              </a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-blue-600" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-blue-600" />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <LinkedinIcon size={12} className="text-blue-600" />
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <GithubIcon size={12} className="text-blue-600" />
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </span>
          )}
          {personalInfo.portfolioUrl && (
            <span className="flex items-center gap-1.5">
              <ExternalLink size={12} className="text-blue-600" />
              <a
                href={personalInfo.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Portfolio
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2 border-b border-zinc-200 pb-1 mb-2">
            <span>Professional Summary</span>
          </h2>
          <p className="text-[12px] leading-relaxed text-zinc-700 text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills */}
      {hasSkills && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2 border-b border-zinc-200 pb-1 mb-2.5">
            <span>Technical Skills</span>
          </h2>
          <div className="space-y-1.5 text-[12px]">
            {skills.languages && skills.languages.length > 0 && (
              <p>
                <strong className="text-zinc-900 font-semibold">Languages: </strong>
                <span className="text-zinc-700">{skills.languages.join(", ")}</span>
              </p>
            )}
            {skills.frontend && skills.frontend.length > 0 && (
              <p>
                <strong className="text-zinc-900 font-semibold">Frontend: </strong>
                <span className="text-zinc-700">{skills.frontend.join(", ")}</span>
              </p>
            )}
            {skills.backend && skills.backend.length > 0 && (
              <p>
                <strong className="text-zinc-900 font-semibold">Backend & APIs: </strong>
                <span className="text-zinc-700">{skills.backend.join(", ")}</span>
              </p>
            )}
            {skills.databases && skills.databases.length > 0 && (
              <p>
                <strong className="text-zinc-900 font-semibold">Databases & Storage: </strong>
                <span className="text-zinc-700">{skills.databases.join(", ")}</span>
              </p>
            )}
            {skills.toolsDevOps && skills.toolsDevOps.length > 0 && (
              <p>
                <strong className="text-zinc-900 font-semibold">Tools & DevOps: </strong>
                <span className="text-zinc-700">{skills.toolsDevOps.join(", ")}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2 border-b border-zinc-200 pb-1 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <span>Work Experience</span>
          </h2>
          <div className="space-y-3.5">
            {workExperience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold text-[13px] text-zinc-900">
                    {exp.title}
                  </h3>
                  <span className="text-[11px] font-medium text-zinc-500">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-[12px] font-medium text-blue-700">
                  {exp.company} {exp.location && `· ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-700 whitespace-pre-line">
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
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2 border-b border-zinc-200 pb-1 mb-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <span>Featured Projects</span>
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[13px] text-zinc-900">
                      {proj.name}
                    </h3>
                    {proj.technologies && (
                      <span className="text-[10.5px] text-zinc-500 font-mono">
                        ({proj.technologies})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FolderGit2 size={11} /> Source
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={11} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-zinc-700">
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
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2 border-b border-zinc-200 pb-1 mb-2.5" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <span>Education</span>
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline gap-2 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div>
                  <h3 className="font-bold text-[12.5px] text-zinc-900">
                    {edu.degree}
                  </h3>
                  <p className="text-[11.5px] text-zinc-700">
                    {edu.institution} {edu.location && `· ${edu.location}`}{" "}
                    {edu.gradeGpa && <span className="font-medium">({edu.gradeGpa})</span>}
                  </p>
                  {edu.details && (
                    <p className="text-[11px] text-zinc-600 mt-0.5">{edu.details}</p>
                  )}
                </div>
                <span className="text-[11px] font-medium text-zinc-500 shrink-0">
                  {edu.graduationYear}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements in 2 columns */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-200 pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Certifications
            </h2>
            <ul className="space-y-1.5 text-[11.5px] text-zinc-700">
              {certifications.map((cert) => (
                <li key={cert.id} className="flex justify-between items-start gap-1 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div>
                    <span className="font-semibold text-zinc-900">{cert.name}</span>
                    <span className="text-zinc-500 block text-[10.5px]">
                      {cert.issuer}
                    </span>
                  </div>
                  {cert.date && (
                    <span className="text-zinc-400 text-[10.5px] shrink-0">
                      {cert.date}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {achievements && achievements.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-zinc-200 pb-1 mb-2" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              Key Achievements
            </h2>
            <ul className="space-y-1.5 text-[11.5px] text-zinc-700">
              {achievements.map((ach) => (
                <li key={ach.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline gap-1">
                    <span className="font-semibold text-zinc-900">{ach.title}</span>
                    {ach.year && (
                      <span className="text-zinc-400 text-[10.5px]">{ach.year}</span>
                    )}
                  </div>
                  {ach.description && (
                    <p className="text-[11px] text-zinc-600 leading-snug">
                      {ach.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
