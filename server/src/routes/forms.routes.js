import { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import {
  getForms,
  getFormByIdOrSlug,
  createForm,
  duplicateForm,
  updateForm,
  deleteForm,
  submitForm,
  getFormSubmissions,
  getAllSubmissions,
  deleteSubmission,
} from "../controllers/forms.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const submissionsUploadDir = path.resolve(__dirname, "../../uploads/form_submissions");

if (!fs.existsSync(submissionsUploadDir)) {
  fs.mkdirSync(submissionsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionsUploadDir);
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, safeExt).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${cleanBase}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${safeExt}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Security check: reject executable and script files
    const disallowedExts = [".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".vbs", ".msi", ".jar"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (disallowedExts.includes(ext)) {
      return cb(new Error(`File type ${ext} is not allowed for security reasons.`));
    }
    cb(null, true);
  },
});

const router = Router();

// Submissions management (Protected - defined before /:id param route)
router.get("/submissions/all", authMiddleware, getAllSubmissions);
router.delete("/submissions/:submissionId", authMiddleware, deleteSubmission);

// Forms management
router.get("/", getForms);
router.get("/:id", getFormByIdOrSlug);
router.post("/", authMiddleware, createForm);
router.post("/:id/duplicate", authMiddleware, duplicateForm);
router.put("/:id", authMiddleware, updateForm);
router.delete("/:id", authMiddleware, deleteForm);

// Form submission execution (Public, supports both JSON and multipart file uploads)
router.post("/:id/submit", upload.any(), submitForm);

// Form submissions by form ID (Protected)
router.get("/:id/submissions", authMiddleware, getFormSubmissions);

export default router;

