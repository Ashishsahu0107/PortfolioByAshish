import { DeveloperModel } from "../models/Developer.model.js";
import { AboutModel } from "../models/About.model.js";
import { SkillModel } from "../models/Skill.model.js";
import { ProjectModel } from "../models/Project.model.js";
import { ExperienceModel } from "../models/Experience.model.js";
import { SectionModel } from "../models/Section.model.js";
import { FormModel } from "../models/Form.model.js";
import { SubmissionModel } from "../models/Submission.model.js";
import { MessageModel } from "../models/Message.model.js";

export async function getOverviewStats(req, res, next) {
  try {
    const [
      developer,
      about,
      skills,
      projects,
      experience,
      sections,
      forms,
      submissions,
      messages,
    ] = await Promise.all([
      DeveloperModel.get(),
      AboutModel.get(),
      SkillModel.getAll(),
      ProjectModel.findAll(),
      ExperienceModel.findAll(),
      SectionModel.findAll({ includeAll: true }),
      FormModel.findAll(),
      SubmissionModel.findAll(),
      MessageModel.findAll(),
    ]);

    const totalSkills = Array.isArray(skills)
      ? skills.reduce(
          (sum, cat) =>
            sum + (Array.isArray(cat.skills) ? cat.skills.length : 0),
          0
        )
      : 0;

    const featuredProjects = Array.isArray(projects)
      ? projects.filter((p) => p.featured).length
      : 0;

    const unreadMessages = Array.isArray(messages)
      ? messages.filter((m) => !m.read).length
      : 0;

    const activeSections = Array.isArray(sections)
      ? sections.filter((s) => s.enabled !== false).length
      : 0;

    return res.json({
      success: true,
      data: {
        developer: {
          name: developer?.name || "Ashish Sahu",
          role: developer?.role || "Full Stack Developer",
          availableForWork: developer?.availableForWork,
          statusPhrase: developer?.statusPhrase,
          updatedAt: developer?.updatedAt,
        },
        counts: {
          projects: projects?.length || 0,
          featuredProjects,
          skillCategories: skills?.length || 0,
          totalSkills,
          experience: experience?.length || 0,
          sections: sections?.length || 0,
          activeSections,
          forms: forms?.length || 0,
          submissions: submissions?.length || 0,
          messages: messages?.length || 0,
          unreadMessages,
        },
        system: {
          status: "healthy",
          nodeVersion: process.version,
          platform: process.platform,
          uptimeSeconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
