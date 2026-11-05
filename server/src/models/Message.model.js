import mongoose from "mongoose";
import { MessageModel as Message, cleanDoc, cleanDocs } from "../db/schemas.js";

export const MessageModel = {
  async findAll() {
    const list = await Message.find().sort({ receivedAt: -1 }).lean();
    return cleanDocs(list);
  },

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Message.findOne({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : []),
      ],
    }).lean();
    return cleanDoc(doc);
  },

  async create(data) {
    const payload = { ...data };
    delete payload._id;
    delete payload.__v;

    const id = payload.id || `msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Message.create({
      id,
      name: payload.name ? payload.name.trim() : "",
      email: payload.email ? payload.email.trim().toLowerCase() : "",
      subject: payload.subject ? payload.subject.trim() : "Portfolio Contact Inquiry",
      message: payload.message ? payload.message.trim() : "",
      read: false,
      ip: String(payload.ip || "127.0.0.1"),
      receivedAt: new Date(),
    });
    return cleanDoc(created);
  },

  async markRead(id, readStatus = true) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const updated = await Message.findOneAndUpdate(
      {
        $or: [
          { id },
          ...(isObjectId ? [{ _id: id }] : []),
        ],
      },
      { read: readStatus },
      { returnDocument: "after" }
    ).lean();
    return cleanDoc(updated);
  },

  async delete(id) {
    if (!id) return false;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const doc = await Message.findOneAndDelete({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : []),
      ],
    }).lean();
    return !!doc;
  },
};
