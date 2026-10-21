import { DeveloperModel as Developer, cleanDoc } from "../db/schemas.js";

export const DeveloperModel = {
  async get() {
    const dev = await Developer.findOne().lean();
    return cleanDoc(dev);
  },

  async update(updates) {
    const updated = await Developer.findOneAndUpdate(
      {},
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true }
    ).lean();
    return cleanDoc(updated);
  },
};
