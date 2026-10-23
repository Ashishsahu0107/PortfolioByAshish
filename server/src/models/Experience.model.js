import { ExperienceModel as Experience, cleanDoc, cleanDocs } from "../db/schemas.js";

export const ExperienceModel = {
  async findAll({ type } = {}) {
    const query = type ? { type } : {};
    const list = await Experience.find(query).sort({ createdAt: -1 }).lean();
    return cleanDocs(list);
  },

  async findById(id) {
    const item = await Experience.findOne({ id }).lean();
    return cleanDoc(item);
  },

  async create(data) {
    const id = data.id || `exp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Experience.create({
      id,
      type: data.type || "work",
      title: data.title ? data.title.trim() : "",
      organization: data.organization || "",
      location: data.location || "",
      period: data.period || "",
      status: data.status || "",
      description: data.description || "",
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
    });
    return cleanDoc(created.toObject());
  },

  async update(id, updates) {
    const updated = await Experience.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { returnDocument: "after" }
    ).lean();
    return cleanDoc(updated);
  },

  async bulkSave(entries) {
    if (!Array.isArray(entries)) {
      throw new Error("Experience payload must be an array");
    }
    await Experience.deleteMany({});
    const inserted = await Experience.insertMany(entries);
    return cleanDocs(inserted.map((e) => e.toObject()));
  },

  async delete(id) {
    const doc = await Experience.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};
