import { FormModel } from "../models/Form.model.js";
import { SubmissionModel } from "../models/Submission.model.js";

export async function getForms(req, res, next) {
  try {
    const forms = await FormModel.findAll();
    return res.json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFormByIdOrSlug(req, res, next) {
  try {
    const form = await FormModel.findByIdOrSlug(req.params.id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found." });
    }
    return res.json({ success: true, data: form });
  } catch (err) {
    next(err);
  }
}

export async function createForm(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Form name is required." });
    }

    const newForm = await FormModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Form template created successfully.",
      data: newForm,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateForm(req, res, next) {
  try {
    const updated = await FormModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Form not found." });
    }
    return res.json({
      success: true,
      message: "Form updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteForm(req, res, next) {
  try {
    const wasRemoved = await FormModel.delete(req.params.id);
    if (!wasRemoved) {
      return res.status(404).json({ success: false, message: "Form not found." });
    }
    return res.json({ success: true, message: "Form deleted successfully." });
  } catch (err) {
    next(err);
  }
}

export async function submitForm(req, res, next) {
  try {
    const form = await FormModel.findByIdOrSlug(req.params.id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Target form not found." });
    }

    if (!form.enabled) {
      return res.status(400).json({
        success: false,
        message: "This form is currently not accepting responses.",
      });
    }

    const payload = req.body || {};
    const errors = [];

    // Validate required fields based on form schema
    for (const field of form.fields || []) {
      if (
        field.required &&
        (!payload[field.name] || !String(payload[field.name]).trim())
      ) {
        errors.push(`${field.label || field.name} is required.`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const submission = await SubmissionModel.create({
      formId: form.id,
      formName: form.name,
      formSlug: form.slug,
      ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      data: payload,
    });

    return res.status(201).json({
      success: true,
      message: form.successMessage || "Submitted successfully.",
      submissionId: submission.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFormSubmissions(req, res, next) {
  try {
    const filtered = await SubmissionModel.findByFormIdOrSlug(req.params.id);
    return res.json({
      success: true,
      count: filtered.length,
      data: [...filtered].reverse(),
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllSubmissions(req, res, next) {
  try {
    const submissions = await SubmissionModel.findAll();
    return res.json({
      success: true,
      count: submissions.length,
      data: [...submissions].reverse(),
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSubmission(req, res, next) {
  try {
    const wasRemoved = await SubmissionModel.delete(req.params.submissionId);
    if (!wasRemoved) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }
    return res.json({ success: true, message: "Submission deleted successfully." });
  } catch (err) {
    next(err);
  }
}
