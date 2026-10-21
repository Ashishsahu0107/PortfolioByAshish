import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";
import { getResolvedMongoUri } from "./mongodb.js";
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

async function runMongoDBSeed() {
  const uri = getResolvedMongoUri();
  console.log("==========================================");
  console.log("Starting MongoDB Database Seeding...");
  console.log(`Connecting to: ${uri}`);
  console.log("==========================================");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name);

  // Clear existing collections
  await Promise.all([
    UserModel.deleteMany({}),
    DeveloperModel.deleteMany({}),
    AboutModel.deleteMany({}),
    SkillCategoryModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    ExperienceModel.deleteMany({}),
    SectionModel.deleteMany({}),
    FormModel.deleteMany({}),
    SubmissionModel.deleteMany({}),
    MessageModel.deleteMany({}),
  ]);
  console.log("[SEED] Cleared existing MongoDB collections.");

  // 1. Users
  const diskUsers = await loadDiskData("users.json", null);
  if (diskUsers && Array.isArray(diskUsers) && diskUsers.length > 0) {
    await UserModel.insertMany(diskUsers);
    console.log(`[SEED] Populated ${diskUsers.length} user(s) into MongoDB.`);
  } else {
    const hashedPassword = await bcrypt.hash(config.admin.password, 10);
    await UserModel.create({
      id: "usr_admin_root",
      email: config.admin.email.toLowerCase(),
      password: hashedPassword,
      name: config.admin.name,
      role: config.admin.role,
    });
    console.log("[SEED] Created default root admin into MongoDB.");
  }

  // 2. Developer profile
  const diskDev = await loadDiskData("developer.json", initialDeveloper);
  await DeveloperModel.create(diskDev);
  console.log("[SEED] Populated developer profile into MongoDB.");

  // 3. About
  const diskAbout = await loadDiskData("about.json", initialAbout);
  await AboutModel.create(diskAbout);
  console.log("[SEED] Populated about section into MongoDB.");

  // 4. Skills
  const diskSkills = await loadDiskData("skills.json", initialSkills);
  if (Array.isArray(diskSkills)) {
    await SkillCategoryModel.insertMany(
      diskSkills.map((c, idx) => ({ ...c, order: c.order !== undefined ? c.order : idx }))
    );
    console.log(`[SEED] Populated ${diskSkills.length} skill categories into MongoDB.`);
  }

  // 5. Projects
  const diskProjects = await loadDiskData("projects.json", initialProjects);
  if (Array.isArray(diskProjects)) {
    await ProjectModel.insertMany(diskProjects);
    console.log(`[SEED] Populated ${diskProjects.length} projects into MongoDB.`);
  }

  // 6. Experience
  const diskExp = await loadDiskData("experience.json", initialExperience);
  if (Array.isArray(diskExp)) {
    await ExperienceModel.insertMany(diskExp);
    console.log(`[SEED] Populated ${diskExp.length} experience entries into MongoDB.`);
  }

  // 7. Sections
  const diskSections = await loadDiskData("sections.json", initialSections);
  if (Array.isArray(diskSections)) {
    await SectionModel.insertMany(diskSections);
    console.log(`[SEED] Populated ${diskSections.length} dynamic sections into MongoDB.`);
  }

  // 8. Forms
  const diskForms = await loadDiskData("forms.json", initialForms);
  if (Array.isArray(diskForms)) {
    await FormModel.insertMany(diskForms);
    console.log(`[SEED] Populated ${diskForms.length} forms into MongoDB.`);
  }

  // 9. Submissions
  const diskSubmissions = await loadDiskData("submissions.json", []);
  if (Array.isArray(diskSubmissions) && diskSubmissions.length > 0) {
    await SubmissionModel.insertMany(diskSubmissions);
    console.log(`[SEED] Preserved ${diskSubmissions.length} submissions in MongoDB.`);
  }

  // 10. Messages
  const diskMessages = await loadDiskData("messages.json", []);
  if (Array.isArray(diskMessages) && diskMessages.length > 0) {
    await MessageModel.insertMany(diskMessages);
    console.log(`[SEED] Preserved ${diskMessages.length} contact messages in MongoDB.`);
  }

  console.log("==========================================");
  console.log("MongoDB Database successfully seeded!");
  console.log("==========================================");

  await mongoose.connection.close();
  process.exit(0);
}

runMongoDBSeed().catch(async (err) => {
  console.error("MongoDB seeding failed:", err);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});
