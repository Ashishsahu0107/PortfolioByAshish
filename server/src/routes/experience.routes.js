import { Router } from "express";
import {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  bulkUpdateExperience,
  deleteExperience,
} from "../controllers/experience.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getExperience);
router.get("/:id", getExperienceById);

// Protected routes
router.post("/", authMiddleware, createExperience);
router.put("/", authMiddleware, bulkUpdateExperience);
router.put("/:id", authMiddleware, updateExperience);
router.delete("/:id", authMiddleware, deleteExperience);

export default router;
