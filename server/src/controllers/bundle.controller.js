import { DeveloperModel } from "../models/Developer.model.js";
import { AboutModel } from "../models/About.model.js";
import { SkillModel } from "../models/Skill.model.js";
import { ProjectModel } from "../models/Project.model.js";
import { ExperienceModel } from "../models/Experience.model.js";
import { SectionModel } from "../models/Section.model.js";

let memoryCache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds memory cache

/**
 * Invalidates the in-memory cache whenever an admin updates any section
 */
export function invalidatePortfolioCache() {
  memoryCache = null;
  cacheTime = 0;
}

/**
 * Combined public portfolio data bundle
 * Fetches developer, about, skills, projects, experience, and sections concurrently
 */
export async function getPortfolioBundle(req, res, next) {
  try {
    const now = Date.now();
    if (memoryCache && now - cacheTime < CACHE_TTL_MS) {
      res.set("X-Cache", "HIT");
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      return res.json({
        success: true,
        cached: true,
        timestamp: cacheTime,
        data: memoryCache,
      });
    }

    const [developer, about, skills, projects, experience, sections] = await Promise.all([
      DeveloperModel.get().catch(() => null),
      AboutModel.get().catch(() => null),
      SkillModel.getAll().catch(() => []),
      ProjectModel.findAll().catch(() => []),
      ExperienceModel.findAll().catch(() => []),
      SectionModel.findAll({ includeAll: false }).catch(() => []),
    ]);

    const bundleData = {
      developer,
      about,
      skills,
      projects,
      experience,
      sections,
    };

    memoryCache = bundleData;
    cacheTime = now;

    res.set("X-Cache", "MISS");
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.json({
      success: true,
      cached: false,
      timestamp: now,
      data: bundleData,
    });
  } catch (err) {
    next(err);
  }
}

