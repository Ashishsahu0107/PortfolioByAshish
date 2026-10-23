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
    const user = await User.findOne({ id }).lean();
    return cleanDoc(user);
  },

  async updatePassword(id, newHashedPassword) {
    const updated = await User.findOneAndUpdate(
      { id },
      { password: newHashedPassword },
      { returnDocument: "after" }
    ).lean();
    return cleanDoc(updated);
  },
};
