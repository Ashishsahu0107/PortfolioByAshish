import { SubmissionModel as Submission, cleanDoc, cleanDocs } from "../db/schemas.js";

export const SubmissionModel = {
  async findAll() {
    const list = await Submission.find().sort({ submittedAt: -1 }).lean();
    return cleanDocs(list);
  },

  async findByFormIdOrSlug(formIdentifier) {
    if (!formIdentifier) return [];
    const term = String(formIdentifier).toLowerCase();
    const list = await Submission.find({
      $or: [{ formId: formIdentifier }, { formSlug: term }],
    })
      .sort({ submittedAt: -1 })
      .lean();
    return cleanDocs(list);
  },

  async create(data) {
    const id = data.id || `sub_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Submission.create({
      ...data,
      id,
      submittedAt: new Date(),
    });
    return cleanDoc(created.toObject());
  },

  async delete(id) {
    const doc = await Submission.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};
