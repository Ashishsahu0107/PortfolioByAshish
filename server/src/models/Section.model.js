import mongoose from "mongoose";
import { SectionModel as Section, cleanDoc, cleanDocs } from "../db/schemas.js";

export const SectionModel = {
  async findAll({ includeAll = false } = {}) {
    const query = includeAll ? {} : { enabled: { $ne: false } };
    const sections = await Section.find(query).sort({ order: 1 }).lean();
    return cleanDocs(sections);
  },

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const section = await Section.findOne({
      $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
    }).lean();
    return cleanDoc(section);
  },

  async findBySlug(slug) {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase();
    const section = await Section.findOne({ slug: cleanSlug }).lean();
    return cleanDoc(section);
  },

  async create(data) {
    const payload = { ...data };
    delete payload._id;
    delete payload.__v;

    const cleanSlug = (payload.slug || payload.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const maxOrderDoc = await Section.findOne().sort({ order: -1 }).lean();
    const nextOrder = (maxOrderDoc?.order || 0) + 1;
    const id = payload.id || `sec_${cleanSlug}_${Date.now().toString(36)}`;

    const created = await Section.create({
      id,
      name: payload.name.trim(),
      slug: cleanSlug,
      type: "custom",
      enabled: payload.enabled !== undefined ? payload.enabled : true,
      order: payload.order || nextOrder,
      desc: payload.desc || "",
      content: payload.content || {
        heading: payload.name.trim(),
        subheading: "",
        body: "",
        items: [],
      },
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
    const updated = await Section.findOneAndUpdate(
      {
        $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
      },
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after" },
    ).lean();
    return cleanDoc(updated);
  },

  async bulkSave(sectionsList) {
    if (!Array.isArray(sectionsList)) {
      throw new Error("Sections payload must be an array");
    }
    const sanitized = sectionsList.map((s, idx) => {
      const copy = { ...s };
      delete copy._id;
      delete copy.__v;
      if (!copy.id) copy.id = `sec_${Date.now().toString(36)}_${idx}`;
      copy.order = copy.order !== undefined ? copy.order : idx + 1;
      return copy;
    });

    await Section.deleteMany({});
    const inserted = await Section.insertMany(sanitized);
    return cleanDocs(inserted);
  },

  async delete(id) {
    if (!id) return false;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Section.findOneAndDelete({
      $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
    }).lean();
    return !!doc;
  },
};
