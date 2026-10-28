import { useState, useEffect, useRef } from "react";
import {
  Download,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { renderResumeTemplate } from "../templatesRegistry";
import { exportResumeToPdf } from "../utils/pdfExport";
import { resumeApi } from "../../services/api";
import { toast } from "../../utils/toast";

export default function ResumeDownloadConfirmModal({
  isOpen,
  onClose,
  approvedResume,
  loading,
  error,
  onRetry,
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);
  const hiddenRenderRef = useRef(null);

  // Handle ESC key to cancel & close modal without downloading
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setDownloadSuccess(false);
      setExportError(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const candidateName =
    approvedResume?.resumeData?.personalInfo?.fullName || "Ashish Sahu";
  const candidateHeadline =
    approvedResume?.resumeData?.personalInfo?.headline ||
    "Full Stack Developer | MERN & React Specialist";
  const templateTitle =
    approvedResume?.title || approvedResume?.templateId || "Modern";

  const handleDownloadPdf = async () => {
    if (!approvedResume || loading) return;

    setIsExporting(true);
    setExportError(null);
    setDownloadSuccess(false);
    toast.loading("Preparing approved resume PDF...", { id: "resume-pdf-dl" });

    try {
      // 1. Double-check with backend download authorization
      try {
        await resumeApi.validateDownload(approvedResume.templateId);
      } catch (authErr) {
        throw new Error(
          authErr.message || "Failed to verify approved resume on server."
        );
      }

      // 2. Allow hidden DOM element to paint
      await new Promise((resolve) => setTimeout(resolve, 80));

      const targetEl = document.getElementById("approved-resume-export-node");
      if (!targetEl) {
        throw new Error("Unable to locate approved resume document for export.");
      }

      // 3. Export to high-DPI A4 PDF
      const customFileName = `${candidateName.trim().replace(/\s+/g, "_")}_${templateTitle}_Resume`;
      await exportResumeToPdf(targetEl, customFileName);

      setDownloadSuccess(true);
      toast.success("Resume downloaded successfully!", { id: "resume-pdf-dl" });
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("[ResumeDownloadConfirmModal] Export failed:", err);
      const msg = err.message || "Failed to generate resume PDF. Please try again.";
      setExportError(msg);
      toast.error(msg, { id: "resume-pdf-dl" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      id="resume-download-confirm-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-download-title"
      className="fixed inset-0 z-[200] grid place-items-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        // Clicking backdrop closes without downloading
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-7 shadow-2xl transition-all">
        {/* Top Close Button (Cancel without downloading) */}
        <button
          type="button"
          id="resume-modal-close-x"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          aria-label="Close dialog without downloading"
          title="Cancel and close"
        >
          <X size={18} />
        </button>

        {/* Header Icon & Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="grid size-11 place-items-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20 shadow-xs">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                Portfolio Resume
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={11} /> Verified Approved
              </span>
            </div>
            <h2
              id="resume-download-title"
              className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
            >
              Would you like to download my resume?
            </h2>
          </div>
        </div>

        {/* Modal Body / Status States */}
        {loading ? (
          <div className="my-6 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 p-6 text-center">
            <Loader2
              size={28}
              className="mx-auto animate-spin text-blue-600 dark:text-blue-400 mb-2"
            />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Fetching approved resume from database...
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Validating active template and ATS credentials
            </p>
          </div>
        ) : error || !approvedResume ? (
          <div className="my-6 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Approved Resume Not Available
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-1 leading-relaxed">
                  {error ||
                    "No approved resume template has been published by the developer yet. Only approved resumes can be downloaded."}
                </p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 dark:bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>Retry Connection</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="my-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-4 sm:p-5">
            {/* Candidate Metadata preview card */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-3 mb-3">
              <div>
                <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {candidateName}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {candidateHeadline}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                {templateTitle} Template
              </span>
            </div>

            {/* Resume Specifications */}
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>
                  High-DPI <strong>A4 Print-Ready PDF</strong> layout
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-blue-500" />
                <span>
                  Validated <strong>MERN Stack & DSA</strong> engineering qualifications
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>
                  ATS Parsing Score: <strong>≥ 95%</strong>
                </span>
              </li>
            </ul>

            {/* Error banner during export if any */}
            {exportError && (
              <div className="mt-3 rounded-lg border border-red-300 dark:border-red-800/80 bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            {/* Success indicator */}
            {downloadSuccess && (
              <div className="mt-3 rounded-lg border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                <span className="font-semibold">
                  Resume downloaded successfully!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions Group (Cancel + Download PDF) */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Cancel button: Closes the modal without downloading anything */}
          <button
            type="button"
            id="resume-modal-cancel-btn"
            onClick={onClose}
            disabled={isExporting}
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Download PDF button: Downloads currently approved resume */}
          <button
            type="button"
            id="resume-modal-download-btn"
            onClick={handleDownloadPdf}
            disabled={loading || !approvedResume || isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 size={16} />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden offscreen A4 rendering container for crisp PDF generation */}
      {approvedResume && (
        <div
          ref={hiddenRenderRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "#ffffff",
            color: "#18181b",
          }}
        >
          <div id="approved-resume-export-node" className="bg-white">
            {renderResumeTemplate(
              approvedResume.templateId,
              approvedResume.resumeData || {}
            )}
          </div>
        </div>
      )}
    </div>
  );
}
