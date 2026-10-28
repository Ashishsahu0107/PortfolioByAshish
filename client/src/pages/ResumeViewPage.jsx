import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { ResumeProvider, useResume } from "../resume-builder/context/ResumeContext";
import { exportResumeToPdf } from "../resume-builder/utils/pdfExport";
import { RESUME_TEMPLATES, renderResumeTemplate } from "../resume-builder/templatesRegistry";
import { toast } from "../utils/toast";

function ResumeViewContent() {
  const { resumeData, activeTemplate, setActiveTemplate, isExporting, setIsExporting } = useResume();
  const [zoom, setZoom] = useState(100);
  const navigate = useNavigate();

  const handleDownload = async () => {
    const el = document.getElementById("resume-a4-document");
    if (!el) {
      toast.error("Resume document element is not ready for download.");
      return;
    }

    setIsExporting(true);
    toast.loading("Exporting resume PDF...", { id: "view-page-export" });
    try {
      await exportResumeToPdf(el, resumeData.personalInfo.fullName);
      toast.success("Resume PDF downloaded successfully!", { id: "view-page-export" });
    } catch (err) {
      toast.error("Download failed: " + (err.message || "Unknown error"), { id: "view-page-export" });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const templates = RESUME_TEMPLATES;

  const renderActiveTemplate = () => {
    return renderResumeTemplate(activeTemplate, resumeData);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans text-zinc-900">
      {/* Top Floating Action Bar (Hidden when Printing) */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Back to Editor */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/resume-builder")}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer transition"
            >
              <ArrowLeft size={15} />
              <span>Back to Editor</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-800">
                {resumeData.personalInfo.fullName || "Candidate"} - Resume
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
                Ready to Export
              </span>
            </div>
          </div>

          {/* Template Switcher */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-zinc-500 font-medium">Template:</span>
            <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    activeTemplate === t.id
                      ? "bg-white text-blue-600 shadow-2xs font-semibold"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Zoom, Print, Download */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-zinc-600 shadow-2xs">
              <button
                onClick={() => setZoom((prev) => Math.max(60, prev - 10))}
                className="rounded p-1 hover:bg-white hover:text-zinc-900 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span
                onClick={() => setZoom(100)}
                className="min-w-9 text-center text-[11px] font-mono select-none cursor-pointer hover:text-blue-600"
                title="Reset Zoom"
              >
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((prev) => Math.min(130, prev + 10))}
                className="rounded p-1 hover:bg-white hover:text-zinc-900 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer transition"
              title="Print Resume (Cmd/Ctrl + P)"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
            >
              <Download size={14} className={isExporting ? "animate-spin" : ""} />
              <span>{isExporting ? "Generating PDF..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Display */}
      <main className="flex-1 flex justify-center items-start p-4 sm:p-10 overflow-auto">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="pb-20 print:p-0 print:m-0 print:transform-none"
        >
          <div
            id="resume-a4-document"
            className="w-[794px] min-h-[1123px] bg-white rounded-sm shadow-2xl ring-1 ring-zinc-900/5 print:shadow-none print:ring-0 print:w-full print:m-0 overflow-hidden"
          >
            {renderActiveTemplate()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResumeViewPage() {
  return (
    <ResumeProvider>
      <ResumeViewContent />
    </ResumeProvider>
  );
}
