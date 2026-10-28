import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getApprovedResume,
  getAllResumes,
  getResumeById,
  approveResume,
  updateResume,
  downloadApprovedResume,
} from "../controllers/resume.controller.js";

const router = Router();

// ── Public Routes (Used by Portfolio Visitors) ──
// 1. Fetch currently approved resume template & data
router.get("/approved", getApprovedResume);

// 2. Download endpoint (enforces that unapproved/draft templates cannot be downloaded)
router.get("/download", downloadApprovedResume);

// ── Protected Admin Routes (Used by Admin Resume Builder) ──
// 3. List all templates and approval statuses
router.get("/", authMiddleware, getAllResumes);

// 4. Get specific template details
router.get("/:templateId", authMiddleware, getResumeById);

// 5. Approve one resume template as active portfolio resume
router.post("/approve", authMiddleware, approveResume);
router.put("/:templateId/approve", authMiddleware, approveResume);

// 6. Update resume data / draft for a template
router.put("/:templateId", authMiddleware, updateResume);

export default router;
