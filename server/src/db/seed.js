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
  ResumeModel,
} from "./schemas.js";
import {
  initialDeveloper,
  initialAbout,
  initialSkills,
  initialProjects,
  initialExperience,
  initialSections,
  initialForms,
  initialResumeTemplates,
} from "./seedData.js";

async function runMongoDBSeed() {
  const uri = getResolvedMongoUri();
  console.log("==========================================");
  console.log("Starting MongoDB Database Seeding...");
  console.log(`Connecting to: ${uri}`);
  console.log("==========================================");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name);

  // Clear existing collections (preserving registered users)
  await Promise.all([
    DeveloperModel.deleteMany({}),
    AboutModel.deleteMany({}),
    SkillCategoryModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    ExperienceModel.deleteMany({}),
    SectionModel.deleteMany({}),
    FormModel.deleteMany({}),
    SubmissionModel.deleteMany({}),
    MessageModel.deleteMany({}),
    ResumeModel.deleteMany({}),
  ]);
  console.log("[SEED] Cleared existing content collections.");

  // 1. Ensure at least one admin account exists in MongoDB
  const userCount = await UserModel.countDocuments();
  if (userCount === 0) {
    const defaultPasswordHash = await bcrypt.hash("Admin@12345", 10);
    await UserModel.create({
      id: "user_root_admin",
      name: "Ashish Sahu",
      email: "ashishsahu01072005@gmail.com",
      password: defaultPasswordHash,
      role: "admin",
    });
    console.log(
      "[SEED] Created default root admin into MongoDB (ashishsahu01072005@gmail.com).",
    );
  } else {
    console.log(
      `[SEED] Preserved ${userCount} existing registered admin user(s).`,
    );
  }

  // 2. Developer profile
  await DeveloperModel.create(initialDeveloper);
  console.log("[SEED] Populated developer profile into MongoDB.");

  // 3. About
  await AboutModel.create(initialAbout);
  console.log("[SEED] Populated about section into MongoDB.");

  // 4. Skills
  if (Array.isArray(initialSkills)) {
    await SkillCategoryModel.insertMany(
      initialSkills.map((c, idx) => ({
        ...c,
        order: c.order !== undefined ? c.order : idx,
      })),
    );
    console.log(
      `[SEED] Populated ${initialSkills.length} skill categories into MongoDB.`,
    );
  }

  // 5. Projects
  if (Array.isArray(initialProjects)) {
    await ProjectModel.insertMany(initialProjects);
    console.log(
      `[SEED] Populated ${initialProjects.length} projects into MongoDB.`,
    );
  }

  // 6. Experience
  if (Array.isArray(initialExperience)) {
    await ExperienceModel.insertMany(initialExperience);
    console.log(
      `[SEED] Populated ${initialExperience.length} experience entries into MongoDB.`,
    );
  }

  // 7. Sections
  if (Array.isArray(initialSections)) {
    await SectionModel.insertMany(initialSections);
    console.log(
      `[SEED] Populated ${initialSections.length} dynamic sections into MongoDB.`,
    );
  }

  // 8. Forms
  if (Array.isArray(initialForms)) {
    await FormModel.insertMany(initialForms);
    console.log(`[SEED] Populated ${initialForms.length} forms into MongoDB.`);
  }

  // 9. Resume Templates (with default approved resume)
  if (Array.isArray(initialResumeTemplates)) {
    await ResumeModel.insertMany(initialResumeTemplates);
    console.log(
      `[SEED] Populated ${initialResumeTemplates.length} resume templates into MongoDB.`,
    );
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
