import { Router } from "express";
import { login, getMe, changePassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public login
router.post("/login", login);

// Protected session inspection
router.get("/me", authMiddleware, getMe);

// Protected credential update
router.post("/change-password", authMiddleware, changePassword);

export default router;
