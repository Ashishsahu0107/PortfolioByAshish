import { Router } from "express";
import {
  getForms,
  getFormByIdOrSlug,
  createForm,
  updateForm,
  deleteForm,
  submitForm,
  getFormSubmissions,
  getAllSubmissions,
  deleteSubmission,
} from "../controllers/forms.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Submissions management (Protected - defined before /:id param route)
router.get("/submissions/all", authMiddleware, getAllSubmissions);
router.delete("/submissions/:submissionId", authMiddleware, deleteSubmission);

// Forms management
router.get("/", getForms);
router.get("/:id", getFormByIdOrSlug);
router.post("/", authMiddleware, createForm);
router.put("/:id", authMiddleware, updateForm);
router.delete("/:id", authMiddleware, deleteForm);

// Form submission execution (Public)
router.post("/:id/submit", submitForm);

// Form submissions by form ID (Protected)
router.get("/:id/submissions", authMiddleware, getFormSubmissions);

export default router;
