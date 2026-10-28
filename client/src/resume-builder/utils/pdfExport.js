import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates and downloads a clean, professional high-DPI A4 PDF from an HTML element
 * with flawless multi-page slicing and unscaled capture.
 *
 * @param {HTMLElement} element - The root A4 resume element to capture
 * @param {string} candidateName - Candidate's name for meaningful filename
 * @returns {Promise<boolean>}
 */
export async function exportResumeToPdf(element, candidateName = "Full-Stack-Developer") {
  if (!element) {
    throw new Error("Resume document element not found for export");
  }

  // Create clean, professional filename
  const cleanName = (candidateName || "Full_Stack_Developer")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${cleanName}_Resume.pdf`;

  // Standard A4 dimensions in mm
  const a4WidthMm = 210;
  const a4HeightMm = 297;

  try {
    // Render the DOM element to high-res canvas (scale 2 = 192 DPI for crystal-clear text)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc, clonedEl) => {
        // Reset any preview scale transforms so capture occurs at true 100% (794px width)
        clonedEl.style.transform = "none";
        clonedEl.style.margin = "0";
        clonedEl.style.boxShadow = "none";
        clonedEl.style.width = "794px";
        clonedEl.style.maxWidth = "794px";
        clonedEl.style.overflow = "visible";

        let parent = clonedEl.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.transform = "none";
          parent.style.overflow = "visible";
          parent = parent.parentElement;
        }
      },
    });

    // Calculate canvas page dimensions based on A4 ratio (297 / 210 = 1.4142857)
    const canvasPageHeight = Math.round((canvas.width * a4HeightMm) / a4WidthMm);
    const totalHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // If total content fits on a single page (with 3% tolerance)
    if (totalHeight <= canvasPageHeight * 1.03) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = canvasPageHeight;
      const ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, 0);

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(imgData, "JPEG", 0, 0, a4WidthMm, a4HeightMm, undefined, "FAST");
    } else {
      // Multi-page slicing using dedicated canvas slices to prevent coordinate clipping
      const totalPages = Math.ceil(totalHeight / canvasPageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = canvasPageHeight;
        const ctx = pageCanvas.getContext("2d");

        // Fill background with white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Slice exact vertical section from source canvas
        const sourceY = i * canvasPageHeight;
        const sourceHeight = Math.min(canvasPageHeight, totalHeight - sourceY);

        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sourceHeight,
          0,
          0,
          canvas.width,
          sourceHeight
        );

        const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, 0, a4WidthMm, a4HeightMm, undefined, "FAST");
      }
    }

    // Save and download PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
}
