import mongoose from "mongoose";
import { ExperienceModel as Experience, cleanDoc, cleanDocs } from "../db/schemas.js";

export const ExperienceModel = {
  async findAll({ type } = {}) {
    const query = type ? { type } : {};
    const list = await Experience.find(query).sort({ createdAt: -1 }).lean();
    return cleanDocs(list);
  },

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const item = await Experience.findOne({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : []),
      ],
    }).lean();
    return cleanDoc(item);
  },

  async create(data) {
    const payload = { ...data };
    delete payload._id;
    delete payload.__v;

    const id = payload.id || `exp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Experience.create({
      id,
      type: payload.type || "work",
      title: payload.title ? payload.title.trim() : "",
      organization: payload.organization || "",
      location: payload.location || "",
      period: payload.period || "",
      status: payload.status || "",
      description: payload.description || "",
      highlights: Array.isArray(payload.highlights) ? payload.highlights : [],
    });
    return cleanDoc(created);
  },

  async update(id, updates) {
    if (!id) return null;
    const payload = { ...updates };
    delete payload._id;
    delete payload.__v;
    delete payload.id;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const updated = await Experience.findOneAndUpdate(
      {
        $or: [
          { id },
          ...(isObjectId ? [{ _id: id }] : []),
        ],
      },
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after" }
    ).lean();
    return cleanDoc(updated);
  },

  async bulkSave(entries) {
    if (!Array.isArray(entries)) {
      throw new Error("Experience payload must be an array");
    }
    const sanitized = entries.map((e, idx) => {
      const copy = { ...e };
      delete copy._id;
      delete copy.__v;
      if (!copy.id) copy.id = `exp_${Date.now().toString(36)}_${idx}`;
      return copy;
    });

    await Experience.deleteMany({});
    const inserted = await Experience.insertMany(sanitized);
    return cleanDocs(inserted);
  },

  async delete(id) {
    if (!id) return false;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Experience.findOneAndDelete({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : []),
      ],
    }).lean();
    return !!doc;
  },
};
