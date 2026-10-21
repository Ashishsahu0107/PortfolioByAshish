import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";
import {
  UserModel,
  DeveloperModel,
  AboutModel,
  SkillCategoryModel,
  ProjectModel,
  ExperienceModel,
  SectionModel,
  FormModel,
  SubmissionModel,
  MessageModel,
} from "./schemas.js";
import {
  initialDeveloper,
  initialAbout,
  initialSkills,
  initialProjects,
  initialExperience,
  initialSections,
  initialForms,
} from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");

async function loadDiskData(filename, fallback) {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function autoSeedIfEmpty() {
  const userCount = await UserModel.countDocuments();
  if (userCount > 0) {
    console.log("[MongoDB] Collections already populated. Skipping initial seed.");
    return;
  }

  console.log("==========================================");
  console.log("[MongoDB] Empty database detected. Seeding initial data into MongoDB...");
  console.log("==========================================");

  // 1. Users
  const diskUsers = await loadDiskData("users.json", null);
  if (diskUsers && Array.isArray(diskUsers) && diskUsers.length > 0) {
    await UserModel.insertMany(diskUsers);
    console.log(`[MongoDB Seed] Inserted ${diskUsers.length} user(s) from disk.`);
  } else {
    const hashedPassword = await bcrypt.hash(config.admin.password, 10);
    await UserModel.create({
      id: "usr_admin_root",
      email: config.admin.email.toLowerCase(),
      password: hashedPassword,
      name: config.admin.name,
      role: config.admin.role,
    });
    console.log("[MongoDB Seed] Created default admin user.");
  }

  // 2. Developer
  const diskDev = await loadDiskData("developer.json", initialDeveloper);
  await DeveloperModel.create(diskDev);
  console.log("[MongoDB Seed] Created developer profile.");

  // 3. About
  const diskAbout = await loadDiskData("about.json", initialAbout);
  await AboutModel.create(diskAbout);
  console.log("[MongoDB Seed] Created about document.");

  // 4. Skills
  const diskSkills = await loadDiskData("skills.json", initialSkills);
  if (Array.isArray(diskSkills) && diskSkills.length > 0) {
    await SkillCategoryModel.insertMany(
      diskSkills.map((c, idx) => ({ ...c, order: c.order !== undefined ? c.order : idx }))
    );
    console.log(`[MongoDB Seed] Inserted ${diskSkills.length} skill categories.`);
  }

  // 5. Projects
  const diskProjects = await loadDiskData("projects.json", initialProjects);
  if (Array.isArray(diskProjects) && diskProjects.length > 0) {
    await ProjectModel.insertMany(diskProjects);
    console.log(`[MongoDB Seed] Inserted ${diskProjects.length} projects.`);
  }

  // 6. Experience
  const diskExp = await loadDiskData("experience.json", initialExperience);
  if (Array.isArray(diskExp) && diskExp.length > 0) {
    await ExperienceModel.insertMany(diskExp);
    console.log(`[MongoDB Seed] Inserted ${diskExp.length} experience entries.`);
  }

  // 7. Sections
  const diskSections = await loadDiskData("sections.json", initialSections);
  if (Array.isArray(diskSections) && diskSections.length > 0) {
    await SectionModel.insertMany(diskSections);
    console.log(`[MongoDB Seed] Inserted ${diskSections.length} sections.`);
  }

  // 8. Forms
  const diskForms = await loadDiskData("forms.json", initialForms);
  if (Array.isArray(diskForms) && diskForms.length > 0) {
    await FormModel.insertMany(diskForms);
    console.log(`[MongoDB Seed] Inserted ${diskForms.length} forms.`);
  }

  // 9. Submissions
  const diskSubmissions = await loadDiskData("submissions.json", []);
  if (Array.isArray(diskSubmissions) && diskSubmissions.length > 0) {
    await SubmissionModel.insertMany(diskSubmissions);
    console.log(`[MongoDB Seed] Inserted ${diskSubmissions.length} submissions.`);
  }

  // 10. Messages
  const diskMessages = await loadDiskData("messages.json", []);
  if (Array.isArray(diskMessages) && diskMessages.length > 0) {
    await MessageModel.insertMany(diskMessages);
    console.log(`[MongoDB Seed] Inserted ${diskMessages.length} contact messages.`);
  }

  console.log("==========================================");
  console.log("[MongoDB Seed] MongoDB initialization complete!");
  console.log("==========================================");
}

export function getResolvedMongoUri() {
  const uri = config.mongodbUri;
  if (!uri || uri.includes("<db_username>") || uri.includes("<password>")) {
    console.warn(
      "[MongoDB Notice] MONGODB_URI in .env contains placeholder '<db_username>'. Falling back to local MongoDB: mongodb://127.0.0.1:27017/portfolio"
    );
    return "mongodb://127.0.0.1:27017/portfolio";
  }
  return uri;
}

export async function connectDB() {
  try {
    const uri = getResolvedMongoUri();
    console.log(`Connecting to MongoDB at: ${uri}...`);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected.");
    });

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected to MongoDB Database: " + (mongoose.connection.name || "portfolio"));

    // Run one-time auto-seeding if database is fresh
    await autoSeedIfEmpty();

    return mongoose.connection;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    throw err;
  }
}

export async function closeDB() {
  await mongoose.connection.close();
}
