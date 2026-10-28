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
      const targetTemplate = approvedResume?.templateId || selectedTemplateId;
      await resumeApi.approve(targetTemplate, resumeData);
      showToast("Resume data saved and synchronized successfully!", "success");
      await loadData();
    } catch (err) {
      showToast("Failed to save resume data: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsSaving(false);
    }
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
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Resume Data Fields
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customize candidate profile details. Saving persists data to the database and syncs with the approved resume.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResumeData(sampleResumeData)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset to Sample Data</span>
              </button>
              <button
                type="button"
                onClick={handleSaveResumeData}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save to Database</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Personal Information Group */}
          <AdminCard title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroup label="Full Name">
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

              <FormGroup label="Professional Headline">
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

              <FormGroup label="Email Address">
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
                />
              </FormGroup>

              <FormGroup label="Phone">
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
                />
              </FormGroup>

              <FormGroup label="Location">
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
                />
              </FormGroup>
            </div>
          </AdminCard>

          {/* Professional Summary */}
          <AdminCard title="Executive Summary">
            <FormGroup label="Resume Summary / Profile Objective">
              <textarea
                rows={4}
                className={textareaCls}
                value={resumeData?.summary || ""}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
              />
            </FormGroup>
          </AdminCard>

          {/* Bottom Save Action */}
          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={handleSaveResumeData}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Resume & Sync Database</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
