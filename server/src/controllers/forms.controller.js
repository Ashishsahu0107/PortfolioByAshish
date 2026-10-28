import { FormModel } from "../models/Form.model.js";
import { SubmissionModel } from "../models/Submission.model.js";
import { DeveloperModel } from "../models/Developer.model.js";
import { sendContactNotificationEmail } from "../services/resend.service.js";

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
    const { name, fields } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Form name is required (at least 2 characters)." });
    }

    // Normalize field options (e.g. string to array)
    const normalizedFields = Array.isArray(fields)
      ? fields.map((f, i) => {
          let opts = f.options;
          if (typeof opts === "string") {
            opts = opts
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean);
          }
          return {
            ...f,
            id: f.id || `f_${Date.now().toString(36)}_${i}`,
            name: (f.name || `field_${i + 1}`).trim().replace(/[^a-zA-Z0-9_]/g, "_"),
            label: (f.label || `Field ${i + 1}`).trim(),
            type: f.type || "text",
            placeholder: f.placeholder || "",
            required: Boolean(f.required),
            options: Array.isArray(opts) ? opts : [],
            helpText: f.helpText || "",
          };
        })
      : [];

    const newForm = await FormModel.create({
      ...req.body,
      name: name.trim(),
      fields: normalizedFields,
    });

    return res.status(201).json({
      success: true,
      message: "Form template created successfully.",
      data: newForm,
    });
  } catch (err) {
    next(err);
  }
}

export async function duplicateForm(req, res, next) {
  try {
    const duplicated = await FormModel.duplicate(req.params.id);
    if (!duplicated) {
      return res.status(404).json({ success: false, message: "Source form not found to duplicate." });
    }
    return res.status(201).json({
      success: true,
      message: "Form duplicated successfully as draft.",
      data: duplicated,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateForm(req, res, next) {
  try {
    const { name, fields } = req.body || {};
    const updates = { ...req.body };

    if (name) {
      updates.name = name.trim();
    }

    if (Array.isArray(fields)) {
      updates.fields = fields.map((f, i) => {
        let opts = f.options;
        if (typeof opts === "string") {
          opts = opts
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean);
        }
        return {
          ...f,
          id: f.id || `f_${Date.now().toString(36)}_${i}`,
          name: (f.name || `field_${i + 1}`).trim().replace(/[^a-zA-Z0-9_]/g, "_"),
          label: (f.label || `Field ${i + 1}`).trim(),
          type: f.type || "text",
          placeholder: f.placeholder || "",
          required: Boolean(f.required),
          options: Array.isArray(opts) ? opts : [],
          helpText: f.helpText || "",
        };
      });
    }

    const updated = await FormModel.update(req.params.id, updates);
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
        message: "This form is currently paused and not accepting responses.",
      });
    }

    // Process both JSON fields and multipart uploaded files
    const payload = { ...(req.body || {}) };
    const savedFiles = [];

    // Map uploaded files to payload
    if (Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const fileUrl = `/uploads/form_submissions/${file.filename}`;
        payload[file.fieldname] = fileUrl;
        savedFiles.push({
          fieldName: file.fieldname,
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          url: fileUrl,
        });
      }
    }

    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate fields according to the form schema
    for (const field of form.fields || []) {
      const fieldVal = payload[field.name];
      const isMissing =
        fieldVal === undefined ||
        fieldVal === null ||
        (typeof fieldVal === "string" && !fieldVal.trim());

      // 1. Required Check
      if (field.required) {
        if (field.type === "file") {
          const hasFile =
            savedFiles.some((f) => f.fieldName === field.name) ||
            Boolean(fieldVal && String(fieldVal).trim());
          if (!hasFile) {
            errors.push(`${field.label || field.name} is required (please select a file).`);
          }
        } else if (field.type === "checkbox") {
          const isChecked = fieldVal === true || fieldVal === "true" || fieldVal === "on" || fieldVal === "1";
          if (!isChecked) {
            errors.push(`${field.label || field.name} must be checked.`);
          }
        } else if (isMissing) {
          errors.push(`${field.label || field.name} is required.`);
        }
      }

      // 2. Type-specific Format Validation if value is present
      if (!isMissing && typeof fieldVal === "string" && fieldVal.trim()) {
        if (field.type === "email" && !emailRegex.test(fieldVal.trim())) {
          errors.push(`Please enter a valid email address for ${field.label || field.name}.`);
        }
        if (field.type === "phone") {
          const digits = fieldVal.replace(/\D/g, "");
          if (digits.length < 7) {
            errors.push(`Please enter a valid phone number for ${field.label || field.name}.`);
          }
        }
        if (field.type === "date") {
          const parsed = Date.parse(fieldVal);
          if (isNaN(parsed)) {
            errors.push(`Please enter a valid date for ${field.label || field.name}.`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const clientIp =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const submission = await SubmissionModel.create({
      formId: form.id,
      formName: form.name,
      formSlug: form.slug,
      ip: clientIp,
      data: payload,
      files: savedFiles,
    });

    // Fire email notification to owner if notification is enabled
    try {
      const dev = await DeveloperModel.get().catch(() => null);
      const ownerEmail = dev?.email || "ashishsahu01072005@gmail.com";
      const visitorName = payload.name || payload.fullName || payload.username || "Form Visitor";
      const visitorEmail = payload.email || "";

      // Format submission content summary for email body
      const summaryText = Object.entries(payload)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

      sendContactNotificationEmail({
        to: ownerEmail,
        visitorName,
        visitorEmail: visitorEmail || "noreply@portfolio.com",
        subject: `[Form Response] ${form.name}`,
        message: `New response received on form "${form.name}" (/${form.slug}):\n\n${summaryText}`,
      }).catch(() => {});
    } catch {
      // Non-blocking notification dispatch
    }

    return res.status(201).json({
      success: true,
      message: form.successMessage || "Your submission has been received successfully.",
      submissionId: submission.id,
      data: submission,
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

