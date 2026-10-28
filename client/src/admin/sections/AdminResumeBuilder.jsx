import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Download,
  ExternalLink,
  Sparkles,
  Save,
  RotateCcw,
  Loader2,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  Layout,
  Code2,
  Briefcase,
  User,
  GraduationCap,
  Plus,
  Trash2,
  Award,
  FolderGit2,
  BookOpen,
} from "lucide-react";
import {
  AdminSection,
  AdminCard,
  FormGroup,
  useToast,
  Toast,
  inputCls,
  textareaCls,
  btnPrimary,
  btnSecondary,
} from "../adminUtils";
import { resumeApi } from "../../services/api";
import {
  RESUME_TEMPLATES,
  getTemplateById,
  renderResumeTemplate,
} from "../../resume-builder/templatesRegistry";
import { sampleResumeData } from "../../resume-builder/sampleData";
import { exportResumeToPdf } from "../../resume-builder/utils/pdfExport";

export default function AdminResumeBuilder() {
  const [resumes, setResumes] = useState([]);
  const [approvedResume, setApprovedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("modern");
  const [activeTab, setActiveTab] = useState("gallery"); // 'gallery' | 'preview' | 'editor'
  const [resumeData, setResumeData] = useState(sampleResumeData);
  const [zoom, setZoom] = useState(85);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewContainerRef = useRef(null);
  const { toast, showToast } = useToast();

  // Load resumes and approved status from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [approvedData, allList] = await Promise.all([
        resumeApi.getApproved().catch(() => null),
        resumeApi.getAll().catch(() => []),
      ]);

      if (approvedData) {
        setApprovedResume(approvedData);
        setSelectedTemplateId(approvedData.templateId || "modern");
        if (approvedData.resumeData && Object.keys(approvedData.resumeData).length > 0) {
          setResumeData(approvedData.resumeData);
        }
      }

      setResumes(Array.isArray(allList) ? allList : []);
    } catch (err) {
      console.error("[AdminResumeBuilder] Error loading resume data:", err);
      showToast(
        "Failed to load resume templates from server: " + (err.message || "Unknown error"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle approving a resume template
  const handleApproveTemplate = async (templateId) => {
    try {
      setApprovingId(templateId);
      const res = await resumeApi.approve(templateId, resumeData);
      if (res?.data) {
        setApprovedResume(res.data);
        // Refresh all list to update badges
        const all = await resumeApi.getAll().catch(() => []);
        setResumes(all);
        showToast(
          `Template "${res.data.title || templateId}" approved! Only this resume can now be downloaded by visitors on your portfolio.`,
          "success"
        );
      }
    } catch (err) {
      showToast(
        "Failed to approve template: " + (err.message || "Server error"),
        "error"
      );
    } finally {
      setApprovingId(null);
    }
  };

  // Handle saving customized resume content to database
  const handleSaveResumeData = async () => {
    try {
      setIsSaving(true);
      const targetTemplate = selectedTemplateId || approvedResume?.templateId || "modern";
      await resumeApi.update(targetTemplate, { resumeData });
      showToast(`Resume data for "${targetTemplate}" saved successfully!`, "success");
      await loadData();
    } catch (err) {
      showToast("Failed to save resume data: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndApprove = async () => {
    try {
      setIsSaving(true);
      const targetTemplate = selectedTemplateId || approvedResume?.templateId || "modern";
      const res = await resumeApi.approve(targetTemplate, resumeData);
      showToast(
        `Template "${res?.data?.title || targetTemplate}" saved and approved as the active portfolio resume!`,
        "success"
      );
      await loadData();
    } catch (err) {
      showToast("Failed to approve template: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  // CRUD Helpers for Admin Content Editor
  const handleAddExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: [
        {
          id: "exp-" + Date.now(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
        ...(prev.workExperience || []),
      ],
    }));
    showToast("Added new work experience entry.", "success");
  };

  const handleUpdateExperience = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleDeleteExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter((exp) => exp.id !== id),
    }));
    showToast("Experience entry removed.", "info");
  };

  const handleAddProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        {
          id: "proj-" + Date.now(),
          name: "",
          technologies: "",
          description: "",
          githubUrl: "",
          liveUrl: "",
        },
        ...(prev.projects || []),
      ],
    }));
    showToast("Added new project entry.", "success");
  };

  const handleUpdateProject = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleDeleteProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id),
    }));
    showToast("Project entry removed.", "info");
  };

  const handleAddEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        {
          id: "edu-" + Date.now(),
          degree: "",
          institution: "",
          location: "",
          graduationYear: "",
          gradeGpa: "",
          details: "",
        },
        ...(prev.education || []),
      ],
    }));
    showToast("Added new education entry.", "success");
  };

  const handleUpdateEducation = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: (prev.education || []).map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleDeleteEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((edu) => edu.id !== id),
    }));
    showToast("Education entry removed.", "info");
  };

  const handleAddCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        {
          id: "cert-" + Date.now(),
          name: "",
          issuer: "",
          date: "",
          credentialUrl: "",
        },
        ...(prev.certifications || []),
      ],
    }));
    showToast("Added new certification.", "success");
  };

  const handleUpdateCertification = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleDeleteCertification = (id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id),
    }));
    showToast("Certification removed.", "info");
  };

  const handleAddAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [
        {
          id: "ach-" + Date.now(),
          title: "",
          issuer: "",
          year: "",
          description: "",
        },
        ...(prev.achievements || []),
      ],
    }));
    showToast("Added new achievement.", "success");
  };

  const handleUpdateAchievement = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }));
  };

  const handleDeleteAchievement = (id) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a) => a.id !== id),
    }));
    showToast("Achievement removed.", "info");
  };

  const handleSkillChange = (category, value) => {
    const list = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...(prev.skills || {}),
        [category]: list,
      },
    }));
  };

  // Handle quick PDF test download
  const handleTestDownload = async (templateIdToDownload = selectedTemplateId) => {
    setIsExporting(true);
    try {
      const templateObj = getTemplateById(templateIdToDownload);
      // Wait for any DOM changes to settle
      await new Promise((resolve) => setTimeout(resolve, 80));
      const targetEl = document.getElementById("admin-resume-a4-preview-node");
      if (!targetEl) {
        throw new Error("Resume preview document is not rendered.");
      }
      const candidateName =
        resumeData?.personalInfo?.fullName || "Ashish Sahu";
      const customFileName = `${candidateName.trim().replace(/\s+/g, "_")}_${templateObj.name}_Resume`;
      await exportResumeToPdf(targetEl, customFileName);
      showToast(`Test PDF downloaded for "${templateObj.name}" template.`, "success");
    } catch (err) {
      showToast("Download failed: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsExporting(false);
    }
  };

  const currentApprovedId = approvedResume?.templateId || "modern";
  const activeTemplateObj = getTemplateById(selectedTemplateId);

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Portfolio Resume Management
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={11} /> 1-Template Approval Rule
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="text-amber-400" size={26} />
            <span>Admin Resume Builder</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Select and approve the official resume template for your portfolio.
            Visitors clicking <strong>Resume PDF</strong> anywhere on your live site will be prompted to download only your approved resume.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/resume-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition shadow-xs"
            title="Open Dedicated Resume Builder"
          >
            <ExternalLink size={13} className="text-amber-400" />
            <span>Dedicated Editor</span>
          </Link>
          <Link
            to="/resume-builder/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition shadow-xs"
            title="Full Page Clean View"
          >
            <Eye size={13} className="text-blue-400" />
            <span>Full-Page View</span>
          </Link>
        </div>
      </div>

      {/* Currently Approved Resume Status Card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-zinc-900/60 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ● ACTIVE PORTFOLIO RESUME
                </span>
                <span className="text-xs text-zinc-400">
                  Approved Template:{" "}
                  <strong className="text-white uppercase font-mono">
                    {approvedResume?.title || currentApprovedId}
                  </strong>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {resumeData?.personalInfo?.fullName || "Ashish Sahu"} —{" "}
                <span className="text-zinc-300 font-medium text-sm">
                  {resumeData?.personalInfo?.headline || "Full Stack Developer"}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Only this resume template is downloadable through the portfolio’s <strong>Resume PDF</strong> confirmation modal. Unapproved/draft resumes are blocked by the backend API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedTemplateId(currentApprovedId);
                setActiveTab("preview");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 transition cursor-pointer"
            >
              <Eye size={14} />
              <span>Preview Live</span>
            </button>
            <button
              type="button"
              onClick={() => handleTestDownload(currentApprovedId)}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <Download size={14} className={isExporting ? "animate-bounce" : ""} />
              <span>{isExporting ? "Exporting..." : "Test Download PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs: Template Gallery / Live Preview / Content Editor */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === "gallery"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Layout size={15} />
          <span>Template Approval Gallery ({RESUME_TEMPLATES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === "preview"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Eye size={15} />
          <span>Interactive Live Preview ({activeTemplateObj.name})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("editor")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === "editor"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <User size={15} />
          <span>Edit Resume Content</span>
        </button>
      </div>

      {/* ── TAB 1: Template Approval Gallery ── */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Choose One Template to Approve</span>
            </h2>
            <span className="text-xs text-zinc-400">
              Click &quot;Approve for Portfolio&quot; to set as the active download
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESUME_TEMPLATES.map((tmpl) => {
              const isApproved =
                tmpl.id === currentApprovedId || tmpl.altId === currentApprovedId;
              const isApprovingThis = approvingId === tmpl.id;
              const isSelected = selectedTemplateId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isApproved
                      ? "border-emerald-500/60 bg-gradient-to-b from-emerald-950/30 to-zinc-900/90 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30"
                      : isSelected
                      ? "border-amber-500/50 bg-zinc-900/90"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                  }`}
                >
                  {/* Color Accent Bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: tmpl.accent || "#3b82f6" }}
                  />

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Status Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isApproved
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {isApproved ? "● APPROVED & LIVE" : "DRAFT"}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                          {tmpl.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{tmpl.name}</span>
                        {isApproved && (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        )}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                        {tmpl.tagline}
                      </p>
                      <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Template Card Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          id={`preview-template-btn-${tmpl.id}`}
                          onClick={() => {
                            setSelectedTemplateId(tmpl.id);
                            setActiveTab("preview");
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          id={`download-template-btn-${tmpl.id}`}
                          onClick={() => {
                            setSelectedTemplateId(tmpl.id);
                            handleTestDownload(tmpl.id);
                          }}
                          disabled={isExporting}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition cursor-pointer disabled:opacity-50"
                          title="Export test PDF"
                        >
                          <Download size={13} />
                        </button>
                      </div>

                      {/* Primary Approve Button */}
                      <button
                        type="button"
                        id={`approve-template-btn-${tmpl.id}`}
                        onClick={() => handleApproveTemplate(tmpl.id)}
                        disabled={isApproved || isApprovingThis}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          isApproved
                            ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40"
                        }`}
                      >
                        {isApprovingThis ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Approving on Database...</span>
                          </>
                        ) : isApproved ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>✓ Active Portfolio Resume</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Approve for Portfolio</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: Interactive Live Preview ── */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          {/* Preview Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">
                Viewing Template:
              </span>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {RESUME_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
                      selectedTemplateId === t.id
                        ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom & Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(50, z - 10))}
                  className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-xs font-mono text-zinc-300 px-1">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(120, z + 10))}
                  className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* Approve this previewed template button if not approved */}
              {selectedTemplateId !== currentApprovedId && (
                <button
                  type="button"
                  onClick={() => handleApproveTemplate(selectedTemplateId)}
                  disabled={approvingId === selectedTemplateId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  <CheckCircle2 size={13} />
                  <span>Approve This Template</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleTestDownload(selectedTemplateId)}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer disabled:opacity-50"
              >
                <Download size={13} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Scaled A4 Document Container */}
          <div
            ref={previewContainerRef}
            className="flex justify-center overflow-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 shadow-inner min-h-[600px]"
          >
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: "210mm",
                minHeight: "297mm",
                backgroundColor: "#ffffff",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              }}
              className="text-zinc-900 rounded-sm overflow-hidden"
            >
              <div id="admin-resume-a4-preview-node" className="bg-white">
                {renderResumeTemplate(selectedTemplateId, resumeData)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Edit Resume Content ── */}
      {activeTab === "editor" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Resume Content & Field Management</span>
                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Target: {activeTemplateObj.name}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Add, edit, or delete resume items. Save changes to MongoDB or immediately approve for portfolio downloads.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setResumeData(sampleResumeData);
                  showToast("Loaded sample resume data.", "info");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Sample</span>
              </button>
              <button
                type="button"
                onClick={handleSaveResumeData}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold text-zinc-200 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={13} className="animate-spin text-amber-400" />
                ) : (
                  <Save size={13} className="text-amber-400" />
                )}
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAndApprove}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                <span>Save & Approve Live</span>
              </button>
            </div>
          </div>

          {/* 1. Personal Information Group */}
          <AdminCard title="1. Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroup label="Full Name *">
                <input
                  type="text"
                  className={inputCls}
                  value={resumeData?.personalInfo?.fullName || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        fullName: e.target.value,
                      },
                    }))
                  }
                  placeholder="Ashish Sahu"
                />
              </FormGroup>

              <FormGroup label="Professional Headline *">
                <input
                  type="text"
                  className={inputCls}
                  value={resumeData?.personalInfo?.headline || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        headline: e.target.value,
                      },
                    }))
                  }
                  placeholder="Full Stack Developer"
                />
              </FormGroup>

              <FormGroup label="Email Address *">
                <input
                  type="email"
                  className={inputCls}
                  value={resumeData?.personalInfo?.email || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  placeholder="your-email@example.com"
                />
              </FormGroup>

              <FormGroup label="Phone Number">
                <input
                  type="text"
                  className={inputCls}
                  value={resumeData?.personalInfo?.phone || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  placeholder="+91 98765 43210"
                />
              </FormGroup>

              <FormGroup label="Location / City">
                <input
                  type="text"
                  className={inputCls}
                  value={resumeData?.personalInfo?.location || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        location: e.target.value,
                      },
                    }))
                  }
                  placeholder="Bengaluru, India"
                />
              </FormGroup>

              <FormGroup label="Portfolio URL">
                <input
                  type="url"
                  className={inputCls}
                  value={resumeData?.personalInfo?.portfolioUrl || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        portfolioUrl: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://ashishsahu.dev"
                />
              </FormGroup>

              <FormGroup label="GitHub URL">
                <input
                  type="url"
                  className={inputCls}
                  value={resumeData?.personalInfo?.github || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        github: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://github.com/ashishsahu0107"
                />
              </FormGroup>

              <FormGroup label="LinkedIn URL">
                <input
                  type="url"
                  className={inputCls}
                  value={resumeData?.personalInfo?.linkedin || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        linkedin: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://linkedin.com/in/ashishsahu"
                />
              </FormGroup>
            </div>
          </AdminCard>

          {/* 2. Professional Summary */}
          <AdminCard title="2. Executive Summary">
            <FormGroup label="Resume Summary / Profile Objective (ATS Optimized)">
              <textarea
                rows={3}
                className={textareaCls}
                value={resumeData?.summary || ""}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                placeholder="High-impact 2-4 sentence summary outlining your engineering expertise, core stack, and delivery track record..."
              />
            </FormGroup>
          </AdminCard>

          {/* 3. Technical Skills Categories */}
          <AdminCard title="3. Technical Skills (Comma-Separated)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormGroup label="Languages (e.g. JavaScript, TypeScript, Python)">
                <input
                  type="text"
                  className={inputCls}
                  value={(resumeData?.skills?.languages || []).join(", ")}
                  onChange={(e) => handleSkillChange("languages", e.target.value)}
                  placeholder="JavaScript (ES6+), TypeScript, Python, HTML5, CSS3"
                />
              </FormGroup>

              <FormGroup label="Frontend (e.g. React.js, Next.js, Redux)">
                <input
                  type="text"
                  className={inputCls}
                  value={(resumeData?.skills?.frontend || []).join(", ")}
                  onChange={(e) => handleSkillChange("frontend", e.target.value)}
                  placeholder="React 19, Next.js, Tailwind CSS, Vite, Redux Toolkit"
                />
              </FormGroup>

              <FormGroup label="Backend & APIs (e.g. Node.js, Express, REST, GraphQL)">
                <input
                  type="text"
                  className={inputCls}
                  value={(resumeData?.skills?.backend || []).join(", ")}
                  onChange={(e) => handleSkillChange("backend", e.target.value)}
                  placeholder="Node.js, Express.js, RESTful APIs, JWT Auth, WebSockets"
                />
              </FormGroup>

              <FormGroup label="Databases & Storage (e.g. MongoDB, PostgreSQL, Redis)">
                <input
                  type="text"
                  className={inputCls}
                  value={(resumeData?.skills?.databases || []).join(", ")}
                  onChange={(e) => handleSkillChange("databases", e.target.value)}
                  placeholder="MongoDB, Mongoose, PostgreSQL, Redis, Cloudinary"
                />
              </FormGroup>

              <div className="sm:col-span-2">
                <FormGroup label="Tools, DevOps & Cloud (e.g. Docker, Git, CI/CD, AWS, Render)">
                  <input
                    type="text"
                    className={inputCls}
                    value={(resumeData?.skills?.toolsDevOps || []).join(", ")}
                    onChange={(e) => handleSkillChange("toolsDevOps", e.target.value)}
                    placeholder="Git, GitHub Actions, Docker, Vercel, Render, Postman, Linux"
                  />
                </FormGroup>
              </div>
            </div>
          </AdminCard>

          {/* 4. Work Experience CRUD */}
          <AdminCard
            title={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Briefcase size={16} className="text-amber-400" />
                  <span>4. Work Experience ({resumeData?.workExperience?.length || 0})</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Experience</span>
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {(!resumeData?.workExperience || resumeData.workExperience.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500">No work experience entries added.</p>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="mt-2 text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                  >
                    + Add Experience
                  </button>
                </div>
              ) : (
                resumeData.workExperience.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        Entry #{index + 1}: {exp.title || "Untitled Role"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition cursor-pointer"
                        title="Delete this role"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <FormGroup label="Job Title *">
                        <input
                          type="text"
                          className={inputCls}
                          value={exp.title || ""}
                          onChange={(e) => handleUpdateExperience(exp.id, "title", e.target.value)}
                          placeholder="Senior Full Stack Engineer"
                        />
                      </FormGroup>

                      <FormGroup label="Company *">
                        <input
                          type="text"
                          className={inputCls}
                          value={exp.company || ""}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          placeholder="Tech Corp Inc."
                        />
                      </FormGroup>

                      <FormGroup label="Location">
                        <input
                          type="text"
                          className={inputCls}
                          value={exp.location || ""}
                          onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
                          placeholder="Remote / Bengaluru"
                        />
                      </FormGroup>

                      <FormGroup label="Start Date">
                        <input
                          type="text"
                          className={inputCls}
                          value={exp.startDate || ""}
                          onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                          placeholder="Jan 2023"
                        />
                      </FormGroup>

                      <FormGroup label="End Date">
                        <input
                          type="text"
                          disabled={exp.current}
                          className={`${inputCls} ${exp.current ? "opacity-50" : ""}`}
                          value={exp.endDate || ""}
                          onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                          placeholder={exp.current ? "Present" : "Dec 2024"}
                        />
                      </FormGroup>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!exp.current}
                            onChange={(e) =>
                              handleUpdateExperience(exp.id, "current", e.target.checked)
                            }
                            className="size-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span>Currently working here</span>
                        </label>
                      </div>
                    </div>

                    <FormGroup label="Responsibilities & Key Achievements (bullet points supported)">
                      <textarea
                        rows={3}
                        className={textareaCls}
                        value={exp.description || ""}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, "description", e.target.value)
                        }
                        placeholder="• Architected microservices improving API throughput by 35%...&#10;• Led cross-functional team of 4 engineers delivering full-stack features..."
                      />
                    </FormGroup>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* 5. Featured Projects CRUD */}
          <AdminCard
            title={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <FolderGit2 size={16} className="text-amber-400" />
                  <span>5. Featured Projects ({resumeData?.projects?.length || 0})</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Project</span>
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {(!resumeData?.projects || resumeData.projects.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500">No project entries added.</p>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="mt-2 text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                  >
                    + Add Project
                  </button>
                </div>
              ) : (
                resumeData.projects.map((proj, index) => (
                  <div
                    key={proj.id || index}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        Project #{index + 1}: {proj.name || "Untitled Project"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormGroup label="Project Name *">
                        <input
                          type="text"
                          className={inputCls}
                          value={proj.name || ""}
                          onChange={(e) => handleUpdateProject(proj.id, "name", e.target.value)}
                          placeholder="DevPulse - Developer Analytics Platform"
                        />
                      </FormGroup>

                      <FormGroup label="Technologies Used (e.g. React, Node.js, MongoDB)">
                        <input
                          type="text"
                          className={inputCls}
                          value={proj.technologies || ""}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, "technologies", e.target.value)
                          }
                          placeholder="React, Tailwind, Node.js, Express, MongoDB"
                        />
                      </FormGroup>

                      <FormGroup label="Live Demo URL">
                        <input
                          type="url"
                          className={inputCls}
                          value={proj.liveUrl || ""}
                          onChange={(e) => handleUpdateProject(proj.id, "liveUrl", e.target.value)}
                          placeholder="https://devpulse.io"
                        />
                      </FormGroup>

                      <FormGroup label="GitHub Repository URL">
                        <input
                          type="url"
                          className={inputCls}
                          value={proj.githubUrl || ""}
                          onChange={(e) => handleUpdateProject(proj.id, "githubUrl", e.target.value)}
                          placeholder="https://github.com/ashishsahu0107/devpulse"
                        />
                      </FormGroup>
                    </div>

                    <FormGroup label="Project Description">
                      <textarea
                        rows={2}
                        className={textareaCls}
                        value={proj.description || ""}
                        onChange={(e) => handleUpdateProject(proj.id, "description", e.target.value)}
                        placeholder="Engineered high-performance real-time telemetry dashboard utilizing WebSocket streams..."
                      />
                    </FormGroup>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* 6. Education CRUD */}
          <AdminCard
            title={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-amber-400" />
                  <span>6. Education ({resumeData?.education?.length || 0})</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Education</span>
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {(!resumeData?.education || resumeData.education.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500">No education entries added.</p>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="mt-2 text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                  >
                    + Add Education
                  </button>
                </div>
              ) : (
                resumeData.education.map((edu, index) => (
                  <div
                    key={edu.id || index}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        Degree #{index + 1}: {edu.degree || "Untitled Degree"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition cursor-pointer"
                        title="Delete education entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <FormGroup label="Degree / Diploma *">
                        <input
                          type="text"
                          className={inputCls}
                          value={edu.degree || ""}
                          onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                          placeholder="B.Tech in Computer Science & Engineering"
                        />
                      </FormGroup>

                      <FormGroup label="Institution / University *">
                        <input
                          type="text"
                          className={inputCls}
                          value={edu.institution || ""}
                          onChange={(e) =>
                            handleUpdateEducation(edu.id, "institution", e.target.value)
                          }
                          placeholder="ABC Institute of Technology"
                        />
                      </FormGroup>

                      <FormGroup label="Location">
                        <input
                          type="text"
                          className={inputCls}
                          value={edu.location || ""}
                          onChange={(e) => handleUpdateEducation(edu.id, "location", e.target.value)}
                          placeholder="Bengaluru, India"
                        />
                      </FormGroup>

                      <FormGroup label="Graduation Year">
                        <input
                          type="text"
                          className={inputCls}
                          value={edu.graduationYear || ""}
                          onChange={(e) =>
                            handleUpdateEducation(edu.id, "graduationYear", e.target.value)
                          }
                          placeholder="2024"
                        />
                      </FormGroup>

                      <FormGroup label="GPA / Percentage">
                        <input
                          type="text"
                          className={inputCls}
                          value={edu.gradeGpa || ""}
                          onChange={(e) => handleUpdateEducation(edu.id, "gradeGpa", e.target.value)}
                          placeholder="8.8 / 10 CGPA"
                        />
                      </FormGroup>

                      <FormGroup label="Relevant Coursework / Details">
                        <input
                          type="text"
                          className={inputCls}
                          value={edu.details || ""}
                          onChange={(e) => handleUpdateEducation(edu.id, "details", e.target.value)}
                          placeholder="DSA, DBMS, OS, Computer Networks"
                        />
                      </FormGroup>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* 7. Certifications & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Certifications */}
            <AdminCard
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <Award size={16} className="text-amber-400" />
                    <span>7. Certifications ({resumeData?.certifications?.length || 0})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-3">
                {(!resumeData?.certifications || resumeData.certifications.length === 0) ? (
                  <p className="text-xs text-zinc-500 text-center py-4">No certifications added.</p>
                ) : (
                  resumeData.certifications.map((cert, index) => (
                    <div
                      key={cert.id || index}
                      className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{cert.name || `Certification #${index + 1}`}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCertification(cert.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          className={inputCls}
                          value={cert.name || ""}
                          onChange={(e) => handleUpdateCertification(cert.id, "name", e.target.value)}
                          placeholder="Cert Name (e.g. AWS Solutions Architect)"
                        />
                        <input
                          type="text"
                          className={inputCls}
                          value={cert.issuer || ""}
                          onChange={(e) => handleUpdateCertification(cert.id, "issuer", e.target.value)}
                          placeholder="Issuer (e.g. Amazon Web Services)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          className={inputCls}
                          value={cert.date || ""}
                          onChange={(e) => handleUpdateCertification(cert.id, "date", e.target.value)}
                          placeholder="Issue Date (e.g. 2024)"
                        />
                        <input
                          type="url"
                          className={inputCls}
                          value={cert.credentialUrl || ""}
                          onChange={(e) =>
                            handleUpdateCertification(cert.id, "credentialUrl", e.target.value)
                          }
                          placeholder="Credential Verification URL"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AdminCard>

            {/* Achievements */}
            <AdminCard
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span>8. Honors & Achievements ({resumeData?.achievements?.length || 0})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-3">
                {(!resumeData?.achievements || resumeData.achievements.length === 0) ? (
                  <p className="text-xs text-zinc-500 text-center py-4">No achievements added.</p>
                ) : (
                  resumeData.achievements.map((ach, index) => (
                    <div
                      key={ach.id || index}
                      className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ach.title || `Achievement #${index + 1}`}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteAchievement(ach.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          className={inputCls}
                          value={ach.title || ""}
                          onChange={(e) => handleUpdateAchievement(ach.id, "title", e.target.value)}
                          placeholder="Title (e.g. Winner Smart India Hackathon)"
                        />
                        <input
                          type="text"
                          className={inputCls}
                          value={ach.issuer || ""}
                          onChange={(e) => handleUpdateAchievement(ach.id, "issuer", e.target.value)}
                          placeholder="Organization / Issuer"
                        />
                      </div>
                      <input
                        type="text"
                        className={inputCls}
                        value={ach.description || ach.year || ""}
                        onChange={(e) => handleUpdateAchievement(ach.id, "description", e.target.value)}
                        placeholder="Description (e.g. Ranked 1st among 2,500+ participants nationwide)"
                      />
                    </div>
                  ))
                )}
              </div>
            </AdminCard>
          </div>

          {/* Bottom Dual Save Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleSaveResumeData}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold text-zinc-100 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="animate-spin text-amber-400" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} className="text-amber-400" />
                  <span>Save Draft to Database</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveAndApprove}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Save & Approve as Portfolio Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
