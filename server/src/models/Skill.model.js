import {
  SkillCategoryModel as SkillCategory,
  cleanDocs,
} from "../db/schemas.js";

export const SkillModel = {
  async getAll() {
    const list = await SkillCategory.find().sort({ order: 1 }).lean();
    return cleanDocs(list);
  },

  async updateAll(categories) {
    if (!Array.isArray(categories)) {
      throw new Error("Categories payload must be an array");
    }
    const sanitized = categories.map((c, idx) => {
      const copy = { ...c };
      delete copy._id;
      delete copy.__v;
      return {
        ...copy,
        id: copy.id || `skill_${idx}`,
        order: copy.order !== undefined ? copy.order : idx,
      };
    });

    await SkillCategory.deleteMany({});
    const inserted = await SkillCategory.insertMany(sanitized);
    return cleanDocs(inserted);
  },
};
