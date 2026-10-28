export default function TemplateClassicATS({ data }) {
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
    <div className="w-full bg-white text-black font-serif p-8 sm:p-12 text-[12.5px] leading-relaxed shadow-sm">
      {/* Header */}
      <header className="text-center border-b border-black pb-4 mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-normal uppercase text-black">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.headline && (
          <p className="mt-1 text-sm font-semibold italic text-neutral-800">
            {personalInfo.headline}
          </p>
        )}

        <div className="mt-2 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-neutral-700 font-sans">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && (
            <span>
              • <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              • <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              • <a href={personalInfo.github} target="_blank" rel="noreferrer" className="underline">GitHub</a>
            </span>
          )}
          {personalInfo.portfolioUrl && (
            <span>
              • <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline">Portfolio</a>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 font-sans">
            Professional Summary
          </h2>
          <p className="text-[12px] text-justify text-neutral-900 leading-normal font-sans">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills */}
      {hasSkills && (
        <section className="mb-4 font-sans text-[12px]">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 font-sans">
            Technical Skills
          </h2>
          <div className="space-y-1">
            {skills.languages && skills.languages.length > 0 && (
              <p>
                <strong>Languages:</strong> {skills.languages.join(", ")}
              </p>
            )}
            {skills.frontend && skills.frontend.length > 0 && (
              <p>
                <strong>Frontend:</strong> {skills.frontend.join(", ")}
              </p>
            )}
            {skills.backend && skills.backend.length > 0 && (
              <p>
                <strong>Backend & APIs:</strong> {skills.backend.join(", ")}
              </p>
            )}
            {skills.databases && skills.databases.length > 0 && (
              <p>
                <strong>Databases:</strong> {skills.databases.join(", ")}
              </p>
            )}
            {skills.toolsDevOps && skills.toolsDevOps.length > 0 && (
              <p>
                <strong>Tools & Platforms:</strong> {skills.toolsDevOps.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-2 font-sans" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Professional Experience
          </h2>
          <div className="space-y-3 font-sans">
            {workExperience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-baseline text-[12.5px]">
                  <strong>{exp.company} {exp.location && `— ${exp.location}`}</strong>
                  <span className="text-[11px] text-neutral-600">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="italic text-[12px] text-neutral-800 font-serif">
                  {exp.title}
                </div>
                {exp.description && (
                  <p className="mt-1 text-[11.5px] leading-relaxed text-neutral-900 whitespace-pre-line">
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
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-2 font-sans" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Technical Projects
          </h2>
          <div className="space-y-2.5 font-sans">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="flex justify-between items-baseline text-[12.5px]">
                  <div>
                    <strong>{proj.name}</strong>
                    {proj.technologies && (
                      <span className="text-neutral-600 text-[11px] italic ml-1">
                        | {proj.technologies}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] space-x-2 shrink-0">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline">
                        Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline">
                        Demo
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-800">
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
        <section className="mb-4 font-sans">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 font-sans" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Education
          </h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div>
                  <strong>{edu.institution}</strong> {edu.location && `— ${edu.location}`}
                  <div className="text-[11.5px] text-neutral-800 font-serif italic">
                    {edu.degree} {edu.gradeGpa && `(${edu.gradeGpa})`}
                  </div>
                  {edu.details && (
                    <p className="text-[11px] text-neutral-600">{edu.details}</p>
                  )}
                </div>
                <span className="text-[11px] text-neutral-600 shrink-0">
                  {edu.graduationYear}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="font-sans text-[11.5px] break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-400 pb-0.5 mb-1.5 font-sans" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            Certifications & Accomplishments
          </h2>
          <div className="space-y-1">
            {certifications.map((c) => (
              <p key={c.id}>
                <strong>{c.name}</strong> — {c.issuer} ({c.date})
              </p>
            ))}
            {achievements.map((a) => (
              <p key={a.id}>
                <strong>{a.title}</strong> — {a.issuer} ({a.year}): {a.description}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
