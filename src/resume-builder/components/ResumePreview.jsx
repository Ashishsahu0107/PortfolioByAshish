import { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  FileCheck2,
} from "lucide-react";
import { useResume } from "../context/ResumeContext";
import { exportResumeToPdf } from "../utils/pdfExport";
import TemplateModern from "./templates/TemplateModern";
import TemplateClassicATS from "./templates/TemplateClassicATS";
import TemplateExecutiveSidebar from "./templates/TemplateExecutiveSidebar";
import TemplateEditorial from "./templates/TemplateEditorial";
import { useNavigate } from "react-router-dom";

export default function ResumePreview() {
  const { resumeData, activeTemplate, isExporting, setIsExporting } = useResume();
  const [zoom, setZoom] = useState(85); // Default comfortable preview scale
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Auto-fit on small screens or mount
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 48; // padding
        if (availableWidth < 794) {
          const fitScale = Math.max(45, Math.floor((availableWidth / 794) * 100));
          setZoom(fitScale);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(130, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 10));
  const handleResetZoom = () => setZoom(100);

  const handleDownloadPdf = async () => {
    const el = document.getElementById("resume-a4-document");
    if (!el) return;

    setIsExporting(true);
    try {
      await exportResumeToPdf(el, resumeData.personalInfo.fullName);
    } catch (err) {
      alert("PDF generation failed: " + (err.message || "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  };

  const renderActiveTemplate = () => {
    switch (activeTemplate) {
      case "classic":
        return <TemplateClassicATS data={resumeData} />;
      case "executive":
        return <TemplateExecutiveSidebar data={resumeData} />;
      case "editorial":
        return <TemplateEditorial data={resumeData} />;
      case "modern":
      default:
        return <TemplateModern data={resumeData} />;
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-100/90 text-zinc-800">
      {/* Preview Pane Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white/80 px-4 py-2.5 backdrop-blur-xs">
        {/* Left: Document info & Template indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
            <FileCheck2 size={15} className="text-blue-600" />
            <span>Live A4 Preview</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] text-zinc-400">|</span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200/50 capitalize">
            {activeTemplate} Template
          </span>
        </div>

        {/* Center / Right: Zoom & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-zinc-600 shadow-2xs">
            <button
              onClick={handleZoomOut}
              className="rounded p-1 hover:bg-white hover:text-zinc-900 cursor-pointer transition disabled:opacity-40"
              title="Zoom Out"
              disabled={zoom <= 50}
            >
              <ZoomOut size={13} />
            </button>
            <span
              onClick={handleResetZoom}
              className="min-w-9 text-center text-[11px] font-mono font-medium select-none cursor-pointer hover:text-blue-600"
              title="Click to reset zoom to 100%"
            >
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="rounded p-1 hover:bg-white hover:text-zinc-900 cursor-pointer transition disabled:opacity-40"
              title="Zoom In"
              disabled={zoom >= 130}
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Full Screen View button */}
          <button
            onClick={() => navigate("/resume-builder/view")}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-2xs cursor-pointer transition"
            title="Open Fullscreen View"
          >
            <Maximize2 size={12} />
            <span className="hidden md:inline">Full Page</span>
          </button>

          {/* Download button in preview bar */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
            title="Download PDF"
          >
            <Download size={13} className={isExporting ? "animate-spin" : ""} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container with realistic paper drop shadow */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Scaled A4 Wrapper */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="pb-16"
        >
          {/* Printable A4 Resume Document */}
          <div
            id="resume-a4-document"
            className="w-[794px] min-h-[1123px] bg-white rounded-sm shadow-2xl ring-1 ring-zinc-900/5 transition-all overflow-hidden"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            {renderActiveTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}
