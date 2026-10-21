import { ProjectModel } from "../models/Project.model.js";

export async function getProjects(req, res, next) {
  try {
    const { featured, category } = req.query;
    const projects = await ProjectModel.findAll({ featured, category });

    return res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    return res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Project title is required." });
    }

    const newProject = await ProjectModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: newProject,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const updated = await ProjectModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    return res.json({
      success: true,
      message: "Project updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdateProjects(req, res, next) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Payload must be an array of projects.",
      });
    }

    const saved = await ProjectModel.bulkSave(req.body);
    return res.json({
      success: true,
      message: "All projects saved successfully.",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const wasRemoved = await ProjectModel.delete(req.params.id);
    if (!wasRemoved) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    return res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}
