import { Router } from "express";
import { getPortfolioBundle } from "../controllers/bundle.controller.js";

const router = Router();

// GET /api/portfolio-bundle - Public high-speed combined portfolio data endpoint
router.get("/", getPortfolioBundle);

export default router;
