import { SkillModel } from "../models/Skill.model.js";

export async function getSkills(req, res, next) {
  try {
    const skills = await SkillModel.getAll();
    return res.json({
      success: true,
      data: skills,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSkills(req, res, next) {
  try {
    const skills = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills payload must be an array of categories.",
      });
    }

    const updated = await SkillModel.updateAll(skills);
    return res.json({
      success: true,
      message: "Skills updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}
