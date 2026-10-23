import { DeveloperModel as Developer, cleanDoc } from "../db/schemas.js";

export const DeveloperModel = {
  async get() {
    const dev = await Developer.findOne().lean();
    if (!dev) return null;
    const cleaned = cleanDoc(dev);
    if (cleaned.name && (!cleaned.firstName || !cleaned.lastName)) {
      const parts = cleaned.name.trim().split(/\s+/);
      cleaned.firstName = cleaned.firstName || parts[0] || "";
      cleaned.lastName = cleaned.lastName || parts.slice(1).join(" ") || "";
    }
    if (cleaned.location && !cleaned.locationShort) {
      cleaned.locationShort = cleaned.location.split(",")[0].trim();
    }
    return cleaned;
  },

  async update(updates) {
    const payload = { ...updates };
    if (payload.name) {
      const parts = payload.name.trim().split(/\s+/);
      payload.firstName = parts[0] || "";
      payload.lastName = parts.slice(1).join(" ") || "";
    } else if (payload.firstName || payload.lastName) {
      payload.name = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
    }
    if (payload.location) {
      payload.locationShort = payload.location.split(",")[0].trim();
    }

    const updated = await Developer.findOneAndUpdate(
      {},
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after", upsert: true }
    ).lean();
    return cleanDoc(updated);
  },
};

