import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { RESUME_TEMPLATES, getTemplateById } from "../templatesRegistry";
import { sampleResumeData } from "../sampleData";
import { exportResumeToPdf } from "../utils/pdfExport";
import { toast } from "../../utils/toast";

function ResumeTemplateModalContent({ onClose, defaultTemplate }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplate);
  const [previewMode, setPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(90);
  const [exportingId, setExportingId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);
  const [resumeData] = useState(() => {
    try {
      const saved = localStorage.getItem("fullstack-resume-builder-data-v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return sampleResumeData;
  });

  const previewContainerRef = useRef(null);
  const hiddenExportRef = useRef(null);
  const [hiddenTemplateToExport, setHiddenTemplateToExport] = useState(null);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (previewMode) {
          setPreviewMode(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewMode, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle PDF Download
  const handleDownloadPdf = async (templateId) => {
    const template = getTemplateById(templateId);
    setExportingId(templateId);
    setDownloadSuccessId(null);

    try {
      // If we are currently in full preview mode and the template matches
      let targetElement = null;
      if (previewMode && selectedTemplateId === templateId) {
        targetElement = document.getElementById("modal-resume-a4-document");
      }

      if (!targetElement) {
        // Render in hidden container
        setHiddenTemplateToExport(templateId);
        // Wait for DOM update
        await new Promise((resolve) => setTimeout(resolve, 80));
        targetElement = document.getElementById("modal-hidden-export-doc");
      }

      if (!targetElement) {
        throw new Error("Unable to locate resume element for export");
      }

      const candidateName =
        resumeData?.personalInfo?.fullName || "Ashish Sahu";
      const customFileName = `${candidateName}_${template.name}`;

      toast.loading("Exporting resume PDF...", { id: `pdf-export-${templateId}` });
      await exportResumeToPdf(targetElement, customFileName);

      setDownloadSuccessId(templateId);
      toast.success(`Exported ${template.name} PDF successfully!`, { id: `pdf-export-${templateId}` });
      setTimeout(() => setDownloadSuccessId(null), 3000);
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF: " + (err.message || "Unknown error"), { id: `pdf-export-${templateId}` });
    } finally {
      setExportingId(null);
      setHiddenTemplateToExport(null);
    }
  };

  const activeTemplateObj = getTemplateById(selectedTemplateId);
  const ActiveComponent = activeTemplateObj.Component;

  // Hidden template for background rendering when user downloads directly from grid
  const HiddenComponent = hiddenTemplateToExport
    ? getTemplateById(hiddenTemplateToExport).Component
    : null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-zinc-950/70 backdrop-blur-md transition-all animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Hidden container for crisp off-screen A4 rendering */}
      <div
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0 overflow-hidden"
        aria-hidden="true"
      >
        {HiddenComponent && (
          <div
            id="modal-hidden-export-doc"
            ref={hiddenExportRef}
            className="w-[794px] min-h-[1123px] bg-white text-zinc-900"
          >
            <HiddenComponent data={resumeData} />
          </div>
        )}
      </div>

      {/* Main Modal Surface */}
      <div className="relative flex flex-col w-full max-w-6xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-zinc-900">
        {/* Modal Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/80">
          <div className="flex items-center gap-3">
            {previewMode ? (
              <button
                onClick={() => setPreviewMode(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer transition"
              >
                <ArrowLeft size={14} />
                <span>All Templates</span>
              </button>
            ) : (
              <div className="size-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                <FileText size={18} />
              </div>
            )}

            <div>
              <h2
                id="modal-headline"
                className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 flex items-center gap-2"
              >
                {previewMode ? (
                  <>
                    <span>Preview: {activeTemplateObj.name} Template</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${activeTemplateObj.badgeColor}`}
                    >
                      {activeTemplateObj.badge}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Choose Resume Template</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <Sparkles size={11} /> 6 ATS Styles
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xs text-zinc-500 line-clamp-1">
                {previewMode
                  ? activeTemplateObj.description
                  : "Select an ATS-optimized, recruiter-approved layout to preview or download as an A4 PDF."}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Direct download from header when in preview mode */}
            {previewMode && (
              <button
                onClick={() => handleDownloadPdf(selectedTemplateId)}
                disabled={exportingId === selectedTemplateId}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
              >
                {exportingId === selectedTemplateId ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : downloadSuccessId === selectedTemplateId ? (
                  <>
                    <Check size={13} />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="size-8 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Modal Body: Either Grid View or Single Preview View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60">
          {!previewMode ? (
            /* ============================================================ */
            /* VIEW 1: TEMPLATE CARDS GRID (6 TEMPLATES)                    */
            /* ============================================================ */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {RESUME_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  const isExportingThis = exportingId === tmpl.id;
                  const isSuccessThis = downloadSuccessId === tmpl.id;
                  const CardComponent = tmpl.Component;

                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`group relative flex flex-col rounded-xl border bg-white p-3.5 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-500/20"
                          : "border-zinc-200/90 hover:border-zinc-300"
                      }`}
                    >
                      {/* Top Thumbnail Preview Container */}
                      <div className="relative h-56 sm:h-60 w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-start justify-center shadow-inner">
                        {/* Micro scaled live resume */}
                        <div
                          className="pointer-events-none select-none w-[794px] origin-top bg-white"
                          style={{
                            transform: "scale(0.31)",
                            transformOrigin: "top center",
                          }}
                        >
                          <CardComponent data={resumeData} />
                        </div>

                        {/* Hover Overlay with Quick Buttons */}
                        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplateId(tmpl.id);
                              setPreviewMode(true);
                            }}
                            className="w-full max-w-[180px] inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-md hover:bg-zinc-100 cursor-pointer transition transform group-hover:scale-100 scale-95"
                          >
                            <Eye size={13} className="text-blue-600" />
                            <span>Preview Full A4</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPdf(tmpl.id);
                            }}
                            disabled={isExportingThis}
                            className="w-full max-w-[180px] inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition transform group-hover:scale-100 scale-95"
                          >
                            {isExportingThis ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Generating...</span>
                              </>
                            ) : isSuccessThis ? (
                              <>
                                <Check size={13} />
                                <span>Downloaded!</span>
                              </>
                            ) : (
                              <>
                                <Download size={13} />
                                <span>Download PDF</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Active Selection Check Badge */}
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 size-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                            <Check size={13} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="mt-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                              <span>{tmpl.name}</span>
                            </h3>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}
                            >
                              {tmpl.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500 leading-snug line-clamp-2">
                            {tmpl.description}
                          </p>
                        </div>

                        {/* Card Action Buttons (always visible on bottom) */}
                        <div className="mt-3.5 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplateId(tmpl.id);
                              setPreviewMode(true);
                            }}
                            className="inline-flex items-center justify-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer transition"
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPdf(tmpl.id);
                            }}
                            disabled={isExportingThis}
                            className={`inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-zinc-900 text-white hover:bg-zinc-800"
                            } disabled:opacity-50`}
                          >
                            {isExportingThis ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : isSuccessThis ? (
                              <Check size={12} />
                            ) : (
                              <Download size={12} />
                            )}
                            <span>{isExportingThis ? "Exporting" : "PDF"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* VIEW 2: FULL INTERACTIVE PREVIEW MODE                        */
            /* ============================================================ */
            <div className="flex flex-col items-center">
              {/* Preview Sub-Toolbar */}
              <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-2.5 rounded-xl border border-zinc-200 shadow-2xs">
                {/* Template quick switcher tabs inside preview */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {RESUME_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition ${
                        selectedTemplateId === tmpl.id
                          ? "bg-blue-600 text-white font-semibold shadow-xs"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-zinc-600">
                    <button
                      onClick={() => setZoom((z) => Math.max(50, z - 10))}
                      className="rounded p-1 hover:bg-white cursor-pointer"
                      title="Zoom out"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span
                      onClick={() => setZoom(90)}
                      className="min-w-8 text-center text-[11px] font-mono cursor-pointer"
                      title="Reset Zoom"
                    >
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(130, z + 10))}
                      className="rounded p-1 hover:bg-white cursor-pointer"
                      title="Zoom in"
                    >
                      <ZoomIn size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Realistic A4 Document Container */}
              <div
                ref={previewContainerRef}
                className="w-full flex justify-center pb-12 overflow-x-auto"
              >
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  <div
                    id="modal-resume-a4-document"
                    className="w-[794px] min-h-[1123px] bg-white rounded-sm shadow-2xl ring-1 ring-zinc-900/10 overflow-hidden"
                  >
                    <ActiveComponent data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Bar */}
        <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-t border-zinc-200 bg-white">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-800">
              Selected: {activeTemplateObj.name} Template
            </span>
            <span>•</span>
            <span>Standard A4 PDF Format</span>
          </div>

          <div className="flex items-center gap-3">

            {/* Primary Download Button for selected template */}
            <button
              onClick={() => handleDownloadPdf(selectedTemplateId)}
              disabled={exportingId === selectedTemplateId}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
            >
              {exportingId === selectedTemplateId ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccessId === selectedTemplateId ? (
                <>
                  <Check size={14} />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download {activeTemplateObj.name} PDF</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function ResumeTemplateModal({ isOpen, onClose, defaultTemplate = "modern" }) {
  if (!isOpen) return null;
  return (
    <ResumeTemplateModalContent
      key={defaultTemplate}
      onClose={onClose}
      defaultTemplate={defaultTemplate}
    />
  );
}
