import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
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
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  AdminSection,
  AdminCard,
  FormGroup,
  useToast,
  Toast,
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

const FIELD_TYPES = ["text", "email", "textarea", "number", "tel"];

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  enabled: true,
  submitButtonText: "Submit Inquiry",
  successMessage: "Thank you for reaching out! Your submission has been saved.",
  fields: [
    { id: "f_name", name: "name", label: "Full Name", type: "text", placeholder: "Jane Doe", required: true },
    { id: "f_email", name: "email", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true },
    { id: "f_message", name: "message", label: "Message", type: "textarea", placeholder: "How can I help you?", required: true },
  ],
};

function FormModal({ form, onSave, onClose }) {
  const [formData, setFormData] = useState({
    ...form,
    fields: Array.isArray(form.fields) ? [...form.fields] : [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFieldChange = (idx, key, val) => {
    setFormData((p) => ({
      ...p,
      fields: p.fields.map((f, i) => (i === idx ? { ...f, [key]: val } : f)),
    }));
  };

  const addField = () => {
    const newField = {
      id: "f_" + Date.now().toString(36),
      name: "field_" + (formData.fields.length + 1),
      label: "New Field",
      type: "text",
      placeholder: "",
      required: false,
    };
    setFormData((p) => ({ ...p, fields: [...p.fields, newField] }));
  };

  const removeField = (idx) => {
    setFormData((p) => ({ ...p, fields: p.fields.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/45 z-[500] flex items-center justify-center p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-gray-900">
            {form.id ? <Pencil size={18} className="text-indigo-600" /> : <Plus size={18} className="text-indigo-600" />}
            <h3 className="text-lg font-bold m-0">{form.id ? `Edit: ${form.name}` : "Create Form Template"}</h3>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Form Name *">
              <input className={inputCls} name="name" value={formData.name || ""} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Form Slug *">
              <input className={inputCls} name="slug" value={formData.slug || ""} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Description" fullWidth>
              <input className={inputCls} name="description" value={formData.description || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Submit Button Label">
              <input className={inputCls} name="submitButtonText" value={formData.submitButtonText || ""} onChange={handleChange} />
            </FormGroup>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="f_enabled"
                name="enabled"
                checked={Boolean(formData.enabled)}
                onChange={handleChange}
                className="w-4 h-4 accent-indigo-600"
              />
              <label htmlFor="f_enabled" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Accept Submissions
              </label>
            </div>
            <FormGroup label="Success Confirmation Message" fullWidth>
              <textarea className={textareaCls} name="successMessage" value={formData.successMessage || ""} onChange={handleChange} rows={2} />
            </FormGroup>
          </div>

          {/* Form Fields Builder */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900 m-0">Fields Configuration ({formData.fields.length})</h4>
              <button type="button" onClick={addField} className={`${btnPrimary} !px-2.5 !py-1 !text-xs`}>
                <Plus size={12} />
                <span>Add Field</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {formData.fields.map((f, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-1">Field Name (Key)</label>
                      <input
                        className={inputCls}
                        value={f.name || ""}
                        onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                        placeholder="field_name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-1">Label</label>
                      <input
                        className={inputCls}
                        value={f.label || ""}
                        onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                        placeholder="Display Label"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-1">Type</label>
                      <select
                        className={selectCls}
                        value={f.type || "text"}
                        onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                      >
                        {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(f.required)}
                          onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                          className="w-3.5 h-3.5 accent-indigo-600"
                        />
                        <span>Required</span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeField(idx)}
                    className={`${btnDanger} !px-2 !py-2 !text-xs self-center`}
                    title="Remove field"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" className={btnSecondary} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{isSubmitting ? "Saving…" : "Save Form"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminFormBuilder() {
  const [activeTab, setActiveTab] = useState("templates"); // 'templates' | 'submissions'
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();
  const editModal = useModal();
  const deleteModal = useModal();
  const deleteSubModal = useModal();

  async function loadData() {
    try {
      const [formsList, subsList] = await Promise.all([
        formsApi.getAll().catch(() => []),
        formsApi.getAllSubmissions().catch(() => []),
      ]);
      setForms(formsList);
      setSubmissions(subsList);
    } catch (err) {
      showToast("Error loading forms: " + (err.message || "Failed to fetch"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveForm = async (formItem) => {
    try {
      if (!formItem.id) {
        await formsApi.create(formItem);
        showToast("Form template created successfully!", "success");
      } else {
        await formsApi.update(formItem.id, formItem);
        showToast("Form template updated successfully!", "success");
      }
      editModal.close();
      await loadData();
    } catch (err) {
      showToast(err.message || "Failed to save form", "error");
    }
  };

  const handleDeleteForm = async () => {
    if (!deleteModal.modal?.id) return;
    try {
      await formsApi.delete(deleteModal.modal.id);
      showToast("Form deleted successfully.", "info");
      deleteModal.close();
      await loadData();
    } catch (err) {
      showToast(err.message || "Failed to delete form", "error");
    }
  };

  const handleDeleteSubmission = async () => {
    if (!deleteSubModal.modal?.id) return;
    try {
      await formsApi.deleteSubmission(deleteSubModal.modal.id);
      showToast("Submission deleted.", "info");
      deleteSubModal.close();
      await loadData();
    } catch (err) {
      showToast(err.message || "Failed to delete submission", "error");
    }
  };

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
      desc="Create custom interactive forms, manage field schemas, and view visitor responses."
    >
      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("templates")}
            className={[
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all",
              activeTab === "templates"
                ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white border-transparent shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            Form Templates ({forms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={[
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all",
              activeTab === "submissions"
                ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white border-transparent shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            Submissions Received ({submissions.length})
          </button>
        </div>

        {activeTab === "templates" && (
          <button
            type="button"
            className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}
            onClick={() => editModal.open({ ...EMPTY_FORM })}
          >
            <Plus size={13} />
            <span>Create Form</span>
          </button>
        )}
      </div>

      {activeTab === "templates" ? (
        <div className="flex flex-col gap-4">
          {forms.map((f) => (
            <AdminCard key={f.id}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900 m-0">{f.name}</h3>
                    <span className="font-mono text-xs text-gray-400">slug: #{f.slug}</span>
                    <span className={f.enabled ? badgeGreen : badgeOrange}>
                      {f.enabled ? "Live / Accepting" : "Paused"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 m-0 mb-3">{f.description || "Interactive portfolio form"}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-gray-500">Fields:</span>
                    {(f.fields || []).map((field, i) => (
                      <span key={i} className={badgeBlue}>
                        {field.label} ({field.type}){field.required ? " *" : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => editModal.open(f)}
                    className={`${btnSecondary} !px-3 !py-1.5 !text-xs`}
                  >
                    <Pencil size={13} />
                    <span>Edit Schema</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteModal.open(f)}
                    className={`${btnDanger} !px-2.5 !py-1.5 !text-xs`}
                    aria-label="Delete form"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        /* Submissions Tab */
        <AdminCard title="Form Submissions Inbox" icon={Inbox}>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No submissions yet. Visitor form responses will appear here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 transition-all shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={badgePurple}>{sub.formName || sub.formSlug}</span>
                      <span className="text-xs font-mono text-gray-400">
                        {new Date(sub.submittedAt || sub.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">IP: {sub.ip}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSubModal.open(sub)}
                      className={`${btnDanger} !px-2 !py-1 !text-xs`}
                      title="Delete submission"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(sub.data || {}).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <strong className="text-gray-500 capitalize w-24 shrink-0">{key}:</strong>
                        <span className="text-gray-800 break-all">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {editModal.modal && <FormModal form={editModal.modal} onSave={handleSaveForm} onClose={editModal.close} />}

      {deleteModal.modal && (
        <ConfirmModal
          title="Delete Form Template"
          message={`Are you sure you want to delete form "${deleteModal.modal.name}"?`}
          onConfirm={handleDeleteForm}
          onCancel={deleteModal.close}
        />
      )}

      {deleteSubModal.modal && (
        <ConfirmModal
          title="Delete Submission"
          message="Delete this form response record?"
          onConfirm={handleDeleteSubmission}
          onCancel={deleteSubModal.close}
        />
      )}

      <Toast toast={toast} />
    </AdminSection>
  );
}
