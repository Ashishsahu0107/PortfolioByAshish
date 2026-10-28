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

async function autoSeedIfEmpty() {
  // Ensure resume templates exist in DB even if other collections are populated
  const resumeCount = await ResumeModel.countDocuments();
  if (resumeCount === 0 && Array.isArray(initialResumeTemplates)) {
    await ResumeModel.insertMany(initialResumeTemplates);
    console.log(`[MongoDB Seed] Initialized ${initialResumeTemplates.length} resume templates into MongoDB.`);
  }

  const devCount = await DeveloperModel.countDocuments();
  if (devCount > 0) {
    console.log("[MongoDB] Collections already populated. Skipping initial seed.");
    return;
  }

  console.log("==========================================");
  console.log("[MongoDB] Empty database detected. Seeding initial data into MongoDB...");
  console.log("==========================================");

  // 1. Users are registered through the secure OTP registration system
  console.log("[MongoDB Seed] Admin accounts are created dynamically via OTP registration.");

  // 2. Developer
  await DeveloperModel.create(initialDeveloper);
  console.log("[MongoDB Seed] Created developer profile.");

  // 3. About
  await AboutModel.create(initialAbout);
  console.log("[MongoDB Seed] Created about document.");

  // 4. Skills
  if (Array.isArray(initialSkills) && initialSkills.length > 0) {
    await SkillCategoryModel.insertMany(
      initialSkills.map((c, idx) => ({ ...c, order: c.order !== undefined ? c.order : idx }))
    );
    console.log(`[MongoDB Seed] Inserted ${initialSkills.length} skill categories.`);
  }

  // 5. Projects
  if (Array.isArray(initialProjects) && initialProjects.length > 0) {
    await ProjectModel.insertMany(initialProjects);
    console.log(`[MongoDB Seed] Inserted ${initialProjects.length} projects.`);
  }

  // 6. Experience
  if (Array.isArray(initialExperience) && initialExperience.length > 0) {
    await ExperienceModel.insertMany(initialExperience);
    console.log(`[MongoDB Seed] Inserted ${initialExperience.length} experience entries.`);
  }

  // 7. Sections
  if (Array.isArray(initialSections) && initialSections.length > 0) {
    await SectionModel.insertMany(initialSections);
    console.log(`[MongoDB Seed] Inserted ${initialSections.length} sections.`);
  }

  // 8. Forms
  if (Array.isArray(initialForms) && initialForms.length > 0) {
    await FormModel.insertMany(initialForms);
    console.log(`[MongoDB Seed] Inserted ${initialForms.length} forms.`);
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
