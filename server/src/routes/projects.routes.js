import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  bulkUpdateProjects,
  deleteProject,
} from "../controllers/projects.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected routes
router.post("/", authMiddleware, createProject);
router.put("/", authMiddleware, bulkUpdateProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
