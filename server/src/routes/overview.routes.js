import { Router } from "express";
import { getOverviewStats } from "../controllers/overview.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/overview (Protected) - Dashboard stats & system telemetry
router.get("/", authMiddleware, getOverviewStats);

export default router;
