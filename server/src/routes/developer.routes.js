import { Router } from "express";
import { getDeveloper, updateDeveloper } from "../controllers/developer.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/developer (Public)
router.get("/", getDeveloper);

// PUT /api/developer (Protected)
router.put("/", authMiddleware, updateDeveloper);

export default router;
