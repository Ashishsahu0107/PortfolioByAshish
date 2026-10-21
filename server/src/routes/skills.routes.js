import { Router } from "express";
import { getSkills, updateSkills } from "../controllers/skills.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/skills (Public)
router.get("/", getSkills);

// PUT /api/skills (Protected)
router.put("/", authMiddleware, updateSkills);

export default router;
