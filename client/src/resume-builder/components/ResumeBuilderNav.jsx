import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Settings,
  Loader2,
  Save,
} from "lucide-react";
import { useResume } from "../context/ResumeContext";
import { exportResumeToPdf } from "../utils/pdfExport";
import { RESUME_TEMPLATES } from "../templatesRegistry";
import { useAuth } from "../../auth/AuthContext";
import { resumeApi } from "../../services/api";
import { usePortfolioSync } from "../../hooks/usePortfolioSync";
import { toast, showToast } from "../../utils/toast";

export default function ResumeBuilderNav() {
  const {
    resumeData,
    activeTemplate,
    setActiveTemplate,
    completionPercentage,
    loadSampleData,
    clearResumeData,
    isExporting,
    setIsExporting,
    isSaving,
    saveResume,
    approveResume,
  } = useResume();

  const { user } = useAuth();
  const [approvedTemplateId, setApprovedTemplateId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalNotice, setApprovalNotice] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchApproved = useCallback(async () => {
    try {
      const data = await resumeApi.getApproved();
      if (data?.templateId) {
        setApprovedTemplateId(data.templateId);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchApproved();
  }, [fetchApproved]);

  usePortfolioSync(fetchApproved, "resume");

  const handleApproveCurrent = async () => {
    if (!user) {
      showToast.info("Please sign in to approve resume templates.");
      navigate("/secret-login");
      return;
    }
    setIsApproving(true);
    try {
      await approveResume(activeTemplate, resumeData);
      setApprovedTemplateId(activeTemplate);
      const notice = `Template approved! Only this resume is now live on your portfolio.`;
      setApprovalNotice(notice);
      setTimeout(() => setApprovalNotice(null), 3500);
    } catch {
      // toast already shown by approveResume in context
    } finally {
      setIsApproving(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!user) {
      showToast.info("Please sign in to save resumes to the database.");
      navigate("/secret-login");
      return;
    }
    try {
      await saveResume(activeTemplate, resumeData);
    } catch {
      // toast handled in saveResume
    }
  };

  const handleDownload = async () => {
    const previewEl = document.getElementById("resume-a4-document");
    if (!previewEl) {
      toast.error("Resume preview element is not ready. Please try again.");
      return;
    }

    setIsExporting(true);
    toast.loading("Exporting resume PDF...", { id: "nav-pdf-export" });
    try {
      await exportResumeToPdf(previewEl, resumeData.personalInfo?.fullName || "Resume");
      toast.success("Resume PDF downloaded successfully!", { id: "nav-pdf-export" });
    } catch (err) {
      toast.error("Failed to export PDF: " + (err.message || "Unknown error"), { id: "nav-pdf-export" });
    } finally {
      setIsExporting(false);
    }
  };

  const templates = RESUME_TEMPLATES;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Return Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            title="Return to Ashish Sahu Portfolio"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <FileText size={16} />
            </span>
            <div>
              <h1 className="text-sm font-bold leading-none text-zinc-900">
                Resume Builder
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium">
                Full Stack Developer ATS Edition
              </p>
            </div>
          </div>
        </div>

        {/* Center: Template Switcher & Completion Meter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Template Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
            <span className="px-2 text-[11px] font-semibold text-zinc-500 hidden md:inline">
              Template:
            </span>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  activeTemplate === t.id
                    ? "bg-white text-blue-600 shadow-xs font-semibold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Admin Approval Control */}
          {user && (
            <div className="flex items-center gap-1.5">
              {activeTemplate === approvedTemplateId ? (
                <span
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 text-[11px] font-bold"
                  title="This template is currently approved and live for portfolio visitor downloads"
                >
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Approved Live</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleApproveCurrent}
                  disabled={isApproving}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                  title="Set this template as the approved download for portfolio visitors"
                >
                  {isApproving ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  <span>Approve Template</span>
                </button>
              )}
            </div>
          )}

          {/* Completion Score */}
          <div className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 lg:flex">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                ATS Score
              </span>
              <span className="text-xs font-extrabold text-zinc-900 leading-none">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full transition-all duration-300 ${
                  completionPercentage >= 80
                    ? "bg-emerald-500"
                    : completionPercentage >= 50
                    ? "bg-amber-500"
                    : "bg-blue-600"
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Actions (Sample, Clear, View, Download) */}
        <div className="flex items-center gap-2">
          {user && (
            <Link
              to="/admin/resume"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100 hover:text-zinc-900"
              title="Return to Admin Resume Builder"
            >
              <Settings size={13} />
              <span className="hidden xl:inline">Admin</span>
            </Link>
          )}

          {/* Save to Database Button */}
          {user && (
            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100 disabled:opacity-50 cursor-pointer transition"
              title="Save current resume changes to database"
            >
              {isSaving ? (
                <Loader2 size={13} className="animate-spin text-amber-600" />
              ) : (
                <Save size={13} className="text-amber-600" />
              )}
              <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Resume"}</span>
            </button>
          )}

          {/* Sample Data Button */}
          <button
            onClick={loadSampleData}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-blue-600 cursor-pointer"
            title="Load sample Full Stack Developer resume"
          >
            <Sparkles size={13} className="text-blue-600" />
            <span className="hidden sm:inline">Sample</span>
          </button>

          {/* Clear Form Button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-red-600 cursor-pointer"
            title="Clear all fields"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* View Resume Button (Dedicated Full-Page Preview) */}
          <button
            onClick={() => navigate("/resume-builder/view")}
            className="inline-flex items-center gap-1.5 rounded-md border border-blue-600/30 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer transition"
            title="Open clean distraction-free view"
          >
            <Eye size={14} />
            <span>View Resume</span>
          </button>

          {/* Prominent Download PDF Button */}
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
            title="Generate & Download A4 PDF"
          >
            <Download size={14} className={isExporting ? "animate-bounce" : ""} />
            <span>{isExporting ? "Generating PDF..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Approval Notification Banner */}
      {approvalNotice && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center shadow-inner flex items-center justify-center gap-1.5 animate-fadeIn">
          <CheckCircle2 size={14} />
          <span>{approvalNotice}</span>
        </div>
      )}

      {/* Confirmation Dialog for Clear Form */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900">
              Clear Resume Form?
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              This will clear all entries from the editor. You can reload the sample data anytime or enter your own details.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearResumeData();
                  setShowClearConfirm(false);
                }}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
