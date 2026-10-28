import { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Save,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Inbox,
  Copy,
  ExternalLink,
  Download,
  Search,
  Filter,
  FileText,
  Paperclip,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Smartphone,
  Monitor,
  Share2,
} from "lucide-react";
import {
  AdminSection,
  AdminCard,
  FormGroup,
  ConfirmModal,
  useModal,
  inputCls,
  textareaCls,
  selectCls,
  btnPrimary,
  btnSecondary,
  btnDanger,
  btnSuccess,
  badgeBlue,
  badgeGreen,
  badgeOrange,
  badgePurple,
} from "../adminUtils";
import { formsApi } from "../../services/api";
import { showToast, toast } from "../../utils/toast";

const FIELD_TYPES = [
  { value: "text", label: "Single-line Text" },
  { value: "email", label: "Email Address" },
  { value: "phone", label: "Phone Number" },
  { value: "textarea", label: "Multi-line Textarea" },
  { value: "dropdown", label: "Dropdown Select" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox (Agreement)" },
  { value: "date", label: "Date Picker" },
  { value: "file", label: "File Upload" },
];

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  enabled: true,
  submitButtonText: "Submit Inquiry",
  successMessage: "Thank you for reaching out! Your submission has been saved.",
  fields: [
    {
      id: "f_name",
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Jane Doe",
      required: true,
      options: [],
      helpText: "",
    },
    {
      id: "f_email",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "jane@company.com",
      required: true,
      options: [],
      helpText: "",
    },
    {
      id: "f_service",
      name: "serviceType",
      label: "Service of Interest",
      type: "dropdown",
      placeholder: "-- Choose Service --",
      required: false,
      options: ["Full Stack Development", "UI/UX Architecture", "API Integration", "Technical Consulting"],
      helpText: "Select the primary scope of your project.",
    },
    {
      id: "f_message",
      name: "message",
      label: "Project Details / Inquiry",
      type: "textarea",
      placeholder: "Tell me a bit about your project, timeline, or scope...",
      required: true,
      options: [],
      helpText: "",
    },
  ],
};

/**
 * Form Editor Modal
 */
