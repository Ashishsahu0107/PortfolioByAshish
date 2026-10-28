import { ResumeModel as Resume, cleanDoc, cleanDocs } from "../db/schemas.js";
import { initialResumeTemplates, initialResumeData } from "../db/seedData.js";
import { DeveloperModel } from "./Developer.model.js";

export const ResumeModelService = {
  /**
   * Ensures resume templates exist and at least one is approved
   */
  async ensureInitialResumes() {
    try {
      const count = await Resume.countDocuments();
      if (count === 0) {
        console.log("[ResumeModel] No resume templates in DB. Initializing default templates...");
        await Resume.insertMany(initialResumeTemplates);
      }

      // Check if any template is approved; if not, approve "modern"
      const approved = await Resume.findOne({ isApproved: true }).lean();
      if (!approved) {
        await Resume.findOneAndUpdate(
          { templateId: "modern" },
          { isApproved: true, status: "approved", approvedAt: new Date() },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn("[ResumeModel] Auto-init check error:", err.message);
    }
  },

  /**
   * Fetch the currently approved resume (Publicly accessible)
   */
  async getApproved() {
    await this.ensureInitialResumes();
    const approved = await Resume.findOne({ isApproved: true, status: "approved" }).lean();
    if (!approved) {
      // Fallback: find any marked isApproved
      const fallback = await Resume.findOne({ isApproved: true }).lean();
      if (fallback) return cleanDoc(fallback);
      return null;
    }
    return cleanDoc(approved);
  },

  /**
   * List all resume templates and drafts (Admin only)
   */
  async list() {
    await this.ensureInitialResumes();
    const resumes = await Resume.find().sort({ createdAt: 1 }).lean();
    return cleanDocs(resumes);
  },

  /**
   * Fetch a single resume template by ID or templateId
   */
  async getById(idOrTemplateId) {
    await this.ensureInitialResumes();
    const resume = await Resume.findOne({
      $or: [{ id: idOrTemplateId }, { templateId: idOrTemplateId }],
    }).lean();
    return cleanDoc(resume);
  },

  /**
   * Approve ONE resume template as the official portfolio resume.
   * Atomically unapproves all other templates.
   */
  async approveTemplate(templateId, resumeDataOverride = null) {
    await this.ensureInitialResumes();
    if (!templateId) {
      throw new Error("templateId is required to approve a resume template.");
    }

    // 1. Mark ALL other resumes as draft / not approved
    await Resume.updateMany(
      {},
      { $set: { isApproved: false, status: "draft" } }
    );

    // 2. Prepare payload for the target template
    const updatePayload = {
      isApproved: true,
      status: "approved",
      approvedAt: new Date(),
    };

    if (resumeDataOverride && typeof resumeDataOverride === "object") {
      updatePayload.resumeData = resumeDataOverride;
    }

    // 3. Mark the selected template as approved
    let approved = await Resume.findOneAndUpdate(
      { templateId },
      { $set: updatePayload },
      { returnDocument: "after", upsert: true }
    ).lean();

    // If template had empty resumeData, fill from initial data
    if (!approved.resumeData || Object.keys(approved.resumeData).length === 0) {
      approved = await Resume.findOneAndUpdate(
        { templateId },
        { $set: { resumeData: initialResumeData } },
        { returnDocument: "after" }
      ).lean();
    }

    // 4. Optionally update developer profile's resume metadata
    try {
      await DeveloperModel.update({
        resumeApprovedTemplate: templateId,
        resumeLastApprovedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("[ResumeModel] Developer profile sync notice:", e.message);
    }

    return cleanDoc(approved);
  },

  /**
   * Update resume content / draft for a template
   */
  async updateResume(templateId, updates = {}) {
    await this.ensureInitialResumes();
    const payload = { ...updates, updatedAt: new Date() };
    delete payload._id;
    delete payload.id;

    // Do NOT allow setting isApproved through regular update
    delete payload.isApproved;
    delete payload.status;

    const updated = await Resume.findOneAndUpdate(
      { templateId },
      { $set: payload },
      { returnDocument: "after", upsert: true }
    ).lean();

    return cleanDoc(updated);
  },
};
