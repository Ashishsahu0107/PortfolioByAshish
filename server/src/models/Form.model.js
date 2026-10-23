import { FormModel as Form, cleanDoc, cleanDocs } from "../db/schemas.js";

export const FormModel = {
  async findAll() {
    const list = await Form.find().sort({ createdAt: 1 }).lean();
    return cleanDocs(list);
  },

  async findByIdOrSlug(idOrSlug) {
    if (!idOrSlug) return null;
    const term = String(idOrSlug).toLowerCase();
    const doc = await Form.findOne({
      $or: [{ id: idOrSlug }, { slug: term }],
    }).lean();
    return cleanDoc(doc);
  },

  async create(data) {
    const cleanSlug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const id = data.id || `form_${Date.now().toString(36)}`;
    const created = await Form.create({
      id,
      name: data.name.trim(),
      slug: cleanSlug,
      description: data.description || "",
      enabled: data.enabled !== undefined ? data.enabled : true,
      submitButtonText: data.submitButtonText || "Submit",
      successMessage:
        data.successMessage ||
        "Your submission has been received successfully.",
      fields: Array.isArray(data.fields) ? data.fields : [],
    });
    return cleanDoc(created.toObject());
  },

  async update(id, updates) {
    const updated = await Form.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { returnDocument: "after" }
    ).lean();
    return cleanDoc(updated);
  },

  async delete(id) {
    const doc = await Form.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};
