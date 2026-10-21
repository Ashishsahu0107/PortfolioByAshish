import { Router } from "express";
import {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  bulkUpdateSections,
  deleteSection,
} from "../controllers/sections.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getSections);
router.get("/:id", getSectionById);

// Protected routes
router.post("/", authMiddleware, createSection);
router.put("/", authMiddleware, bulkUpdateSections);
router.put("/:id", authMiddleware, updateSection);
router.delete("/:id", authMiddleware, deleteSection);

export default router;
