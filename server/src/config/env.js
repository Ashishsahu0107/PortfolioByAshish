import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "fallback_super_secret_jwt_key_2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || `"Ashish Portfolio Security" <${process.env.SMTP_USER || "no-reply@ashish.dev"}>`,
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@ashish.dev",
    password: process.env.ADMIN_PASSWORD || "AdminPassword123!",
    name: process.env.ADMIN_NAME || "Ashish Sahu",
    role: process.env.ADMIN_ROLE || "Portfolio Owner & Full Stack Engineer",
  },
};
