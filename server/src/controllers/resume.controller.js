import { ResumeModelService } from "../models/Resume.model.js";

const VALID_TEMPLATES = [
  "modern",
  "minimal",
  "classic",
  "professional",
  "executive",
  "developer",
  "elegant",
  "editorial",
  "compact",
];

/**
 * Public: Get the currently approved resume template and data.
 * Used by the portfolio's "Resume PDF" button.
 */
export async function getApprovedResume(req, res, next) {
  try {
    const approved = await ResumeModelService.getApproved();
    if (!approved) {
      return res.status(404).json({
        success: false,
        message: "No approved resume template is currently available.",
      });
    }

    res.json({
      success: true,
      data: approved,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Protected: List all resume templates and their approval status.
 * Used by the Admin Resume Builder.
 */
export async function getAllResumes(req, res, next) {
  try {
    const list = await ResumeModelService.list();
    res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Protected: Get specific template details.
 */
export async function getResumeById(req, res, next) {
  try {
    const { templateId } = req.params;
    const resume = await ResumeModelService.getById(templateId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: `Resume template "${templateId}" not found.`,
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Protected: Approve ONE resume template.
 * Automatically marks all other templates as draft.
 */
export async function approveResume(req, res, next) {
  try {
    const templateId = req.params.templateId || req.body.templateId;
    const { resumeData } = req.body;

    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: "A valid templateId is required to approve a resume.",
      });
    }

    if (!VALID_TEMPLATES.includes(templateId.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid template "${templateId}". Supported: ${VALID_TEMPLATES.join(", ")}`,
      });
    }

    const approved = await ResumeModelService.approveTemplate(
      templateId.toLowerCase(),
      resumeData
    );

    res.json({
      success: true,
      message: `Resume template "${approved.title || templateId}" has been approved. It is now the only active resume downloadable from your portfolio.`,
      data: approved,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Protected: Update template content / draft.
 */
export async function updateResume(req, res, next) {
  try {
    const { templateId } = req.params;
    const updates = req.body;

    const updated = await ResumeModelService.updateResume(templateId, updates);
    res.json({
      success: true,
      message: `Resume template "${templateId}" saved successfully.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Public: Validate download request for approved resume.
 * Rejects requests to download unapproved/draft templates.
 */
export async function downloadApprovedResume(req, res, next) {
  try {
    const { templateId } = req.query;
    const approved = await ResumeModelService.getApproved();

    if (!approved) {
      return res.status(404).json({
        success: false,
        message: "No approved resume is currently available for download.",
      });
    }

    // Security check: If templateId is specified in query, it MUST match the approved one
    if (templateId && templateId.toLowerCase() !== approved.templateId.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot download an unapproved or draft resume template. Only the currently approved template is available.",
      });
    }

    // Return the authorized approved resume payload
    res.json({
      success: true,
      message: "Approved resume download authorized.",
      data: approved,
    });
  } catch (err) {
    next(err);
  }
}
