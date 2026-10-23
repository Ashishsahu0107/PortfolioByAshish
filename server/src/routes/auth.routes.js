import { Router } from "express";
import {
  sendRegistrationOtp,
  verifyRegistrationOtp,
  completeRegistration,
  login,
  getMe,
  changePassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Registration flow endpoints
router.post("/send-otp", sendRegistrationOtp);
router.post("/verify-otp", verifyRegistrationOtp);
router.post("/register", completeRegistration);

// Public login
router.post("/login", login);

// Protected session inspection
router.get("/me", authMiddleware, getMe);

// Protected credential update
router.post("/change-password", authMiddleware, changePassword);

export default router;
