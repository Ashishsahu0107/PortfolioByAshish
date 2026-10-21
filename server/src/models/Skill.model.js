import { SkillCategoryModel as SkillCategory, cleanDocs } from "../db/schemas.js";

export const SkillModel = {
  async getAll() {
    const list = await SkillCategory.find().sort({ order: 1 }).lean();
    return cleanDocs(list);
  },

  async updateAll(categories) {
    if (!Array.isArray(categories)) {
      throw new Error("Categories payload must be an array");
    }
    await SkillCategory.deleteMany({});
    const inserted = await SkillCategory.insertMany(
      categories.map((c, idx) => ({
        ...c,
        id: c.id || `skill_${idx}`,
        order: c.order !== undefined ? c.order : idx,
      }))
    );
    return cleanDocs(inserted.map((s) => s.toObject()));
  },
};
