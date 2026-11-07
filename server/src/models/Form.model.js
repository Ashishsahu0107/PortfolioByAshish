import mongoose from "mongoose";
import { FormModel as Form, cleanDoc, cleanDocs } from "../db/schemas.js";

export const FormModel = {
  async findAll() {
    const list = await Form.find().sort({ createdAt: 1 }).lean();
    return cleanDocs(list);
  },

  async findByIdOrSlug(idOrSlug) {
    if (!idOrSlug) return null;
    const term = String(idOrSlug).toLowerCase();
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const doc = await Form.findOne({
      $or: [
        { id: idOrSlug },
        { slug: term },
        ...(isObjectId ? [{ _id: idOrSlug }] : []),
      ],
    }).lean();
    return cleanDoc(doc);
  },

  async create(data) {
    const payload = { ...data };
    delete payload._id;
    delete payload.__v;

    let cleanSlug = (payload.slug || payload.name || "form")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) cleanSlug = `form-${Date.now().toString(36)}`;

    // Ensure slug uniqueness
    const existing = await Form.findOne({ slug: cleanSlug }).lean();
    if (existing) {
      cleanSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const id =
      payload.id ||
      `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Form.create({
      id,
      name: (payload.name || "Untitled Form").trim(),
      slug: cleanSlug,
      description: payload.description || "",
      enabled: payload.enabled !== undefined ? Boolean(payload.enabled) : true,
      submitButtonText: payload.submitButtonText || "Submit",
      successMessage:
        payload.successMessage ||
        "Your submission has been received successfully.",
      fields: Array.isArray(payload.fields) ? payload.fields : [],
    });
    return cleanDoc(created);
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
      successMessage:
        original.successMessage ||
        "Your submission has been received successfully.",
      fields: clonedFields,
    });
  },

  async update(id, updates) {
    if (!id) return null;
    const payload = { ...updates };
    delete payload._id;
    delete payload.__v;
    delete payload.id;

    if (payload.slug) {
      payload.slug = payload.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const updated = await Form.findOneAndUpdate(
      {
        $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
      },
      { ...payload, updatedAt: new Date() },
      { returnDocument: "after" },
    ).lean();
    return cleanDoc(updated);
  },

  async delete(id) {
    if (!id) return false;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Form.findOneAndDelete({
      $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])],
    }).lean();
    return !!doc;
  },
};
