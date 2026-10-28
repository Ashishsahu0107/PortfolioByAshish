import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import developerRoutes from "./routes/developer.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import sectionsRoutes from "./routes/sections.routes.js";
import formsRoutes from "./routes/forms.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import overviewRoutes from "./routes/overview.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

const app = express();

// Middleware
const allowedOrigins = [
  config.clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://iamashish.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production" ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use("/uploads", express.static(uploadsDir));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    message: "Portfolio API Server is operational.",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/developer", developerRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/sections", sectionsRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/resume", resumeRoutes);

// Catch-all 404 for API endpoints
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
