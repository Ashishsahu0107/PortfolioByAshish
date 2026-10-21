import { AboutModel } from "../models/About.model.js";
import { DeveloperModel } from "../models/Developer.model.js";

export async function getAbout(req, res, next) {
  try {
    const about = await AboutModel.get();
    return res.json({
      success: true,
      data: about,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAbout(req, res, next) {
  try {
    const updated = await AboutModel.update(req.body);

    // Keep developer bio/philosophy in sync
    const devUpdates = {};
    if (req.body.bio !== undefined) devUpdates.bio = req.body.bio;
    if (req.body.philosophy !== undefined) devUpdates.philosophy = req.body.philosophy;
    if (req.body.focusAreas !== undefined) devUpdates.focusAreas = req.body.focusAreas;
    if (req.body.stats !== undefined) devUpdates.stats = req.body.stats;

    if (Object.keys(devUpdates).length > 0) {
      await DeveloperModel.update(devUpdates);
    }

    return res.json({
      success: true,
      message: "About section updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}
