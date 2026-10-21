import { ProjectModel as Project, cleanDoc, cleanDocs } from "../db/schemas.js";

export const ProjectModel = {
  async findAll({ featured, category } = {}) {
    const query = {};
    if (featured === "true") {
      query.featured = true;
    }
    if (category) {
      query.category = new RegExp(`^${category}$`, "i");
    }
    const projects = await Project.find(query).sort({ number: 1, createdAt: -1 }).lean();
    return cleanDocs(projects);
  },

  async findById(id) {
    const project = await Project.findOne({ id }).lean();
    return cleanDoc(project);
  },

  async create(data) {
    const count = await Project.countDocuments();
    const number = data.number || String(count + 1).padStart(2, "0");
    const id = data.id || `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const created = await Project.create({
      ...data,
      id,
      number,
    });
    return cleanDoc(created.toObject());
  },

  async update(id, updates) {
    const updated = await Project.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean();
    return cleanDoc(updated);
  },

  async bulkSave(projectsList) {
    if (!Array.isArray(projectsList)) {
      throw new Error("Projects payload must be an array");
    }
    await Project.deleteMany({});
    const inserted = await Project.insertMany(projectsList);
    return cleanDocs(inserted.map((p) => p.toObject()));
  },

  async delete(id) {
    const doc = await Project.findOneAndDelete({ id }).lean();
    return !!doc;
  },
};
