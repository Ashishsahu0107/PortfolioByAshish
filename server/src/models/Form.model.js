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
    let cleanSlug = (data.slug || data.name || "form")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) cleanSlug = `form-${Date.now().toString(36)}`;

    // Ensure slug uniqueness
    const existing = await Form.findOne({ slug: cleanSlug }).lean();
    if (existing) {
      cleanSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const id = data.id || `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Form.create({
      id,
      name: (data.name || "Untitled Form").trim(),
      slug: cleanSlug,
      description: data.description || "",
      enabled: data.enabled !== undefined ? Boolean(data.enabled) : true,
      submitButtonText: data.submitButtonText || "Submit",
      successMessage:
        data.successMessage ||
        "Your submission has been received successfully.",
      fields: Array.isArray(data.fields) ? data.fields : [],
    });
    return cleanDoc(created.toObject());
  },

  async duplicate(id) {
    const original = await this.findByIdOrSlug(id);
    if (!original) return null;

    const baseSlug = `${original.slug || "form"}-copy`;
    const newName = `${original.name} (Copy)`;

    const clonedFields = (original.fields || []).map((f) => ({
      ...f,
      id: "f_" + Math.random().toString(36).substring(2, 9),
    }));

    return this.create({
      name: newName,
      slug: `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`,
      description: original.description || "",
      enabled: false, // Default duplicated forms to draft
      submitButtonText: original.submitButtonText || "Submit",
      successMessage: original.successMessage || "Your submission has been received successfully.",
      fields: clonedFields,
    });
  },

  async update(id, updates) {
    const payload = { ...updates };
    if (payload.slug) {
      payload.slug = payload.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const updated = await Form.findOneAndUpdate(
      { id },
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after" }
    ).lean();
    return cleanDoc(updated);
  },

  async delete(id) {
    const doc = await Form.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};

