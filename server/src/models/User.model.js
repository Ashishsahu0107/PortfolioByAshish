import mongoose from "mongoose";
import { UserModel as User, cleanDoc, cleanDocs } from "../db/schemas.js";

export const UserModel = {
  async getAll() {
    const users = await User.find().lean();
    return cleanDocs(users);
  },

  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).lean();
    return cleanDoc(user);
  },

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const user = await User.findOne({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : []),
        ...(typeof id === "string" && id.includes("@")
          ? [{ email: id.toLowerCase().trim() }]
          : []),
      ],
    }).lean();
    return cleanDoc(user);
  },

  async updatePassword(id, newHashedPassword) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const updated = await User.findOneAndUpdate(
      {
        $or: [
          { id },
          ...(isObjectId ? [{ _id: id }] : []),
          ...(typeof id === "string" && id.includes("@")
            ? [{ email: id.toLowerCase().trim() }]
            : []),
        ],
      },
      { password: newHashedPassword, updatedAt: new Date() },
      { returnDocument: "after" },
    ).lean();
    return cleanDoc(updated);
  },

  async create({ name, email, password, role = "admin" }) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const cleanEmail = email.trim().toLowerCase();
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const created = await User.create({
      id,
      name: name?.trim() || "Admin User",
      email: cleanEmail,
      password,
      role,
    });
    return cleanDoc(created);
  },
};
