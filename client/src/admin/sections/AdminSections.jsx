import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Plus,
  Save,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Layers,
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
  btnPrimary,
  btnSecondary,
  btnDanger,
  btnSuccess,
  badgeBlue,
  badgeGreen,
  badgeOrange,
  badgePurple,
} from "../adminUtils";
import { sectionsApi } from "../../services/api";

const EMPTY_SECTION = {
  name: "",
  slug: "",
  desc: "",
  enabled: true,
  type: "custom",
  content: {
    heading: "",
    subheading: "",
    body: "",
  },
};

function SectionModal({ section, onSave, onClose }) {
  const [form, setForm] = useState({
    ...section,
    content: section.content || { heading: section.name || "", subheading: "", body: "" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      content: { ...p.content, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/45 z-[500] flex items-center justify-center p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-gray-900">
            {section.id ? (
              <Pencil size={18} className="text-indigo-600 shrink-0" />
            ) : (
              <Plus size={18} className="text-indigo-600 shrink-0" />
            )}
            <h3 className="text-lg font-bold m-0">
              {section.id ? `Edit Section: ${section.name}` : "Create Dynamic Section"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Section Name *">
              <input
                className={inputCls}
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                required
                placeholder="e.g. Testimonials / Publications"
              />
            </FormGroup>
            <FormGroup label="Slug / Anchor ID *">
              <input
                className={inputCls}
                name="slug"
                value={form.slug || ""}
                onChange={handleChange}
                required
                placeholder="e.g. publications"
              />
            </FormGroup>
            <FormGroup label="Description" fullWidth>
              <input
                className={inputCls}
                name="desc"
                value={form.desc || ""}
                onChange={handleChange}
                placeholder="Brief administrative description"
              />
            </FormGroup>
            <div className="col-span-full flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sec_enabled"
                name="enabled"
                checked={Boolean(form.enabled)}
                onChange={handleChange}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="sec_enabled" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Section Active on Live Portfolio
              </label>
            </div>

            {form.type === "custom" && (
              <>
                <div className="col-span-full pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Section Content</h4>
                </div>
                <FormGroup label="Heading" fullWidth>
                  <input
                    className={inputCls}
                    name="heading"
                    value={form.content?.heading || ""}
                    onChange={handleContentChange}
                    placeholder="Main display heading"
                  />
                </FormGroup>
                <FormGroup label="Subheading" fullWidth>
                  <input
                    className={inputCls}
                    name="subheading"
                    value={form.content?.subheading || ""}
                    onChange={handleContentChange}
                    placeholder="Short eyebrow or subtitle text"
                  />
                </FormGroup>
                <FormGroup label="Body Description / Paragraph" fullWidth>
                  <textarea
                    className={textareaCls}
                    name="body"
                    value={form.content?.body || ""}
                    onChange={handleContentChange}
                    rows={3}
                    placeholder="Section text or notes…"
                  />
                </FormGroup>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" className={btnSecondary} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{isSubmitting ? "Saving…" : "Save Section"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();
  const editModal = useModal();
  const deleteModal = useModal();

  async function loadSections() {
    try {
      const data = await sectionsApi.getAll(true);
      if (Array.isArray(data)) {
        setSections(data);
      }
    } catch (err) {
      showToast("Error loading sections: " + (err.message || "Failed to fetch"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  const handleToggle = async (section) => {
    const updated = { ...section, enabled: !section.enabled };
    try {
      await sectionsApi.update(section.id, { enabled: updated.enabled });
      setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)));
      showToast(`Section "${section.name}" is now ${updated.enabled ? "enabled" : "hidden"}.`, "info");
    } catch (err) {
      showToast(err.message || "Failed to toggle section", "error");
    }
  };

  const moveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const list = [...sections];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reordered);

    try {
      await sectionsApi.bulkSave(reordered);
      showToast("Section layout order saved to database.", "success");
    } catch (err) {
      showToast("Failed to save reordered sections: " + err.message, "error");
    }
  };

  const handleSaveModal = async (sectionData) => {
    try {
      if (!sectionData.id) {
        const res = await sectionsApi.create(sectionData);
        showToast(`Section "${res.data.name}" created successfully!`, "success");
      } else {
        const res = await sectionsApi.update(sectionData.id, sectionData);
        showToast(`Section "${res.data.name}" updated successfully!`, "success");
      }
      editModal.close();
      await loadSections();
    } catch (err) {
      showToast(err.message || "Failed to save section", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.modal?.id) return;
    try {
      await sectionsApi.delete(deleteModal.modal.id);
      showToast(`Section "${deleteModal.modal.name}" deleted.`, "info");
      deleteModal.close();
      await loadSections();
    } catch (err) {
      showToast(err.message || "Failed to delete section", "error");
    }
  };

  if (loading) {
    return (
      <AdminSection title="Section Management" desc="Loading sections configuration...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Dynamic Section Management"
      desc="Control the visibility, order, and content of all portfolio sections in real time."
    >
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <p className="m-0 text-sm text-gray-500">
          {sections.filter((s) => s.enabled).length} of {sections.length} sections active on public portfolio
        </p>
        <button
          className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}
          onClick={() => editModal.open({ ...EMPTY_SECTION })}
        >
          <Plus size={13} />
          <span>Add Custom Section</span>
        </button>
      </div>

      <AdminCard>
        <div className="flex flex-col gap-3">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                sec.enabled ? "bg-white border-gray-200 shadow-xs" : "bg-gray-50/70 border-gray-200 opacity-60"
              }`}
            >
              {/* Order Controls & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveOrder(idx, -1)}
                    className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <MoveUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveOrder(idx, 1)}
                    className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <MoveDown size={13} />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {sec.order || idx + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-gray-900">{sec.name}</span>
                    <span className="font-mono text-xs text-gray-400">#{sec.slug}</span>
                    <span className={sec.type === "builtin" ? badgeBlue : badgePurple}>
                      {sec.type === "builtin" ? "Core" : "Custom"}
                    </span>
                    <span className={sec.enabled ? badgeGreen : badgeOrange}>
                      {sec.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 m-0 mt-0.5 truncate">{sec.desc || "Configured section"}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggle(sec)}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  title={sec.enabled ? "Disable on portfolio" : "Enable on portfolio"}
                >
                  {sec.enabled ? (
                    <>
                      <EyeOff size={13} className="text-gray-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} className="text-indigo-600" />
                      <span>Show</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => editModal.open(sec)}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  title="Edit section"
                >
                  <Pencil size={13} />
                  <span>Edit</span>
                </button>

                {sec.type !== "builtin" && (
                  <button
                    type="button"
                    onClick={() => deleteModal.open(sec)}
                    className={`${btnDanger} !px-2 !py-1 !text-xs`}
                    title="Delete custom section"
                    aria-label="Delete section"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {editModal.modal && (
        <SectionModal section={editModal.modal} onSave={handleSaveModal} onClose={editModal.close} />
      )}

      {deleteModal.modal && (
        <ConfirmModal
          title="Delete Section"
          message={`Are you sure you want to permanently remove section "${deleteModal.modal.name}"?`}
          onConfirm={handleDelete}
          onCancel={deleteModal.close}
        />
      )}

      <Toast toast={toast} />
    </AdminSection>
  );
}
