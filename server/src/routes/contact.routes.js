import { Router } from "express";
import {
  getContactInfo,
  updateContactInfo,
  sendMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} from "../controllers/contact.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public endpoints
router.get("/", getContactInfo);
router.post("/send", sendMessage);

// Protected contact settings
router.put("/", authMiddleware, updateContactInfo);

// Protected inbox message management
router.get("/messages", authMiddleware, getMessages);
router.put("/messages/:id/read", authMiddleware, toggleMessageRead);
router.delete("/messages/:id", authMiddleware, deleteMessage);

export default router;
