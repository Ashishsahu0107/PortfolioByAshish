import { SectionModel } from "../models/Section.model.js";

export async function getSections(req, res, next) {
  try {
    const { all } = req.query;
    const sections = await SectionModel.findAll({ includeAll: all === "true" });

    return res.json({
      success: true,
      count: sections.length,
      data: sections,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSectionById(req, res, next) {
  try {
    const section = await SectionModel.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }
    return res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
}

export async function createSection(req, res, next) {
  try {
    const { name, slug } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Section name is required." });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await SectionModel.findBySlug(cleanSlug);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A section with slug "${cleanSlug}" already exists.`,
      });
    }

    const newSection = await SectionModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Custom section created successfully.",
      data: newSection,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSection(req, res, next) {
  try {
    const updated = await SectionModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }
    return res.json({
      success: true,
      message: "Section updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdateSections(req, res, next) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Payload must be an array of section definitions.",
      });
    }

    const saved = await SectionModel.bulkSave(req.body);
    return res.json({
      success: true,
      message: "Sections layout saved successfully.",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSection(req, res, next) {
  try {
    const section = await SectionModel.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    if (section.type === "builtin") {
      return res.status(400).json({
        success: false,
        message: "Core built-in sections cannot be permanently deleted. You can toggle them 'off' instead.",
      });
    }

    await SectionModel.delete(req.params.id);
    return res.json({
      success: true,
      message: `Section "${section.name}" removed successfully.`,
    });
  } catch (err) {
    next(err);
  }
}
