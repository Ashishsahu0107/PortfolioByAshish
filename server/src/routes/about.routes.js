import { Router } from "express";
import { getAbout, updateAbout } from "../controllers/about.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/about (Public)
router.get("/", getAbout);

// PUT /api/about (Protected)
router.put("/", authMiddleware, updateAbout);

export default router;
