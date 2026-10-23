import { useState, useEffect } from "react";
import {
  FileText,
  Target,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
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
} from "../adminUtils";
import { aboutApi } from "../../services/api";

const ICON_OPTIONS = [
  "Code2",
  "Server",
  "Database",
  "Cpu",
  "Terminal",
  "Globe",
  "Layers",
  "Zap",
];

const DEFAULT_ABOUT = {
  bio: "",
  philosophy: "",
  focusAreas: [],
  stats: [],
};

// Modal for Adding or Editing a Focus Area
function FocusAreaModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(
    item || { title: "", description: "", icon: "Code2" }
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/45 z-[500] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Pencil size={16} className="text-indigo-600" />
            <span>{item?.title ? "Edit Focus Area" : "Add Focus Area"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormGroup label="Title *">
            <input
              className={inputCls}
              required
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Frontend Architecture"
            />
          </FormGroup>
          <FormGroup label="Icon">
            <select
              className={selectCls}
              value={form.icon || "Code2"}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup label="Description *">
            <textarea
              className={textareaCls}
              required
              rows={3}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Key competencies and focus scope..."
            />
          </FormGroup>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              className={btnSecondary}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={btnPrimary}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              <span>{submitting ? "Saving…" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for Adding or Editing a Stat Metric
function StatModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { value: "", label: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/45 z-[500] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Pencil size={16} className="text-indigo-600" />
            <span>{item?.label ? "Edit Metric" : "Add Metric"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormGroup label="Value (e.g. 20+, 03+, 95%) *">
            <input
              className={inputCls}
              required
              value={form.value || ""}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="e.g. 20+"
            />
          </FormGroup>
          <FormGroup label="Label *">
            <input
              className={inputCls}
              required
              value={form.label || ""}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Projects Built"
            />
          </FormGroup>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              className={btnSecondary}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={btnPrimary}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              <span>{submitting ? "Saving…" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAbout() {
  const [form, setForm] = useState(DEFAULT_ABOUT);
  const [original, setOriginal] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [savingStory, setSavingStory] = useState(false);
  const { toast, showToast } = useToast();

  const focusModal = useModal();
  const deleteFocusModal = useModal();
  const statModal = useModal();
  const deleteStatModal = useModal();

  async function loadData() {
    try {
      const data = await aboutApi.get();
      if (data) {
        setForm(data);
        setOriginal(data);
      }
    } catch (err) {
      showToast(
        "Error loading about data: " + (err.message || "Failed to fetch"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleStoryChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelStory = () => {
    setForm((prev) => ({
      ...prev,
      bio: original.bio,
      philosophy: original.philosophy,
    }));
    setIsEditingStory(false);
    showToast("Cancelled editing story.", "info");
  };

  const handleSaveStory = async () => {
    setSavingStory(true);
    try {
      const payload = {
        ...form,
        bio: form.bio,
        philosophy: form.philosophy,
      };
      const res = await aboutApi.update(payload);
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      setIsEditingStory(false);
      showToast("Story & Philosophy saved to database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save story", "error");
    } finally {
      setSavingStory(false);
    }
  };

  // Focus Area CRUD
  const handleSaveFocusArea = async (savedItem) => {
    let updatedList;
    const existingIdx = focusModal.modal?.index;
    if (existingIdx !== undefined && existingIdx !== null) {
      updatedList = form.focusAreas.map((f, i) =>
        i === existingIdx ? savedItem : f
      );
    } else {
      updatedList = [...(form.focusAreas || []), savedItem];
    }

    try {
      const res = await aboutApi.update({ ...form, focusAreas: updatedList });
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      focusModal.close();
      showToast(
        `Focus area "${savedItem.title}" saved to database!`,
        "success"
      );
    } catch (err) {
      showToast(err.message || "Failed to save focus area", "error");
    }
  };

  const handleDeleteFocusArea = async () => {
    const idx = deleteFocusModal.modal?.index;
    if (idx === undefined) return;
    const updatedList = form.focusAreas.filter((_, i) => i !== idx);

    try {
      const res = await aboutApi.update({ ...form, focusAreas: updatedList });
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      deleteFocusModal.close();
      showToast("Focus area removed from database.", "info");
    } catch (err) {
      showToast(err.message || "Failed to delete focus area", "error");
    }
  };

  // Stat Metric CRUD
  const handleSaveStat = async (savedItem) => {
    let updatedList;
    const existingIdx = statModal.modal?.index;
    if (existingIdx !== undefined && existingIdx !== null) {
      updatedList = form.stats.map((s, i) =>
        i === existingIdx ? savedItem : s
      );
    } else {
      updatedList = [...(form.stats || []), savedItem];
    }

    try {
      const res = await aboutApi.update({ ...form, stats: updatedList });
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      statModal.close();
      showToast(`Metric "${savedItem.label}" saved to database!`, "success");
    } catch (err) {
      showToast(err.message || "Failed to save metric", "error");
    }
  };

  const handleDeleteStat = async () => {
    const idx = deleteStatModal.modal?.index;
    if (idx === undefined) return;
    const updatedList = form.stats.filter((_, i) => i !== idx);

    try {
      const res = await aboutApi.update({ ...form, stats: updatedList });
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      deleteStatModal.close();
      showToast("Metric removed from database.", "info");
    } catch (err) {
      showToast(err.message || "Failed to delete metric", "error");
    }
  };

  if (loading) {
    return (
      <AdminSection
        title="About Section"
        desc="Loading section data from backend server..."
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
      title="About Section"
      desc="Independent controls for Story, Core Focus Pillars, and Key Metrics with live sync."
    >
      <div className="flex flex-col gap-6">
        {/* 1. Story & Philosophy Card */}
        <AdminCard
          title="Story & Philosophy"
          icon={FileText}
          action={
            !isEditingStory ? (
              <button
                type="button"
                onClick={() => setIsEditingStory(true)}
                className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                title="Edit Story & Philosophy"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelStory}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  disabled={savingStory}
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveStory}
                  className={`${btnPrimary} !px-3 !py-1 !text-xs`}
                  disabled={savingStory}
                >
                  {savingStory ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{savingStory ? "Saving…" : "Save"}</span>
                </button>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <FormGroup label="Biography Description">
              <textarea
                className={`${textareaCls} ${!isEditingStory ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="bio"
                value={form.bio || ""}
                onChange={handleStoryChange}
                disabled={!isEditingStory}
                rows={4}
              />
            </FormGroup>
            <FormGroup label="Core Philosophy Headline">
              <textarea
                className={`${textareaCls} ${!isEditingStory ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="philosophy"
                value={form.philosophy || ""}
                onChange={handleStoryChange}
                disabled={!isEditingStory}
                rows={2}
              />
            </FormGroup>
          </div>
        </AdminCard>

        {/* 2. Core Focus Areas Card */}
        <AdminCard
          title="Core Engineering Competencies"
          icon={Target}
          action={
            <button
              type="button"
              onClick={() => focusModal.open({ title: "", description: "", icon: "Code2" })}
              className={`${btnPrimary} !px-2.5 !py-1 !text-xs`}
            >
              <Plus size={13} />
              <span>Add Focus Area</span>
            </button>
          }
        >
          {(!form.focusAreas || form.focusAreas.length === 0) ? (
            <div className="py-6 text-center text-sm text-gray-400 italic">
              No focus areas added yet. Click &quot;Add Focus Area&quot; above to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {form.focusAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50/70 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold">
                        {area.icon || "Code2"}
                      </span>
                      <strong className="text-sm font-semibold text-gray-900 truncate">
                        {area.title}
                      </strong>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 m-0">
                      {area.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => focusModal.open({ ...area, index: idx })}
                      className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                      title="Edit focus area"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFocusModal.open({ ...area, index: idx })}
                      className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                      title="Delete focus area"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* 3. Key Metrics & Stats Card */}
        <AdminCard
          title="Editorial Statistics & Metrics"
          icon={BarChart3}
          action={
            <button
              type="button"
              onClick={() => statModal.open({ value: "", label: "" })}
              className={`${btnPrimary} !px-2.5 !py-1 !text-xs`}
            >
              <Plus size={13} />
              <span>Add Metric</span>
            </button>
          }
        >
          {(!form.stats || form.stats.length === 0) ? (
            <div className="py-6 text-center text-sm text-gray-400 italic">
              No metrics added yet. Click &quot;Add Metric&quot; to configure your stats bar.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {form.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-3 rounded-lg border border-gray-200 bg-gray-50/70 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-2xl font-bold text-indigo-600">
                      {stat.value}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => statModal.open({ ...stat, index: idx })}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                        title="Edit metric"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteStatModal.open({ ...stat, index: idx })}
                        className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                        title="Delete metric"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <span className="mt-1 font-mono text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Focus Area Modal (Add / Edit with Save & Cancel) */}
      {focusModal.modal && (
        <FocusAreaModal
          item={focusModal.modal}
          onSave={handleSaveFocusArea}
          onClose={focusModal.close}
        />
      )}

      {/* Delete Focus Area Confirmation */}
      {deleteFocusModal.modal && (
        <ConfirmModal
          title="Delete Focus Area"
          message={`Are you sure you want to delete "${deleteFocusModal.modal.title}"? This change will be saved to the database immediately.`}
          onConfirm={handleDeleteFocusArea}
          onCancel={deleteFocusModal.close}
        />
      )}

      {/* Stat Modal (Add / Edit with Save & Cancel) */}
      {statModal.modal && (
        <StatModal
          item={statModal.modal}
          onSave={handleSaveStat}
          onClose={statModal.close}
        />
      )}

      {/* Delete Stat Confirmation */}
      {deleteStatModal.modal && (
        <ConfirmModal
          title="Delete Metric"
          message={`Are you sure you want to delete metric "${deleteStatModal.modal.label}"?`}
          onConfirm={handleDeleteStat}
          onCancel={deleteStatModal.close}
        />
      )}

      <Toast toast={toast} />
    </AdminSection>
  );
}
