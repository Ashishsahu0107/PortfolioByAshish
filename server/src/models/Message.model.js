import { MessageModel as Message, cleanDoc, cleanDocs } from "../db/schemas.js";

export const MessageModel = {
  async findAll() {
    const list = await Message.find().sort({ receivedAt: -1 }).lean();
    return cleanDocs(list);
  },

  async findById(id) {
    const doc = await Message.findOne({ id }).lean();
    return cleanDoc(doc);
  },

  async create(data) {
    const id = data.id || `msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await Message.create({
      id,
      name: data.name ? data.name.trim() : "",
      email: data.email ? data.email.trim().toLowerCase() : "",
      subject: data.subject ? data.subject.trim() : "Portfolio Contact Inquiry",
      message: data.message ? data.message.trim() : "",
      read: false,
      ip: data.ip || "127.0.0.1",
      receivedAt: new Date(),
    });
    return cleanDoc(created.toObject());
  },

  async markRead(id, readStatus = true) {
    const updated = await Message.findOneAndUpdate(
      { id },
      { read: readStatus },
      { new: true }
    ).lean();
    return cleanDoc(updated);
  },

  async delete(id) {
    const doc = await Message.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};
