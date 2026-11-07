import { useState, useEffect } from "react";
import { Plus, Save, Pencil, Trash2, X, Loader2 } from "lucide-react";
import {
  AdminSection,
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
  badgeBlue,
  badgeGreen,
  badgeOrange,
  badgePurple,
} from "../adminUtils";
import { experienceApi } from "../../services/api";

const TYPE_OPTIONS = ["education", "project", "certification", "work"];

const EMPTY = {
  id: "",
  type: "work",
  title: "",
  organization: "",
  location: "",
  period: "",
  status: "",
  description: "",
  highlights: [],
};

const TYPE_BADGE = {
  education: badgeBlue,
  project: badgePurple,
  certification: badgeGreen,
  work: badgeOrange,
};

function ExperienceModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState({
    ...entry,
    highlights: Array.isArray(entry.highlights)
      ? entry.highlights.join("\n")
      : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...form,
        highlights: form.highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 z-[500] backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-4 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2 text-zinc-100">
            {entry.id ? (
              <Pencil size={18} className="text-cyan-400 shrink-0" />
            ) : (
              <Plus size={18} className="text-cyan-400 shrink-0" />
            )}
            <h3 className="text-base sm:text-lg font-bold m-0 text-zinc-100">
              {entry.id ? "Edit Entry" : "Add Entry"}
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
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Type">
              <select
                className={selectCls}
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup label="Status">
              <input
                className={inputCls}
                name="status"
                value={form.status || ""}
                onChange={handleChange}
                placeholder="e.g. Active / Completed"
              />
            </FormGroup>
            <FormGroup label="Title *" fullWidth>
              <input
                className={inputCls}
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup label="Organization">
              <input
                className={inputCls}
                name="organization"
                value={form.organization || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Location">
              <input
                className={inputCls}
                name="location"
                value={form.location || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Period" fullWidth>
              <input
                className={inputCls}
                name="period"
                value={form.period || ""}
                onChange={handleChange}
                placeholder="e.g. 2022 — 2026"
              />
            </FormGroup>
            <FormGroup label="Description" fullWidth>
              <textarea
                className={textareaCls}
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </FormGroup>
            <FormGroup label="Highlights (one per line)" fullWidth>
              <textarea
                className={textareaCls}
                name="highlights"
                value={form.highlights || ""}
                onChange={handleChange}
                rows={5}
                placeholder={"Key achievement 1\nKey achievement 2"}
              />
            </FormGroup>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/80">
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
              <span>{isSubmitting ? "Saving…" : "Save Entry"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminExperience() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();
  const editModal = useModal();
  const deleteModal = useModal();

  async function loadExperience() {
    try {
      const data = await experienceApi.getAll();
      if (Array.isArray(data)) {
        setEntries(data);
      }
    } catch (err) {
      showToast(
        "Error loading experience: " + (err.message || "Failed to fetch"),
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperience();
  }, []);

  const handleSave = async (entry) => {
    try {
      if (!entry.id) {
        const res = await experienceApi.create(entry);
        showToast(`Entry "${res.data.title}" added to database!`, "success");
      } else {
        const res = await experienceApi.update(entry.id, entry);
        showToast(`Entry "${res.data.title}" updated successfully!`, "success");
      }
      editModal.close();
      await loadExperience();
    } catch (err) {
      showToast(err.message || "Failed to save experience entry", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.modal?.id) return;
    try {
      await experienceApi.delete(deleteModal.modal.id);
      showToast("Entry removed successfully.", "info");
      deleteModal.close();
      await loadExperience();
    } catch (err) {
      showToast(err.message || "Failed to delete entry", "error");
    }
  };

  if (loading) {
    return (
      <AdminSection
        title="Experience"
        desc="Loading experience data from backend server..."
      >
        <div className="flex items-center justify-center p-12 text-zinc-500 gap-2">
          <Loader2 size={20} className="animate-spin text-cyan-500" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Experience"
      desc="Manage education, work, projects, and certifications with persistent storage."
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="m-0 text-xs sm:text-sm text-zinc-400">
          <span className="font-semibold text-zinc-200">{entries.length}</span>{" "}
          entr{entries.length !== 1 ? "ies" : "y"}
        </p>
        <button
          className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}
          onClick={() => editModal.open({ ...EMPTY })}
        >
          <Plus size={13} />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500 bg-zinc-950/50 rounded-xl border border-zinc-800">
            No experience entries added yet.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 sm:p-5 bg-zinc-950/70 border border-zinc-800/90 rounded-xl hover:border-zinc-700/80 transition-all shadow-sm space-y-3"
            >
              {/* Top row: Badges + Action Buttons (Fixed height, never stretched!) */}
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={TYPE_BADGE[entry.type] || badgeBlue}>
                    {entry.type}
                  </span>
                  {entry.status && (
                    <span className={badgeGreen}>{entry.status}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    className={`${btnSecondary} !px-2.5 !py-1 !text-xs inline-flex items-center gap-1.5`}
                    onClick={() => editModal.open({ ...entry })}
                    title="Edit entry"
                    aria-label="Edit entry"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    className={`${btnDanger} !px-2 !py-1 !text-xs inline-flex items-center justify-center`}
                    onClick={() => deleteModal.open(entry)}
                    title="Delete entry"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 m-0 leading-snug">
                  {entry.title}
                </h3>
                {(entry.organization || entry.location || entry.period) && (
                  <p className="m-0 mt-1 text-xs text-zinc-400 font-medium">
                    {[entry.organization, entry.location, entry.period]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {entry.description && (
                  <p className="m-0 mt-2 text-xs text-zinc-300 leading-relaxed">
                    {entry.description}
                  </p>
                )}
                {(entry.highlights || []).length > 0 && (
                  <ul className="m-0 mt-2 pl-4 text-xs text-zinc-400 list-disc space-y-1">
                    {entry.highlights.slice(0, 3).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                    {entry.highlights.length > 3 && (
                      <li className="text-zinc-500 italic">
                        +{entry.highlights.length - 3} more…
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {editModal.modal && (
        <ExperienceModal
          entry={editModal.modal}
          onSave={handleSave}
          onClose={editModal.close}
        />
      )}
      {deleteModal.modal && (
        <ConfirmModal
          title="Delete Entry"
          message={`Delete "${deleteModal.modal.title}"?`}
          onConfirm={handleDelete}
          onCancel={deleteModal.close}
        />
      )}
      <Toast toast={toast} />
    </AdminSection>
  );
}
