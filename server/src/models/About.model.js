import { AboutModel as About, cleanDoc } from "../db/schemas.js";

export const AboutModel = {
  async get() {
    const about = await About.findOne().lean();
    return cleanDoc(about);
  },

  async update(updates) {
    const updated = await About.findOneAndUpdate(
      {},
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true }
    ).lean();
    return cleanDoc(updated);
  },
};
