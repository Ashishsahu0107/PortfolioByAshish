import mongoose from "mongoose";
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
    const payload = { ...data };
    delete payload._id;
    delete payload.__v;

    const id = payload.id || `sub_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Submission.create({
      ...payload,
      id,
      submittedAt: new Date(),
    });
    return cleanDoc(created);
  },

  async delete(id) {
    if (!id) return false;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Submission.findOneAndDelete({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : []),
      ],
    }).lean();
    return !!doc;
  },
};