function FormModal({ form, onSave, onClose }) {
  const [formData, setFormData] = useState({
    ...form,
    fields: Array.isArray(form.fields)
      ? form.fields.map((f) => ({
          ...f,
          options: Array.isArray(f.options)
            ? f.options
            : typeof f.options === "string"
            ? f.options.split(",").map((o) => o.trim()).filter(Boolean)
            : [],
        }))
      : [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => {
      const next = { ...p, [name]: type === "checkbox" ? checked : value };
      // Auto-generate slug from name if creating new form and user hasn't manually customized slug
      if (name === "name" && !form.id && (!p.slug || p.slug === p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return next;
    });
  };

  const handleFieldChange = (idx, key, val) => {
    setFormData((p) => ({
      ...p,
      fields: p.fields.map((f, i) => (i === idx ? { ...f, [key]: val } : f)),
    }));
  };

  const handleOptionsChange = (idx, optionsString) => {
    const parsed = optionsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    handleFieldChange(idx, "options", parsed);
  };

  const addField = (type = "text") => {
    const newField = {
      id: "f_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
      name: "field_" + (formData.fields.length + 1),
      label: "New Field",
      type: type,
      placeholder: "",
      required: false,
      options: type === "dropdown" || type === "radio" ? ["Option 1", "Option 2"] : [],
      helpText: "",
    };
    setFormData((p) => ({ ...p, fields: [...p.fields, newField] }));
  };

  const removeField = (idx) => {
    setFormData((p) => ({ ...p, fields: p.fields.filter((_, i) => i !== idx) }));
  };

  const moveField = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= formData.fields.length) return;
    setFormData((p) => {
      const fields = [...p.fields];
      const temp = fields[idx];
      fields[idx] = fields[targetIdx];
      fields[targetIdx] = temp;
      return { ...p, fields };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      showToast.error("Form name is required.");
      return;
    }
    if (formData.fields.length === 0) {
      showToast.error("Please add at least one field to your form.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              {form.id ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 m-0">
                {form.id ? `Edit: ${form.name}` : "Create Custom Form"}
              </h3>
              <p className="text-xs text-gray-500 m-0 mt-0.5">
                Configure field types, validation constraints, and public URL slug.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Form Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Form Name *">
              <input
                className={inputCls}
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g. Project Inquiry Questionnaire"
                required
              />
            </FormGroup>

            <FormGroup label="URL Slug * (Unique Identifier)">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">/form/</span>
                <input
                  className={`${inputCls} pl-16 font-mono text-xs`}
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleChange}
                  placeholder="project-inquiry"
                  required
                />
              </div>
            </FormGroup>

            <FormGroup label="Description / Subtitle" fullWidth>
              <input
                className={inputCls}
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Brief summary explaining what this form collects..."
              />
            </FormGroup>

            <FormGroup label="Submit Button Label">
              <input
                className={inputCls}
                name="submitButtonText"
                value={formData.submitButtonText || ""}
                onChange={handleChange}
                placeholder="Submit Inquiry"
              />
            </FormGroup>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={Boolean(formData.enabled)}
                  onChange={handleChange}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Publish Form (Accept Live Submissions)
                </span>
              </label>
            </div>

            <FormGroup label="Success Confirmation Message" fullWidth>
              <textarea
                className={textareaCls}
                name="successMessage"
                value={formData.successMessage || ""}
                onChange={handleChange}
                rows={2}
                placeholder="Thank you! Your submission has been saved."
              />
            </FormGroup>
          </div>

          {/* Section 2: Form Fields Builder */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-gray-900 m-0">
                  Fields Schema ({formData.fields.length})
                </h4>
                <p className="text-[11px] text-gray-500 m-0">
                  Supports text, email, phone, textarea, dropdown, radio, checkbox, date, and file uploads.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addField("text")}
                  className={`${btnPrimary} !px-2.5 !py-1 !text-xs`}
                >
                  <Plus size={12} />
                  <span>Add Field</span>
                </button>
              </div>
            </div>

            {formData.fields.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                No fields added yet. Click &quot;Add Field&quot; above to add your first input.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {formData.fields.map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl hover:border-gray-300 transition-all flex items-start gap-3"
                  >
                    {/* Reorder and Index */}
                    <div className="flex flex-col items-center gap-1 pt-1 text-gray-400">
                      <button
                        type="button"
                        onClick={() => moveField(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-mono font-bold text-gray-400">{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => moveField(idx, 1)}
                        disabled={idx === formData.fields.length - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Field Properties Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      {/* Field Key */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-semibold text-gray-600 block mb-1">
                          Field Key (Alphanumeric) *
                        </label>
                        <input
                          className={`${inputCls} font-mono text-xs`}
                          value={f.name || ""}
                          onChange={(e) =>
                            handleFieldChange(idx, "name", e.target.value.replace(/[^a-zA-Z0-9_]/g, "_"))
                          }
                          placeholder="e.g. fullName"
                          required
                        />
                      </div>

                      {/* Display Label */}
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-semibold text-gray-600 block mb-1">
                          Display Label *
                        </label>
                        <input
                          className={inputCls}
                          value={f.label || ""}
                          onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                          placeholder="e.g. Full Name"
                          required
                        />
                      </div>

                      {/* Type Select */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-semibold text-gray-600 block mb-1">
                          Field Type
                        </label>
                        <select
                          className={selectCls}
                          value={f.type || "text"}
                          onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Required Toggle */}
                      <div className="sm:col-span-2 flex items-center pt-5">
                        <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(f.required)}
                            onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                            className="w-3.5 h-3.5 accent-indigo-600 rounded"
                          />
                          <span className="font-semibold text-indigo-700">Required</span>
                        </label>
                      </div>

                      {/* Placeholder (for relevant types) */}
                      {f.type !== "checkbox" && f.type !== "file" && (
                        <div className="sm:col-span-6">
                          <label className="text-[10px] font-semibold text-gray-500 block mb-1">
                            Placeholder Text
                          </label>
                          <input
                            className={inputCls}
                            value={f.placeholder || ""}
                            onChange={(e) => handleFieldChange(idx, "placeholder", e.target.value)}
                            placeholder="e.g. Select an option or enter value..."
                          />
                        </div>
                      )}

                      {/* Options Configuration for Dropdown / Radio */}
                      {(f.type === "dropdown" || f.type === "radio") && (
                        <div className="sm:col-span-6">
                          <label className="text-[10px] font-semibold text-gray-600 block mb-1">
                            Options (Comma-separated) *
                          </label>
                          <input
                            className={inputCls}
                            value={Array.isArray(f.options) ? f.options.join(", ") : f.options || ""}
                            onChange={(e) => handleOptionsChange(idx, e.target.value)}
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}

                      {/* Help Text Hint */}
                      <div className={f.type === "dropdown" || f.type === "radio" ? "sm:col-span-12" : "sm:col-span-6"}>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-1">
                          Help Hint (Optional text below input)
                        </label>
                        <input
                          className={inputCls}
                          value={f.helpText || ""}
                          onChange={(e) => handleFieldChange(idx, "helpText", e.target.value)}
                          placeholder="e.g. Maximum file size 10MB."
                        />
                      </div>
                    </div>

                    {/* Delete Field Button */}
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer self-center"
                      title="Remove field"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`${btnSecondary} !px-3 !py-1.5 !text-xs cursor-pointer`}
            >
              <Eye size={13} />
              <span>{showPreview ? "Hide Preview" : "Preview In-Modal"}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={btnPrimary}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSubmitting ? "Saving…" : "Save Form"}</span>
              </button>
            </div>
          </div>

          {/* In-Modal Live Preview */}
          {showPreview && (
            <div className="mt-4 p-5 rounded-xl border border-indigo-200 bg-indigo-50/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
                  Live Preview: {formData.name || "Untitled"}
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  Slug: /form/{formData.slug || "custom"}
                </span>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gray-900 m-0">{formData.name}</h4>
                  <p className="text-xs text-gray-500 m-0 mt-0.5">{formData.description}</p>
                </div>
                {formData.fields.map((f, i) => (
                  <div key={i} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      {f.label} {f.required && <span className="text-indigo-600">*</span>}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea className={textareaCls} placeholder={f.placeholder} rows={2} readOnly />
                    ) : f.type === "dropdown" ? (
                      <select className={selectCls} disabled>
                        <option>{f.placeholder || "-- Select an option --"}</option>
                        {(f.options || []).map((o, oi) => (
                          <option key={oi}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <label className="flex items-center gap-2 text-xs text-gray-700">
                        <input type="checkbox" disabled />
                        <span>{f.placeholder || f.label}</span>
                      </label>
                    ) : f.type === "radio" ? (
                      <div className="flex gap-3">
                        {(f.options || []).map((o, oi) => (
                          <label key={oi} className="flex items-center gap-1.5 text-xs text-gray-700">
                            <input type="radio" name="preview_radio" disabled />
                            <span>{o}</span>
                          </label>
                        ))}
                      </div>
                    ) : f.type === "file" ? (
                      <div className="p-3 border border-dashed border-gray-300 rounded text-center text-xs text-gray-400">
                        Click or drag file here (Max 10MB)
                      </div>
                    ) : (
                      <input className={inputCls} placeholder={f.placeholder} type={f.type} readOnly />
                    )}
                    {f.helpText && <span className="text-[10px] text-gray-400">{f.helpText}</span>}
                  </div>
                ))}
                <button type="button" className={`${btnPrimary} w-full`} disabled>
                  <span>{formData.submitButtonText || "Submit"}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/**
 * Live Form Preview Modal
 */
function FormPreviewModal({ form, onClose }) {
  const [device, setDevice] = useState("desktop"); // 'desktop' | 'mobile'
  const publicUrl = `${window.location.origin}/form/${form.slug}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    showToast.success("Public Form URL copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[500] flex items-center justify-center p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#00f0ff] uppercase tracking-wider">
              Form Live Preview
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-xs text-zinc-300 font-semibold">{form.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switch */}
            <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  device === "desktop" ? "bg-zinc-700 text-[#00f0ff]" : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  device === "mobile" ? "bg-zinc-700 text-[#00f0ff]" : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={copyPublicLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-[#00f0ff] transition-colors cursor-pointer"
              title="Copy Public Link"
            >
              <Copy size={12} />
              <span>Copy Link</span>
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#09090b] transition-all no-underline"
            >
              <ExternalLink size={12} />
              <span>Open Public URL</span>
            </a>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Preview */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-[#09090b]">
          <div
            className={`w-full transition-all duration-300 ${
              device === "mobile" ? "max-w-sm rounded-3xl border-4 border-zinc-800 shadow-2xl p-2 bg-zinc-900" : "max-w-2xl"
            }`}
          >
            <iframe
              src={`/form/${form.slug}?embed=true`}
              title="Form Live Preview"
              className="w-full min-h-[520px] rounded-xl border border-zinc-800 bg-[#09090b]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main AdminFormBuilder Component
 */
export default function AdminFormBuilder() {
  const [activeTab, setActiveTab] = useState("templates"); // 'templates' | 'submissions'
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submissions search and filter state
  const [selectedFormFilter, setSelectedFormFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Modals state
  const editModal = useModal();
  const previewModal = useModal();
  const deleteModal = useModal();
  const deleteSubModal = useModal();
  const viewSubModal = useModal();

  async function loadData() {
    try {
      const [formsList, subsList] = await Promise.all([
        formsApi.getAll().catch(() => []),
        formsApi.getAllSubmissions().catch(() => []),
      ]);
      setForms(formsList || []);
      setSubmissions(subsList || []);
    } catch (err) {
      showToast.error("Error loading forms: " + (err.message || "Failed to fetch"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Save form handler (Create / Edit)
  const handleSaveForm = async (formItem) => {
    try {
      if (!formItem.id) {
        await formsApi.create(formItem);
        showToast.success("Form template created successfully!");
      } else {
        await formsApi.update(formItem.id, formItem);
        showToast.success("Form template updated successfully!");
      }
      editModal.close();
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Failed to save form");
    }
  };

  // Toggle publish / unpublish
  const handleTogglePublish = async (formItem) => {
    const nextStatus = !formItem.enabled;
    try {
      await formsApi.update(formItem.id, { ...formItem, enabled: nextStatus });
      setForms((prev) =>
        prev.map((f) => (f.id === formItem.id ? { ...f, enabled: nextStatus } : f))
      );
      if (nextStatus) {
        showToast.success(`Form "${formItem.name}" is now live and accepting submissions!`);
      } else {
        showToast.info(`Form "${formItem.name}" is now paused.`);
      }
    } catch (err) {
      showToast.error(err.message || "Failed to update form publish status");
    }
  };

  // Duplicate form
  const handleDuplicateForm = async (formItem) => {
    try {
      await formsApi.duplicate(formItem.id);
      showToast.success(`Duplicated "${formItem.name}" as draft!`);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Failed to duplicate form");
    }
  };

  // Delete form
  const handleDeleteForm = async () => {
    if (!deleteModal.modal?.id) return;
    try {
      await formsApi.delete(deleteModal.modal.id);
      showToast.success("Form deleted successfully.");
      deleteModal.close();
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Failed to delete form");
    }
  };

  // Delete submission
  const handleDeleteSubmission = async () => {
    if (!deleteSubModal.modal?.id) return;
    try {
      await formsApi.deleteSubmission(deleteSubModal.modal.id);
      showToast.success("Submission deleted from database.");
      deleteSubModal.close();
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Failed to delete submission");
    }
  };

  // Copy shareable link
  const copyShareLink = (slug) => {
    const url = `${window.location.origin}/form/${slug}`;
    navigator.clipboard.writeText(url);
    showToast.success("Public Form URL copied to clipboard!");
  };

  // Export submissions to CSV
  const exportToCsv = () => {
    if (filteredSubmissions.length === 0) {
      showToast.error("No submissions available to export.");
      return;
    }

    // Collect all unique field keys across submissions
    const allKeys = new Set(["id", "formName", "formSlug", "submittedAt", "ip"]);
    filteredSubmissions.forEach((s) => {
      if (s.data) {
        Object.keys(s.data).forEach((k) => allKeys.add(k));
      }
    });

    const headers = Array.from(allKeys);
    const csvRows = [];
    csvRows.push(headers.map((h) => `"${h}"`).join(","));

    filteredSubmissions.forEach((s) => {
      const row = headers.map((h) => {
        let val = "";
        if (h === "id") val = s.id || "";
        else if (h === "formName") val = s.formName || "";
        else if (h === "formSlug") val = s.formSlug || "";
        else if (h === "submittedAt") val = s.submittedAt || s.createdAt || "";
        else if (h === "ip") val = s.ip || "";
        else val = s.data?.[h] !== undefined ? String(s.data[h]) : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form_submissions_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast.success("Submissions exported to CSV successfully!");
  };

  // Export submissions to JSON
  const exportToJson = () => {
    if (filteredSubmissions.length === 0) {
      showToast.error("No submissions available to export.");
      return;
    }
    const blob = new Blob([JSON.stringify(filteredSubmissions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form_submissions_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast.success("Submissions exported to JSON successfully!");
  };

  // Filtered and sorted submissions memo
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((s) => {
        // Form ID / Slug filter
        if (selectedFormFilter !== "all") {
          const match =
            s.formId === selectedFormFilter ||
            s.formSlug === selectedFormFilter;
          if (!match) return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesForm =
            (s.formName && s.formName.toLowerCase().includes(q)) ||
            (s.formSlug && s.formSlug.toLowerCase().includes(q)) ||
            (s.ip && s.ip.includes(q));

          const matchesData = s.data && Object.values(s.data).some((val) =>
            String(val).toLowerCase().includes(q)
          );

          if (!matchesForm && !matchesData) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.submittedAt || a.createdAt || 0);
        const db = new Date(b.submittedAt || b.createdAt || 0);
        return sortOrder === "newest" ? db - da : da - db;
      });
  }, [submissions, selectedFormFilter, searchQuery, sortOrder]);

  if (loading) {
    return (
      <AdminSection title="Form Builder & Submissions" desc="Loading forms and user responses...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Form Builder & Submissions"
      desc="Create custom interactive forms, manage field schemas, share public links, and view visitor responses."
    >
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("templates")}
            className={[
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all flex items-center gap-1.5",
              activeTab === "templates"
                ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white border-transparent shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            <Layers size={13} />
            <span>Form Templates ({forms.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={[
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all flex items-center gap-1.5",
              activeTab === "submissions"
                ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white border-transparent shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            <Inbox size={13} />
            <span>Submissions Received ({submissions.length})</span>
          </button>
        </div>

        {activeTab === "templates" && (
          <button
            type="button"
            className={`${btnPrimary} !px-3 !py-1.5 !text-xs cursor-pointer`}
            onClick={() => editModal.open({ ...EMPTY_FORM })}
          >
            <Plus size={13} />
            <span>Create Form</span>
          </button>
        )}
      </div>

      {activeTab === "templates" ? (
        /* Form Templates List */
        <div className="flex flex-col gap-4">
          {forms.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <h3 className="text-base font-bold text-gray-800 mb-1">No Custom Forms Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                Create custom forms with text, email, phone, dropdowns, and file upload fields to share with visitors.
              </p>
              <button
                type="button"
                className={btnPrimary}
                onClick={() => editModal.open({ ...EMPTY_FORM })}
              >
                <Plus size={13} />
                <span>Create Your First Form</span>
              </button>
            </div>
          ) : (
            forms.map((f) => {
              const formSubmissionsCount = submissions.filter(
                (s) => s.formId === f.id || s.formSlug === f.slug
              ).length;

              return (
                <AdminCard key={f.id}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      {/* Title & Status Badges */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900 m-0">{f.name}</h3>
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          slug: #{f.slug}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(f)}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold cursor-pointer transition-all border ${
                            f.enabled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                          }`}
                          title="Click to toggle publish status"
                        >
                          {f.enabled ? "Live / Accepting" : "Draft / Paused"}
                        </button>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                          {formSubmissionsCount} submissions
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 m-0 mb-3">
                        {f.description || "Interactive portfolio custom form"}
                      </p>

                      {/* Fields Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-gray-400">Fields ({f.fields?.length || 0}):</span>
                        {(f.fields || []).map((field, i) => (
                          <span key={i} className={badgeBlue}>
                            {field.label} ({field.type}){field.required ? " *" : ""}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => copyShareLink(f.slug)}
                        className={`${btnSecondary} !px-2.5 !py-1 !text-xs cursor-pointer`}
                        title="Copy Public Link"
                      >
                        <Copy size={13} />
                        <span>Share Link</span>
                      </button>

                      <a
                        href={`/form/${f.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`${btnSecondary} !px-2.5 !py-1 !text-xs cursor-pointer no-underline text-gray-700 hover:text-indigo-600`}
                        title="Open in new tab"
                      >
                        <ExternalLink size={13} />
                        <span>Public Page</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => previewModal.open(f)}
                        className={`${btnSecondary} !px-2.5 !py-1 !text-xs cursor-pointer`}
                        title="Live Preview"
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateForm(f)}
                        className={`${btnSecondary} !px-2.5 !py-1 !text-xs cursor-pointer`}
                        title="Duplicate this form"
                      >
                        <Layers size={13} />
                        <span>Duplicate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => editModal.open(f)}
                        className={`${btnSecondary} !px-2.5 !py-1 !text-xs cursor-pointer`}
                        title="Edit Schema"
                      >
                        <Pencil size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteModal.open(f)}
                        className={`${btnDanger} !px-2.5 !py-1 !text-xs cursor-pointer`}
                        aria-label="Delete form"
                        title="Delete form"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </AdminCard>
              );
            })
          )}
        </div>
      ) : (
        /* Submissions Management Tab */
        <AdminCard title="Form Submissions Inbox" icon={Inbox}>
          {/* Submissions Filter & Export Controls */}
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
              {/* Form Filter Selector */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter size={13} />
                <select
                  className={`${selectCls} !py-1 !text-xs`}
                  value={selectedFormFilter}
                  onChange={(e) => setSelectedFormFilter(e.target.value)}
                >
                  <option value="all">All Forms ({submissions.length})</option>
                  {forms.map((f) => (
                    <option key={f.id} value={f.slug}>
                      {f.name} (#{f.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 min-w-[160px]">
                <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search submissions by text, email, IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputCls} !pl-8 !py-1 !text-xs`}
                />
              </div>

              {/* Sort Order */}
              <select
                className={`${selectCls} !py-1 !text-xs`}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportToCsv}
                className={`${btnSecondary} !px-3 !py-1 !text-xs cursor-pointer`}
                title="Export submissions as CSV spreadsheet"
              >
                <Download size={12} />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={exportToJson}
                className={`${btnSecondary} !px-3 !py-1 !text-xs cursor-pointer`}
                title="Export submissions as JSON file"
              >
                <FileText size={12} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <Inbox size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="m-0">No submissions matching current filter criteria.</p>
              <span className="text-xs text-gray-400">Visitor responses will be listed here automatically.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={badgePurple}>{sub.formName || sub.formSlug}</span>
                      <span className="text-xs font-mono text-gray-500">
                        {new Date(sub.submittedAt || sub.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">IP: {sub.ip}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => viewSubModal.open(sub)}
                        className={`${btnSecondary} !px-2 !py-1 !text-xs cursor-pointer`}
                        title="View Full Details"
                      >
                        <Eye size={12} />
                        <span>Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSubModal.open(sub)}
                        className={`${btnDanger} !px-2 !py-1 !text-xs cursor-pointer`}
                        title="Delete submission"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Submission Fields Grid */}
                  <div className="bg-gray-50/80 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(sub.data || {}).map(([key, val]) => (
                      <div key={key} className="flex gap-2 min-w-0">
                        <strong className="text-gray-500 capitalize w-28 shrink-0">{key}:</strong>
                        <span className="text-gray-800 break-all">{String(val)}</span>
                      </div>
                    ))}
                  </div>

                  {/* File Upload Attachments */}
                  {Array.isArray(sub.files) && sub.files.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <Paperclip size={13} />
                        <span>Attached Files:</span>
                      </span>
                      {sub.files.map((file, fi) => (
                        <a
                          key={fi}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-xs font-mono font-medium text-indigo-700 hover:bg-indigo-100 transition-colors no-underline"
                        >
                          <Download size={11} />
                          <span>{file.originalName || file.filename}</span>
                          <span className="text-[10px] text-indigo-400">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Form Editor Modal */}
      {editModal.modal && (
        <FormModal
          form={editModal.modal}
          onSave={handleSaveForm}
          onClose={editModal.close}
        />
      )}

      {/* Live Form Preview Modal */}
      {previewModal.modal && (
        <FormPreviewModal
          form={previewModal.modal}
          onClose={previewModal.close}
        />
      )}

      {/* Delete Form Confirmation Modal */}
      {deleteModal.modal && (
        <ConfirmModal
          title="Delete Form Template"
          message={`Are you sure you want to permanently delete form "${deleteModal.modal.name}"? This cannot be undone.`}
          onConfirm={handleDeleteForm}
          onCancel={deleteModal.close}
        />
      )}

      {/* Delete Submission Confirmation Modal */}
      {deleteSubModal.modal && (
        <ConfirmModal
          title="Delete Submission Record"
          message="Are you sure you want to delete this visitor response from the database?"
          onConfirm={handleDeleteSubmission}
          onCancel={deleteSubModal.close}
        />
      )}

      {/* View Full Submission Modal */}
      {viewSubModal.modal && (
        <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4 backdrop-blur-xs" onClick={viewSubModal.close}>
          <div
            className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900 m-0">Submission Record</h3>
                <span className="text-xs font-mono text-gray-500">ID: {viewSubModal.modal.id}</span>
              </div>
              <button
                onClick={viewSubModal.close}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <strong className="text-gray-500">Form:</strong> {viewSubModal.modal.formName}
                </div>
                <div>
                  <strong className="text-gray-500">Slug:</strong> #{viewSubModal.modal.formSlug}
                </div>
                <div>
                  <strong className="text-gray-500">Date:</strong>{" "}
                  {new Date(viewSubModal.modal.submittedAt || viewSubModal.modal.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong className="text-gray-500">IP Address:</strong> {viewSubModal.modal.ip}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Response Payload:
                </h4>
                <div className="space-y-2">
                  {Object.entries(viewSubModal.modal.data || {}).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded bg-white border border-gray-200 text-xs">
                      <div className="font-semibold text-indigo-700 capitalize mb-0.5">{k}:</div>
                      <div className="text-gray-800 whitespace-pre-wrap">{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {Array.isArray(viewSubModal.modal.files) && viewSubModal.modal.files.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Uploaded Files:
                  </h4>
                  <div className="space-y-2">
                    {viewSubModal.modal.files.map((file, fi) => (
                      <a
                        key={fi}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-800 hover:bg-indigo-100 transition-colors no-underline"
                      >
                        <span className="font-mono font-medium truncate">{file.originalName || file.filename}</span>
                        <span className="shrink-0 font-mono text-[10px] text-indigo-500 flex items-center gap-1">
                          <Download size={11} /> Download
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-100 flex justify-end bg-gray-50">
              <button type="button" className={btnSecondary} onClick={viewSubModal.close}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSection>
  );
}
