import { ExperienceModel } from "../models/Experience.model.js";

export async function getExperience(req, res, next) {
  try {
    const { type } = req.query;
    const list = await ExperienceModel.findAll({ type });

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    next(err);
  }
}

export async function getExperienceById(req, res, next) {
  try {
    const item = await ExperienceModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Experience entry not found." });
    }
    return res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function createExperience(req, res, next) {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }

    const newItem = await ExperienceModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Experience entry created successfully.",
      data: newItem,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateExperience(req, res, next) {
  try {
    const updated = await ExperienceModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Experience entry not found." });
    }
    return res.json({
      success: true,
      message: "Experience entry updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdateExperience(req, res, next) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Payload must be an array of experience items.",
      });
    }

    const saved = await ExperienceModel.bulkSave(req.body);
    return res.json({
      success: true,
      message: "Experience records updated successfully.",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteExperience(req, res, next) {
  try {
    const wasRemoved = await ExperienceModel.delete(req.params.id);
    if (!wasRemoved) {
      return res.status(404).json({ success: false, message: "Experience entry not found." });
    }
    return res.json({
      success: true,
      message: "Experience entry deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}
