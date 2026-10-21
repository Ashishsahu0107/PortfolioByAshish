import { DeveloperModel } from "../models/Developer.model.js";
import { AboutModel } from "../models/About.model.js";

export async function getDeveloper(req, res, next) {
  try {
    const developer = await DeveloperModel.get();
    return res.json({
      success: true,
      data: developer,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateDeveloper(req, res, next) {
  try {
    const updated = await DeveloperModel.update(req.body);

    // Keep bio & philosophy in sync with about section if updated
    if (req.body.bio !== undefined || req.body.philosophy !== undefined) {
      const about = await AboutModel.get();
      if (about) {
        const aboutUpdates = {};
        if (req.body.bio !== undefined) aboutUpdates.bio = req.body.bio;
        if (req.body.philosophy !== undefined) aboutUpdates.philosophy = req.body.philosophy;
        await AboutModel.update(aboutUpdates);
      }
    }

    return res.json({
      success: true,
      message: "Developer / Hero information updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}
