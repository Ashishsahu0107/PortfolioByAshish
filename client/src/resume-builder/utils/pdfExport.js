import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates and downloads a clean, professional A4 PDF from an HTML element
 * @param {HTMLElement} element - The root A4 resume element to capture
 * @param {string} candidateName - Candidate's name for meaningful filename
 * @returns {Promise<boolean>}
 */
export async function exportResumeToPdf(element, candidateName = "Full-Stack-Developer") {
  if (!element) {
    throw new Error("Resume document element not found for export");
  }

  // Create clean filename
  const cleanName = (candidateName || "Full_Stack_Developer")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${cleanName}_Resume.pdf`;

  // Standard A4 dimensions in mm
  const a4WidthMm = 210;
  const a4HeightMm = 297;

  try {
    // Render the DOM element to high-res canvas (scale 2 = 192 DPI, crisp text)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Compute dimensions in mm
    const imgWidthMm = a4WidthMm;
    const imgHeightMm = (canvas.height * a4WidthMm) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Check if multi-page is needed
    if (imgHeightMm <= a4HeightMm + 2) {
      // Single page
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidthMm, imgHeightMm, undefined, "FAST");
    } else {
      // Multi-page slicing
      let heightLeftMm = imgHeightMm;
      let positionMm = 0;

      pdf.addImage(imgData, "JPEG", 0, positionMm, imgWidthMm, imgHeightMm, undefined, "FAST");
      heightLeftMm -= a4HeightMm;

      while (heightLeftMm > 2) {
        positionMm -= a4HeightMm;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, positionMm, imgWidthMm, imgHeightMm, undefined, "FAST");
        heightLeftMm -= a4HeightMm;
      }
    }

    // Save PDF to trigger browser download
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
}
