import { AboutModel as About, cleanDoc } from "../db/schemas.js";

export const AboutModel = {
  async get() {
    const about = await About.findOne().lean();
    return cleanDoc(about);
  },

  async update(updates) {
    const payload = { ...updates };
    delete payload._id;
    delete payload.__v;

    const updated = await About.findOneAndUpdate(
      {},
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after", upsert: true },
    ).lean();
    return cleanDoc(updated);
  },
};
