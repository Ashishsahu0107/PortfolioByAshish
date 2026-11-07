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
    content: section.content || {
      heading: section.name || "",
      subheading: "",
      body: "",
    },
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
    <div
      className="fixed inset-0 bg-black/70 z-[500] backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-4 sm:p-7 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100">
            {section.id ? (
              <Pencil size={18} className="text-amber-400 shrink-0" />
            ) : (
              <Plus size={18} className="text-amber-400 shrink-0" />
            )}
            <h3 className="text-base sm:text-lg font-bold m-0">
              {section.id
                ? `Edit Section: ${section.name}`
                : "Create Dynamic Section"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-zinc-400 hover:text-white transition-colors"
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
              <label
                htmlFor="sec_enabled"
                className="text-xs font-semibold text-gray-700 cursor-pointer"
              >
                Section Active on Live Portfolio
              </label>
            </div>

            <div className="col-span-full pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Display Content
              </h4>
            </div>
            <FormGroup label="Heading" fullWidth>
              <input
                className={inputCls}
                name="heading"
                value={form.content?.heading || ""}
                onChange={handleContentChange}
                placeholder="Section title / heading"
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

            {form.type === "custom" && (
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
            )}

            {(form.slug === "process" || form.id === "process") && (
              <div className="col-span-full pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider m-0">
                    Process Roadmap Phases (
                    {Array.isArray(form.content?.items)
                      ? form.content.items.length
                      : 0}
                    )
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = Array.isArray(form.content?.items)
                        ? [...form.content.items]
                        : [];
                      const nextNum = String(currentItems.length + 1).padStart(
                        2,
                        "0",
                      );
                      setForm((p) => ({
                        ...p,
                        content: {
                          ...p.content,
                          items: [
                            ...currentItems,
                            {
                              step: nextNum,
                              phase: `Phase ${nextNum}`,
                              tag: `PHASE ${nextNum}`,
                              desc: "",
                              deliverables: [],
                            },
                          ],
                        },
                      }));
                    }}
                    className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  >
                    <Plus size={12} />
                    <span>Add Phase</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {(Array.isArray(form.content?.items)
                    ? form.content.items
                    : []
                  ).map((stepItem, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-gray-200 bg-gray-50/60 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">
                          Step #
                          {stepItem.step || String(idx + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = form.content.items.filter(
                              (_, i) => i !== idx,
                            );
                            setForm((p) => ({
                              ...p,
                              content: { ...p.content, items: newItems },
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Remove phase"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Phase Title
                          </label>
                          <input
                            className={inputCls}
                            value={stepItem.phase || ""}
                            onChange={(e) => {
                              const updated = [...form.content.items];
                              updated[idx] = {
                                ...updated[idx],
                                phase: e.target.value,
                              };
                              setForm((p) => ({
                                ...p,
                                content: { ...p.content, items: updated },
                              }));
                            }}
                            placeholder="e.g. ARCHITECTURE & DISCOVERY"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Tag / Eyebrow
                          </label>
                          <input
                            className={inputCls}
                            value={stepItem.tag || ""}
                            onChange={(e) => {
                              const updated = [...form.content.items];
                              updated[idx] = {
                                ...updated[idx],
                                tag: e.target.value,
                              };
                              setForm((p) => ({
                                ...p,
                                content: { ...p.content, items: updated },
                              }));
                            }}
                            placeholder="e.g. PHASE 01"
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Description
                          </label>
                          <textarea
                            className={textareaCls}
                            rows={2}
                            value={stepItem.desc || ""}
                            onChange={(e) => {
                              const updated = [...form.content.items];
                              updated[idx] = {
                                ...updated[idx],
                                desc: e.target.value,
                              };
                              setForm((p) => ({
                                ...p,
                                content: { ...p.content, items: updated },
                              }));
                            }}
                            placeholder="What happens during this phase..."
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Deliverables (comma-separated)
                          </label>
                          <input
                            className={inputCls}
                            value={
                              Array.isArray(stepItem.deliverables)
                                ? stepItem.deliverables.join(", ")
                                : ""
                            }
                            onChange={(e) => {
                              const updated = [...form.content.items];
                              updated[idx] = {
                                ...updated[idx],
                                deliverables: e.target.value
                                  .split(",")
                                  .map((d) => d.trim())
                                  .filter(Boolean),
                              };
                              setForm((p) => ({
                                ...p,
                                content: { ...p.content, items: updated },
                              }));
                            }}
                            placeholder="e.g. RFC Spec, Schema Design, Performance Budgets"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
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
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
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
      showToast(
        "Error loading sections: " + (err.message || "Failed to fetch"),
        "error",
      );
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
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? updated : s)),
      );
      showToast(
        `Section "${section.name}" is now ${updated.enabled ? "enabled" : "hidden"}.`,
        "info",
      );
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
        showToast(
          `Section "${res.data.name}" created successfully!`,
          "success",
        );
      } else {
        const res = await sectionsApi.update(sectionData.id, sectionData);
        showToast(
          `Section "${res.data.name}" updated successfully!`,
          "success",
        );
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
      <AdminSection
        title="Section Management"
        desc="Loading sections configuration..."
      >
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
          {sections.filter((s) => s.enabled).length} of {sections.length}{" "}
          sections active on public portfolio
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
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all ${
                sec.enabled
                  ? "bg-zinc-900/90 border-zinc-800 shadow-xs hover:border-zinc-700"
                  : "bg-zinc-950/70 border-zinc-800/60 opacity-60"
              }`}
            >
              {/* Order Controls & Info */}
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                {/* Reorder Arrows */}
                <div className="flex flex-col gap-0.5 shrink-0 pt-0.5 sm:pt-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveOrder(idx, -1)}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer rounded hover:bg-zinc-800 transition-colors"
                    title="Move up"
                  >
                    <MoveUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveOrder(idx, 1)}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer rounded hover:bg-zinc-800 transition-colors"
                    title="Move down"
                  >
                    <MoveDown size={13} />
                  </button>
                </div>

                {/* Order Number Badge */}
                <div
                  className="size-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-xs border"
                  style={{
                    backgroundColor:
                      "rgba(var(--admin-accent-rgb, 245, 158, 11), 0.15)",
                    color: "var(--admin-glow, #f59e0b)",
                    borderColor:
                      "rgba(var(--admin-accent-rgb, 245, 158, 11), 0.35)",
                  }}
                >
                  {sec.order || idx + 1}
                </div>

                {/* Section Title, Badges & Description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm sm:text-base text-zinc-100">
                      {sec.name}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      #{sec.slug}
                    </span>
                    <span
                      className={
                        sec.type === "builtin" ? badgeBlue : badgePurple
                      }
                    >
                      {sec.type === "builtin" ? "Core" : "Custom"}
                    </span>
                    <span className={sec.enabled ? badgeGreen : badgeOrange}>
                      {sec.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 m-0 line-clamp-2 sm:line-clamp-1">
                    {sec.desc || "Configured section"}
                  </p>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-zinc-800/80 sm:border-t-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleToggle(sec)}
                  className={`${btnSecondary} !px-3 !py-1.5 !text-xs flex-1 sm:flex-initial justify-center`}
                  title={
                    sec.enabled ? "Disable on portfolio" : "Enable on portfolio"
                  }
                >
                  {sec.enabled ? (
                    <>
                      <EyeOff size={13} className="text-zinc-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} className="text-emerald-400" />
                      <span>Show</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => editModal.open(sec)}
                  className={`${btnSecondary} !px-3 !py-1.5 !text-xs flex-1 sm:flex-initial justify-center`}
                  title="Edit section"
                >
                  <Pencil size={13} />
                  <span>Edit</span>
                </button>

                {sec.type !== "builtin" && (
                  <button
                    type="button"
                    onClick={() => deleteModal.open(sec)}
                    className={`${btnDanger} !px-2.5 !py-1.5 !text-xs shrink-0`}
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
        <SectionModal
          section={editModal.modal}
          onSave={handleSaveModal}
          onClose={editModal.close}
        />
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
