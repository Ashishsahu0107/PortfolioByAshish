import mongoose from "mongoose";

// Helper to remove mongoose _id and __v from output objects
export function cleanDoc(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj._id;
  delete obj.__v;
  return obj;
}

export function cleanDocs(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(cleanDoc);
}

// 1. User Schema
const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: "Ashish Sahu" },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

// 2. Developer Schema
const developerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: "dev_profile" },
    name: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    role: { type: String, default: "" },
    tagline: { type: String, default: "" },
    graduatingYear: { type: String, default: "" },
    degree: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    availableForWork: { type: Boolean, default: true },
    statusPhrase: { type: String, default: "" },
    bio: { type: String, default: "" },
    philosophy: { type: String, default: "" },
    emailjsServiceId: { type: String, default: "" },
    emailjsTemplateId: { type: String, default: "" },
    emailjsPublicKey: { type: String, default: "" },
  },
  { timestamps: true, strict: false }
);

// 3. About Schema
const aboutSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: "about_content" },
    bio: { type: String, default: "" },
    philosophy: { type: String, default: "" },
    focusAreas: { type: [mongoose.Schema.Types.Mixed], default: [] },
    stats: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, strict: false }
);

// 4. Skill Category Schema
const skillCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    color: { type: String, default: "cyan" },
    skills: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String, default: "" },
          level: { type: Number, default: 80 },
          icon: { type: String, default: "" },
        },
      ],
      default: [],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

// 5. Project Schema
const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    number: { type: String, default: "01" },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    category: { type: String, default: "Full Stack" },
    year: { type: String, default: "2026" },
    color: { type: String, default: "#00f0ff" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    features: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    github: { type: String, default: "" },
    live: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);

// 6. Experience Schema
const experienceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, default: "work" },
    title: { type: String, required: true },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    period: { type: String, default: "" },
    status: { type: String, default: "" },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true, strict: false }
);

// 7. Dynamic Section Schema
const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, default: "custom" },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    desc: { type: String, default: "" },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, strict: false }
);

// 8. Form Builder Schema
const formSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    submitButtonText: { type: String, default: "Submit" },
    successMessage: { type: String, default: "Your submission has been received successfully." },
    fields: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, strict: false }
);

// 9. Form Submission Schema
const submissionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    formId: { type: String, index: true },
    formName: { type: String, default: "" },
    formSlug: { type: String, index: true },
    ip: { type: String, default: "127.0.0.1" },
    submittedAt: { type: Date, default: Date.now },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, strict: false }
);

// 10. Contact Message Schema
const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    subject: { type: String, default: "Portfolio Contact Inquiry" },
    message: { type: String, default: "" },
    read: { type: Boolean, default: false },
    ip: { type: String, default: "127.0.0.1" },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

// 11. OTP Verification Schema (Resend Integration)
const otpSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: "" },
    otpHash: { type: String, required: true },
    verificationToken: { type: String, default: null, index: true },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    cooldownUntil: { type: Date, default: null },
    lastSentAt: { type: Date, default: Date.now },
    requestCount: { type: Number, default: 1 },
    firstRequestAt: { type: Date, default: Date.now },
    ip: { type: String, default: "" },
    purpose: { type: String, default: "registration" },
  },
  { timestamps: true }
);

// 12. Resume Template / Approved Resume Schema
const resumeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    templateId: { type: String, required: true, index: true },
    title: { type: String, default: "" },
    tagline: { type: String, default: "" },
    badge: { type: String, default: "" },
    badgeColor: { type: String, default: "" },
    description: { type: String, default: "" },
    accent: { type: String, default: "#2563eb" },
    status: { type: String, enum: ["draft", "approved"], default: "draft", index: true },
    isApproved: { type: Boolean, default: false, index: true },
    approvedAt: { type: Date, default: null },
    resumeData: { type: Object, default: {} },
    pdfUrl: { type: String, default: "" },
    version: { type: Number, default: 1 },
    updatedBy: { type: String, default: "Admin" },
  },
  { timestamps: true, strict: false }
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export const DeveloperModel = mongoose.models.Developer || mongoose.model("Developer", developerSchema);
export const AboutModel = mongoose.models.About || mongoose.model("About", aboutSchema);
export const SkillCategoryModel = mongoose.models.SkillCategory || mongoose.model("SkillCategory", skillCategorySchema);
export const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);
export const ExperienceModel = mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
export const SectionModel = mongoose.models.Section || mongoose.model("Section", sectionSchema);
export const FormModel = mongoose.models.Form || mongoose.model("Form", formSchema);
export const SubmissionModel = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
export const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
export const OtpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export const ResumeModel = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

