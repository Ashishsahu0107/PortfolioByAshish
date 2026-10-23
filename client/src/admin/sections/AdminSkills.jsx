import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, Wrench } from "lucide-react";
import {
  AdminSection,
  AdminCard,
  FormGroup,
  useToast,
  Toast,
  ConfirmModal,
  useModal,
  inputCls,
  selectCls,
  textareaCls,
  btnPrimary,
  btnSecondary,
} from "../adminUtils";
import { skillsApi } from "../../services/api";

const ICON_OPTIONS = [
  "Code2",
  "FileCode",
  "Globe",
  "Palette",
  "Wind",
  "Route",
  "Server",
  "Zap",
  "Network",
  "ShieldCheck",
  "KeyRound",
  "Database",
  "TableProperties",
  "GitBranch",
  "Terminal",
  "Send",
  "Coffee",
  "Binary",
  "Radio",
  "Cloud",
  "Eye",
];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Modal for Creating or Editing a Category
function CategoryModal({ category, onSave, onClose }) {
  const [form, setForm] = useState(
    category || { label: "", color: "var(--color-accent)" }
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
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Pencil size={16} className="text-indigo-600" />
            <span>{category?.id ? "Edit Category" : "Add Skill Category"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormGroup label="Category Label *">
            <input
              className={inputCls}
              required
              value={form.label || ""}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Frontend / Cloud"
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

// Modal for Creating or Editing a Skill
function SkillModal({ skill, onSave, onClose }) {
  const [form, setForm] = useState(
    skill || { name: "", description: "", level: 85, icon: "Code2" }
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
            <span>{skill?.name ? `Edit Skill: ${skill.name}` : "Add New Skill"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormGroup label="Technology / Skill Name *">
            <input
              className={inputCls}
              required
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Next.js / Docker"
            />
          </FormGroup>
          <div className="grid grid-cols-2 gap-3">
            <FormGroup label="Proficiency Level (%)">
              <input
                className={inputCls}
                type="number"
                min="10"
                max="100"
                value={form.level || 85}
                onChange={(e) =>
                  setForm({ ...form, level: Number(e.target.value) })
                }
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
          </div>
          <FormGroup label="Description">
            <textarea
              className={textareaCls}
              rows={2}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Usage context, e.g. Server components, SSR & routing"
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
              <span>{submitting ? "Saving…" : "Save Skill"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSkills() {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  const categoryModal = useModal();
  const deleteCategoryModal = useModal();
  const skillModal = useModal();
  const deleteSkillModal = useModal();

  async function loadSkills() {
    try {
      const data = await skillsApi.get();
      if (Array.isArray(data)) {
        setCategories(deepClone(data));
        if (data.length > 0 && !activeTab) {
          setActiveTab(data[0].id);
        }
      }
    } catch (err) {
      showToast(
        "Error loading skills: " + (err.message || "Failed to fetch"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  const activeCategory =
    categories.find((c) => c.id === activeTab) || categories[0];

  // Helper to persist categories array to MongoDB and update state
  const syncToDatabase = async (newCategories, successMsg) => {
    try {
      const res = await skillsApi.update(newCategories);
      if (res.data) {
        setCategories(res.data);
      } else {
        setCategories(newCategories);
      }
      showToast(successMsg, "success");
      return true;
    } catch (err) {
      showToast(err.message || "Failed to update skills in database", "error");
      return false;
    }
  };

  // Category CRUD
  const handleSaveCategory = async (saved) => {
    let updated;
    if (categoryModal.modal?.id) {
      // Edit
      updated = categories.map((c) =>
        c.id === categoryModal.modal.id ? { ...c, label: saved.label } : c
      );
    } else {
      // Add
      const id = "cat_" + Date.now().toString(36);
      const newCat = {
        id,
        label: saved.label,
        color: "var(--color-accent)",
        skills: [],
      };
      updated = [...categories, newCat];
      setActiveTab(id);
    }
    const ok = await syncToDatabase(
      updated,
      `Category "${saved.label}" saved to database!`
    );
    if (ok) categoryModal.close();
  };

  const handleDeleteCategory = async () => {
    const id = deleteCategoryModal.modal?.id;
    if (!id) return;
    const updated = categories.filter((c) => c.id !== id);
    const ok = await syncToDatabase(updated, "Category removed from database.");
    if (ok) {
      deleteCategoryModal.close();
      if (activeTab === id) {
        setActiveTab(updated[0]?.id || "");
      }
    }
  };

  // Skill CRUD
  const handleSaveSkill = async (saved) => {
    if (!activeCategory) return;
    const existingIdx = skillModal.modal?.index;
    let updatedSkills;

    if (existingIdx !== undefined && existingIdx !== null) {
      // Edit skill
      updatedSkills = activeCategory.skills.map((s, i) =>
        i === existingIdx ? saved : s
      );
    } else {
      // Add skill
      updatedSkills = [...(activeCategory.skills || []), saved];
    }

    const updatedCategories = categories.map((c) =>
      c.id === activeCategory.id ? { ...c, skills: updatedSkills } : c
    );

    const ok = await syncToDatabase(
      updatedCategories,
      `Skill "${saved.name}" saved to database!`
    );
    if (ok) skillModal.close();
  };

  const handleDeleteSkill = async () => {
    const idx = deleteSkillModal.modal?.index;
    if (idx === undefined || !activeCategory) return;

    const updatedSkills = activeCategory.skills.filter((_, i) => i !== idx);
    const updatedCategories = categories.map((c) =>
      c.id === activeCategory.id ? { ...c, skills: updatedSkills } : c
    );

    const ok = await syncToDatabase(
      updatedCategories,
      "Skill removed from database."
    );
    if (ok) deleteSkillModal.close();
  };

  if (loading) {
    return (
      <AdminSection
        title="Skills & Toolkit"
        desc="Loading skills from database..."
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
      title="Skills & Technologies"
      desc="Create, edit, and organize skill categories and tools with instant database synchronization."
    >
      <div className="flex flex-col gap-6">
        {/* Categories Tabs & Add Category */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeCategory?.id === cat.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label} ({cat.skills?.length || 0})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => categoryModal.open({ label: "" })}
            className={`${btnPrimary} !px-2.5 !py-1 !text-xs`}
          >
            <Plus size={13} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Active Category Card */}
        {activeCategory ? (
          <AdminCard
            title={`${activeCategory.label} (${activeCategory.skills?.length || 0} Technologies)`}
            icon={Wrench}
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => categoryModal.open(activeCategory)}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  title="Rename Category"
                >
                  <Pencil size={12} />
                  <span>Rename</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategoryModal.open(activeCategory)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    skillModal.open({ name: "", description: "", level: 85, icon: "Code2" })
                  }
                  className={`${btnPrimary} !px-2.5 !py-1 !text-xs ml-1`}
                >
                  <Plus size={12} />
                  <span>Add Skill</span>
                </button>
              </div>
            }
          >
            {(!activeCategory.skills || activeCategory.skills.length === 0) ? (
              <div className="py-8 text-center text-sm text-gray-400 italic">
                No skills in this category yet. Click &quot;Add Skill&quot; to add technologies.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCategory.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex flex-col justify-between p-3.5 rounded-lg border border-gray-200 bg-gray-50/70 hover:bg-white transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {skill.icon || "Code2"} · Level {skill.level}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            skillModal.open({ ...skill, index: sIdx })
                          }
                          className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                          title="Edit skill"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            deleteSkillModal.open({ ...skill, index: sIdx })
                          }
                          className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                          title="Delete skill"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {skill.description && (
                      <p className="mt-2 text-xs text-gray-500 m-0 line-clamp-2">
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm">
            No skill categories found. Click &quot;Add Category&quot; to create one.
          </div>
        )}
      </div>

      {/* Category Modal (Add / Edit) */}
      {categoryModal.modal && (
        <CategoryModal
          category={categoryModal.modal}
          onSave={handleSaveCategory}
          onClose={categoryModal.close}
        />
      )}

      {/* Delete Category Modal */}
      {deleteCategoryModal.modal && (
        <ConfirmModal
          title="Delete Skill Category"
          message={`Are you sure you want to delete category "${deleteCategoryModal.modal.label}" and all its skills?`}
          onConfirm={handleDeleteCategory}
          onCancel={deleteCategoryModal.close}
        />
      )}

      {/* Skill Modal (Add / Edit) */}
      {skillModal.modal && (
        <SkillModal
          skill={skillModal.modal}
          onSave={handleSaveSkill}
          onClose={skillModal.close}
        />
      )}

      {/* Delete Skill Modal */}
      {deleteSkillModal.modal && (
        <ConfirmModal
          title="Delete Skill"
          message={`Are you sure you want to remove "${deleteSkillModal.modal.name}"?`}
          onConfirm={handleDeleteSkill}
          onCancel={deleteSkillModal.close}
        />
      )}

      <Toast toast={toast} />
    </AdminSection>
  );
}
