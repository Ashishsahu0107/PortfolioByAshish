import { SectionModel as Section, cleanDoc, cleanDocs } from "../db/schemas.js";

export const SectionModel = {
  async findAll({ includeAll = false } = {}) {
    const query = includeAll ? {} : { enabled: { $ne: false } };
    const sections = await Section.find(query).sort({ order: 1 }).lean();
    return cleanDocs(sections);
  },

  async findById(id) {
    const section = await Section.findOne({ id }).lean();
    return cleanDoc(section);
  },

  async findBySlug(slug) {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase();
    const section = await Section.findOne({ slug: cleanSlug }).lean();
    return cleanDoc(section);
  },

  async create(data) {
    const cleanSlug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const maxOrderDoc = await Section.findOne().sort({ order: -1 }).lean();
    const nextOrder = (maxOrderDoc?.order || 0) + 1;
    const id = data.id || `sec_${cleanSlug}_${Date.now().toString(36)}`;

    const created = await Section.create({
      id,
      name: data.name.trim(),
      slug: cleanSlug,
      type: "custom",
      enabled: data.enabled !== undefined ? data.enabled : true,
      order: data.order || nextOrder,
      desc: data.desc || "",
      content: data.content || {
        heading: data.name.trim(),
        subheading: "",
        body: "",
        items: [],
      },
    });
    return cleanDoc(created.toObject());
  },

  async update(id, updates) {
    const updated = await Section.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean();
    return cleanDoc(updated);
  },

  async bulkSave(sectionsList) {
    if (!Array.isArray(sectionsList)) {
      throw new Error("Sections payload must be an array");
    }
    await Section.deleteMany({});
    const reordered = sectionsList.map((s, idx) => ({
      ...s,
      order: s.order || idx + 1,
    }));
    const inserted = await Section.insertMany(reordered);
    return cleanDocs(inserted.map((s) => s.toObject()));
  },

  async delete(id) {
    const doc = await Section.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};
