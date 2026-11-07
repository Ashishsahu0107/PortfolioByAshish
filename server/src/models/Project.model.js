import mongoose from "mongoose";
import { ProjectModel as Project, cleanDoc, cleanDocs } from "../db/schemas.js";

export const ProjectModel = {
  async findAll({ featured, category } = {}) {
    const query = {};
    if (featured === "true") {
      query.featured = true;
    }
    if (category) {
      query.category = new RegExp(`^${category}$`, "i");
    }
    const projects = await Project.find(query)
      .sort({ number: 1, createdAt: -1 })
      .lean();
    return cleanDocs(projects);
  },

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne({
      $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
    }).lean();
    return cleanDoc(project);
  },

  async create(data) {
    const payload = { ...data };
    delete payload._id;
    delete payload.__v;

    const count = await Project.countDocuments();
    const number = payload.number || String(count + 1).padStart(2, "0");
    const id =
      payload.id ||
      `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const created = await Project.create({
      ...payload,
      id,
      number,
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
    const updated = await Project.findOneAndUpdate(
      {
        $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
      },
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after" },
    ).lean();
    return cleanDoc(updated);
  },

  async bulkSave(projectsList) {
    if (!Array.isArray(projectsList)) {
      throw new Error("Projects payload must be an array");
    }
    const sanitized = projectsList.map((p, idx) => {
      const copy = { ...p };
      delete copy._id;
      delete copy.__v;
      if (!copy.id) copy.id = `proj_${Date.now().toString(36)}_${idx}`;
      if (!copy.number) copy.number = String(idx + 1).padStart(2, "0");
      return copy;
    });

    await Project.deleteMany({});
    const inserted = await Project.insertMany(sanitized);
    return cleanDocs(inserted);
  },

  async delete(id) {
    if (!id) return false;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Project.findOneAndDelete({
      $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
    }).lean();
    return !!doc;
  },
};
