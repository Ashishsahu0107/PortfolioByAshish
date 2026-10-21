import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { sampleResumeData, emptyResumeData } from "../sampleData";

const STORAGE_KEY = "fullstack-resume-builder-data-v2";
const TEMPLATE_KEY = "fullstack-resume-builder-template-v2";

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  // Load saved resume or default to rich sample data on first visit
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to read resume from localStorage:", e);
    }
    return sampleResumeData;
  });

  const [activeTemplate, setActiveTemplate] = useState(() => {
    try {
      const saved = localStorage.getItem(TEMPLATE_KEY);
      if (saved) return saved;
    } catch {}
    return "modern";
  });

  const [isExporting, setIsExporting] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (e) {
      console.warn("Failed to save resume data:", e);
    }
  }, [resumeData]);

  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATE_KEY, activeTemplate);
    } catch {}
  }, [activeTemplate]);

  // Update Personal Information
  const updatePersonalInfo = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Update Summary
  const updateSummary = (value) => {
    setResumeData((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  // Update Skills category
  const updateSkills = (category, skillsArray) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: Array.isArray(skillsArray) ? skillsArray : [],
      },
    }));
  };

  // Work Experience Handlers
  const addExperience = () => {
    const newExp = {
      id: "exp-" + Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      workExperience: [newExp, ...prev.workExperience],
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const deleteExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((item) => item.id !== id),
    }));
  };

  // Project Handlers
  const addProject = () => {
    const newProj = {
      id: "proj-" + Date.now(),
      name: "",
      technologies: "",
      description: "",
      githubUrl: "",
      liveUrl: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const updateProject = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const deleteProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu = {
      id: "edu-" + Date.now(),
      degree: "",
      institution: "",
      location: "",
      graduationYear: "",
      gradeGpa: "",
      details: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [newEdu, ...prev.education],
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const deleteEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  // Certification Handlers
  const addCertification = () => {
    const newCert = {
      id: "cert-" + Date.now(),
      name: "",
      issuer: "",
      date: "",
      credentialUrl: "",
    };
    setResumeData((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
  };

  const updateCertification = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const deleteCertification = (id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  };

  // Achievement Handlers
  const addAchievement = () => {
    const newAch = {
      id: "ach-" + Date.now(),
      title: "",
      issuer: "",
      year: "",
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      achievements: [newAch, ...prev.achievements],
    }));
  };

  const updateAchievement = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const deleteAchievement = (id) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((item) => item.id !== id),
    }));
  };

  // Reset & Sample data actions
  const loadSampleData = () => {
    setResumeData(sampleResumeData);
  };

  const clearResumeData = () => {
    setResumeData(emptyResumeData);
  };

  // Calculate dynamic completion score (0 to 100%)
  const completionPercentage = useMemo(() => {
    let score = 0;
    const { personalInfo, summary, skills, workExperience, projects, education } = resumeData;

    // Contact info (25 pts)
    if (personalInfo.fullName?.trim()) score += 7;
    if (personalInfo.headline?.trim()) score += 4;
    if (personalInfo.email?.trim()) score += 5;
    if (personalInfo.phone?.trim()) score += 3;
    if (personalInfo.location?.trim()) score += 2;
    if (personalInfo.github?.trim() || personalInfo.linkedin?.trim()) score += 4;

    // Summary (15 pts)
    if (summary && summary.trim().length > 30) score += 15;

    // Skills (20 pts)
    const totalSkills =
      (skills.languages?.length || 0) +
      (skills.frontend?.length || 0) +
      (skills.backend?.length || 0) +
      (skills.databases?.length || 0);
    if (totalSkills >= 8) score += 20;
    else if (totalSkills >= 4) score += 12;
    else if (totalSkills > 0) score += 6;

    // Experience (15 pts)
    if (workExperience && workExperience.length > 0) {
      if (workExperience[0].title && workExperience[0].company) score += 15;
    }

    // Projects (15 pts)
    if (projects && projects.length > 0) {
      if (projects[0].name && projects[0].description) score += 15;
    }

    // Education (10 pts)
    if (education && education.length > 0) {
      if (education[0].degree && education[0].institution) score += 10;
    }

    return Math.min(100, Math.round(score));
  }, [resumeData]);

  const value = {
    resumeData,
    activeTemplate,
    setActiveTemplate,
    isExporting,
    setIsExporting,
    completionPercentage,
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
    loadSampleData,
    clearResumeData,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
