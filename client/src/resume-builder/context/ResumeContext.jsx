import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { sampleResumeData, emptyResumeData } from "../sampleData";
import { resumeApi } from "../../services/api";
import { showToast, toast } from "../../utils/toast";

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

  const [approvedResume, setApprovedResume] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  // Fetch approved resume from backend API on mount
  const fetchBackendApproved = useCallback(async (silent = true) => {
    try {
      if (!silent) setIsLoadingBackend(true);
      const approved = await resumeApi.getApproved();
      if (approved) {
        setApprovedResume(approved);
        if (approved.templateId) {
          setActiveTemplate(approved.templateId);
        }
        if (approved.resumeData && Object.keys(approved.resumeData).length > 0) {
          setResumeData(approved.resumeData);
        }
      }
    } catch (err) {
      if (!silent) {
        showToast.error(err, "Failed to load resume from database.");
      }
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  useEffect(() => {
    fetchBackendApproved(true);
  }, [fetchBackendApproved]);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (e) {
      console.warn("Failed to cache resume data to localStorage:", e);
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
    showToast.info("Added new work experience entry.");
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
    showToast.info("Deleted work experience entry.");
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
    showToast.info("Added new project entry.");
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
    showToast.info("Deleted project entry.");
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
    showToast.info("Added new education entry.");
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
    showToast.info("Deleted education entry.");
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
    showToast.info("Added new certification.");
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
    showToast.info("Deleted certification.");
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
    showToast.info("Added new achievement.");
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
    showToast.info("Deleted achievement.");
  };

  // Reset & Sample data actions
  const loadSampleData = () => {
    setResumeData(sampleResumeData);
    showToast.success("Loaded full-stack developer sample data.");
  };

  const clearResumeData = () => {
    setResumeData(emptyResumeData);
    showToast.info("Cleared resume fields.");
  };

  // Save resume data to database
  const saveResume = async (templateIdToSave = activeTemplate, dataToSave = resumeData) => {
    setIsSaving(true);
    const toastId = toast.loading("Saving resume data to database...");
    try {
      const res = await resumeApi.update(templateIdToSave, {
        resumeData: dataToSave,
      });
      toast.success(res?.message || "Resume saved successfully!", { id: toastId });
      return res;
    } catch (err) {
      console.error("[ResumeContext] Save error:", err);
      toast.error(err?.message || "Failed to save resume data.", { id: toastId });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Approve resume template on database
  const approveResume = async (templateIdToApprove = activeTemplate, dataToApprove = resumeData) => {
    setIsSaving(true);
    const toastId = toast.loading("Approving resume template on server...");
    try {
      const res = await resumeApi.approve(templateIdToApprove, dataToApprove);
      if (res?.data) {
        setApprovedResume(res.data);
        setActiveTemplate(templateIdToApprove);
      }
      toast.success(
        res?.message || `Template approved! Visitors can now download this resume.`,
        { id: toastId }
      );
      return res;
    } catch (err) {
      console.error("[ResumeContext] Approve error:", err);
      toast.error(err?.message || "Failed to approve resume template.", { id: toastId });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate dynamic completion score (0 to 100%)
  const completionPercentage = useMemo(() => {
    let score = 0;
    const { personalInfo = {}, summary = "", skills = {}, workExperience = [], projects = [], education = [] } = resumeData;

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
    setResumeData,
    activeTemplate,
    setActiveTemplate,
    approvedResume,
    isExporting,
    setIsExporting,
    isSaving,
    setIsSaving,
    isLoadingBackend,
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
    saveResume,
    approveResume,
    refreshResume: () => fetchBackendApproved(false),
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
