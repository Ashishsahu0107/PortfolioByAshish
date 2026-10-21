import { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Code2,
  FolderGit2,
  GraduationCap,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useResume } from "../context/ResumeContext";

export default function ResumeEditor() {
  const {
    resumeData,
    updatePersonalInfo,
    updateSummary,
    updateSkills,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification,
    addAchievement,
    updateAchievement,
    deleteAchievement,
  } = useResume();

  const [activeSection, setActiveSection] = useState("personal");

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? "" : id);
  };

  const {
    personalInfo = {},
    summary = "",
    skills = {},
    workExperience = [],
    projects = [],
    education = [],
    certifications = [],
    achievements = [],
  } = resumeData;

  const handleSkillChange = (category, value) => {
    const list = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateSkills(category, list);
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-6 bg-zinc-50 border-r border-zinc-200">
      {/* 1. Personal Information */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("personal")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <User size={15} />
            </span>
            <span className="text-sm font-bold">Personal Information</span>
          </div>
          {activeSection === "personal" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "personal" && (
          <div className="border-t border-zinc-100 p-4 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName || ""}
                  onChange={(e) =>
                    updatePersonalInfo("fullName", e.target.value)
                  }
                  placeholder="e.g. Ashish Sahu"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Professional Headline *
                </label>
                <input
                  type="text"
                  value={personalInfo.headline || ""}
                  onChange={(e) =>
                    updatePersonalInfo("headline", e.target.value)
                  }
                  placeholder="e.g. Full Stack Developer | MERN & React Specialist"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={personalInfo.email || ""}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  placeholder="ashish@example.com"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone || ""}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Location / City
                </label>
                <input
                  type="text"
                  value={personalInfo.location || ""}
                  onChange={(e) =>
                    updatePersonalInfo("location", e.target.value)
                  }
                  placeholder="e.g. India (Open to Remote)"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={personalInfo.linkedin || ""}
                  onChange={(e) =>
                    updatePersonalInfo("linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={personalInfo.github || ""}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                  placeholder="https://github.com/username"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Portfolio / Website URL
                </label>
                <input
                  type="url"
                  value={personalInfo.portfolioUrl || ""}
                  onChange={(e) =>
                    updatePersonalInfo("portfolioUrl", e.target.value)
                  }
                  placeholder="https://iamashish.vercel.app"
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("summary")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <BookOpen size={15} />
            </span>
            <span className="text-sm font-bold">Professional Summary</span>
          </div>
          {activeSection === "summary" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "summary" && (
          <div className="border-t border-zinc-100 p-4">
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Summary Statement
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Highlight your full stack experience, core competencies (React, Node, MongoDB), and career trajectory..."
              className="w-full rounded-md border border-zinc-200 bg-zinc-50/50 p-3 text-xs leading-relaxed text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        )}
      </div>

      {/* 3. Technical Skills */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("skills")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <Code2 size={15} />
            </span>
            <span className="text-sm font-bold">Technical Skills</span>
          </div>
          {activeSection === "skills" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "skills" && (
          <div className="border-t border-zinc-100 p-4 space-y-3">
            <p className="text-[11px] text-zinc-500 italic mb-2">
              Tip: Enter skills separated by commas (e.g. JavaScript,
              TypeScript, Java)
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                Programming Languages
              </label>
              <input
                type="text"
                value={(skills.languages || []).join(", ")}
                onChange={(e) => handleSkillChange("languages", e.target.value)}
                placeholder="JavaScript, TypeScript, Java, SQL, HTML5, CSS3"
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                Frontend Technologies
              </label>
              <input
                type="text"
                value={(skills.frontend || []).join(", ")}
                onChange={(e) => handleSkillChange("frontend", e.target.value)}
                placeholder="React 19, Next.js, Tailwind CSS, Redux, GSAP"
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                Backend & APIs
              </label>
              <input
                type="text"
                value={(skills.backend || []).join(", ")}
                onChange={(e) => handleSkillChange("backend", e.target.value)}
                placeholder="Node.js, Express.js, REST APIs, JWT Auth, WebSockets"
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                Databases & Storage
              </label>
              <input
                type="text"
                value={(skills.databases || []).join(", ")}
                onChange={(e) => handleSkillChange("databases", e.target.value)}
                placeholder="MongoDB, Mongoose, MySQL, PostgreSQL, Redis"
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                Tools & DevOps
              </label>
              <input
                type="text"
                value={(skills.toolsDevOps || []).join(", ")}
                onChange={(e) =>
                  handleSkillChange("toolsDevOps", e.target.value)
                }
                placeholder="Git, GitHub, Postman, Docker, Vercel, VS Code"
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Work Experience */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("experience")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <Briefcase size={15} />
            </span>
            <span className="text-sm font-bold">
              Work Experience ({workExperience.length})
            </span>
          </div>
          {activeSection === "experience" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "experience" && (
          <div className="border-t border-zinc-100 p-4 space-y-4">
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Position</span>
            </button>

            {workExperience.map((exp, idx) => (
              <div
                key={exp.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700">
                    Experience #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExperience(exp.id)}
                    className="text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    title="Remove experience entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(exp.id, "title", e.target.value)
                      }
                      placeholder="e.g. Full Stack Developer"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                      placeholder="e.g. Acme Tech Solutions"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(exp.id, "location", e.target.value)
                      }
                      placeholder="Remote / City, Country"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10.5px] font-semibold text-zinc-600">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                        placeholder="Jan 2024"
                        className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10.5px] font-semibold text-zinc-600">
                        End Date
                      </label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? "Present" : exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        placeholder="Present"
                        className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current || false}
                    onChange={(e) =>
                      updateExperience(exp.id, "current", e.target.checked)
                    }
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`current-${exp.id}`}
                    className="text-xs text-zinc-600"
                  >
                    Currently working here
                  </label>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-zinc-600">
                    Responsibilities & Achievements (bullet points)
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    placeholder="• Built REST APIs and scalable backend microservices...&#10;• Designed accessible frontend in React 19..."
                    className="mt-1 w-full rounded border border-zinc-200 bg-white p-2.5 text-xs leading-relaxed text-zinc-900"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Projects */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("projects")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <FolderGit2 size={15} />
            </span>
            <span className="text-sm font-bold">
              Software Projects ({projects.length})
            </span>
          </div>
          {activeSection === "projects" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "projects" && (
          <div className="border-t border-zinc-100 p-4 space-y-4">
            <button
              type="button"
              onClick={addProject}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Project</span>
            </button>

            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700">
                    Project #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteProject(proj.id)}
                    className="text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    title="Remove project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) =>
                        updateProject(proj.id, "name", e.target.value)
                      }
                      placeholder="e.g. MERN Learning Management System"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) =>
                        updateProject(proj.id, "technologies", e.target.value)
                      }
                      placeholder="React, Node.js, Express, MongoDB, Tailwind"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={proj.githubUrl}
                      onChange={(e) =>
                        updateProject(proj.id, "githubUrl", e.target.value)
                      }
                      placeholder="https://github.com/username/project"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={proj.liveUrl}
                      onChange={(e) =>
                        updateProject(proj.id, "liveUrl", e.target.value)
                      }
                      placeholder="https://project-demo.vercel.app"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-zinc-600">
                    Project Narrative & Architecture Description
                  </label>
                  <textarea
                    rows={3}
                    value={proj.description}
                    onChange={(e) =>
                      updateProject(proj.id, "description", e.target.value)
                    }
                    placeholder="Full stack platform with role-based auth, automated quizzes, and student analytics..."
                    className="mt-1 w-full rounded border border-zinc-200 bg-white p-2.5 text-xs leading-relaxed text-zinc-900"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Education */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("education")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <GraduationCap size={15} />
            </span>
            <span className="text-sm font-bold">
              Education ({education.length})
            </span>
          </div>
          {activeSection === "education" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "education" && (
          <div className="border-t border-zinc-100 p-4 space-y-4">
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Education</span>
            </button>

            {education.map((edu, idx) => (
              <div
                key={edu.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700">
                    Degree #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteEducation(edu.id)}
                    className="text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    title="Remove education"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Degree Title
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                      placeholder="B.Tech in Computer Science & Engineering"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Institution / University
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, "institution", e.target.value)
                      }
                      placeholder="e.g. Technical University"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Graduation Year / Period
                    </label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) =>
                        updateEducation(
                          edu.id,
                          "graduationYear",
                          e.target.value,
                        )
                      }
                      placeholder="2022 — 2026"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-zinc-600">
                      Grade / GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gradeGpa}
                      onChange={(e) =>
                        updateEducation(edu.id, "gradeGpa", e.target.value)
                      }
                      placeholder="8.5 / 10 CGPA"
                      className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-zinc-600">
                    Coursework / Relevant Details
                  </label>
                  <input
                    type="text"
                    value={edu.details}
                    onChange={(e) =>
                      updateEducation(edu.id, "details", e.target.value)
                    }
                    placeholder="Core: Data Structures, Algorithms, DBMS, Operating Systems"
                    className="mt-1 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Certifications */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("certifications")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <Award size={15} />
            </span>
            <span className="text-sm font-bold">
              Certifications ({certifications.length})
            </span>
          </div>
          {activeSection === "certifications" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "certifications" && (
          <div className="border-t border-zinc-100 p-4 space-y-3">
            <button
              type="button"
              onClick={addCertification}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Certification</span>
            </button>

            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-2.5"
              >
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, "name", e.target.value)
                  }
                  placeholder="Certification Name"
                  className="flex-1 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, "issuer", e.target.value)
                  }
                  placeholder="Issuer"
                  className="w-32 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                />
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) =>
                    updateCertification(cert.id, "date", e.target.value)
                  }
                  placeholder="Year"
                  className="w-20 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => deleteCertification(cert.id)}
                  className="text-zinc-400 hover:text-red-600 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. Achievements */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("achievements")}
          className="flex w-full items-center justify-between p-4 text-left font-semibold text-zinc-900 transition hover:bg-zinc-50/80 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600">
              <Award size={15} />
            </span>
            <span className="text-sm font-bold">
              Achievements & Awards ({achievements.length})
            </span>
          </div>
          {activeSection === "achievements" ? (
            <ChevronUp size={16} className="text-zinc-400" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400" />
          )}
        </button>

        {activeSection === "achievements" && (
          <div className="border-t border-zinc-100 p-4 space-y-3">
            <button
              type="button"
              onClick={addAchievement}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Achievement</span>
            </button>

            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) =>
                      updateAchievement(ach.id, "title", e.target.value)
                    }
                    placeholder="Achievement Title (e.g. Solved 200+ DSA Problems)"
                    className="flex-1 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                  <input
                    type="text"
                    value={ach.year}
                    onChange={(e) =>
                      updateAchievement(ach.id, "year", e.target.value)
                    }
                    placeholder="Year"
                    className="w-20 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={() => deleteAchievement(ach.id)}
                    className="text-zinc-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={ach.description}
                  onChange={(e) =>
                    updateAchievement(ach.id, "description", e.target.value)
                  }
                  placeholder="Details / context of accomplishment"
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
