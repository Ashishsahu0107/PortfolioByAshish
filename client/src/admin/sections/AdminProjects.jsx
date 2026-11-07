import { useState, useEffect } from "react";
import { Plus, Save, Loader2, Pencil, Trash2, X, Check } from "lucide-react";
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
import { projectsApi } from "../../services/api";

const EMPTY_PROJECT = {
  id: "",
  number: "",
  title: "",
  subtitle: "",
  category: "",
  year: String(new Date().getFullYear()),
  color: "#354F52",
  shortDescription: "",
  description: "",
  problem: "",
  solution: "",
  features: [],
  tags: [],
  github: "",
  live: "",
  featured: true,
};

function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
    features: Array.isArray(project.features)
      ? project.features.join("\n")
      : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        tech: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        features: form.features
          .split("\n")
          .map((f) => f.trim())
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
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-4 sm:p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2 text-zinc-100">
            {project.id ? (
              <Pencil size={18} className="text-cyan-400 shrink-0" />
            ) : (
              <Plus size={18} className="text-cyan-400 shrink-0" />
            )}
            <h3 className="text-base sm:text-lg font-bold m-0 text-zinc-100">
              {project.id ? `Edit: ${project.title}` : "New Project"}
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
            <FormGroup label="Project Title *">
              <input
                className={inputCls}
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup label="Subtitle">
              <input
                className={inputCls}
                name="subtitle"
                value={form.subtitle || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Category">
              <input
                className={inputCls}
                name="category"
                value={form.category || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Year">
              <input
                className={inputCls}
                name="year"
                value={form.year || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Card Color">
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.color || "#354F52"}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, color: e.target.value }))
                  }
                  className="w-10 h-9 border border-zinc-800 rounded-lg p-0.5 cursor-pointer bg-zinc-950"
                />
                <input
                  className={`${inputCls} flex-1`}
                  name="color"
                  value={form.color || ""}
                  onChange={handleChange}
                />
              </div>
            </FormGroup>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                name="featured"
                id="featured"
                checked={Boolean(form.featured)}
                onChange={handleChange}
              />
              <label
                htmlFor="featured"
                className="text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                Featured Project
              </label>
            </div>
            <FormGroup label="Short Description" fullWidth>
              <textarea
                className={textareaCls}
                name="shortDescription"
                value={form.shortDescription || ""}
                onChange={handleChange}
                rows={2}
              />
            </FormGroup>
            <FormGroup label="Full Description" fullWidth>
              <textarea
                className={textareaCls}
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </FormGroup>
            <FormGroup label="Problem" fullWidth>
              <textarea
                className={textareaCls}
                name="problem"
                value={form.problem || ""}
                onChange={handleChange}
                rows={2}
              />
            </FormGroup>
            <FormGroup label="Solution" fullWidth>
              <textarea
                className={textareaCls}
                name="solution"
                value={form.solution || ""}
                onChange={handleChange}
                rows={2}
              />
            </FormGroup>
            <FormGroup label="Features (one per line)" fullWidth>
              <textarea
                className={textareaCls}
                name="features"
                value={form.features || ""}
                onChange={handleChange}
                rows={4}
                placeholder={"Role-Based Access Control\nCourse authoring…"}
              />
            </FormGroup>
            <FormGroup label="Tags / Technologies (comma-separated)" fullWidth>
              <input
                className={inputCls}
                name="tags"
                value={form.tags || ""}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input
                className={inputCls}
                type="url"
                name="github"
                value={form.github || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Live URL">
              <input
                className={inputCls}
                type="url"
                name="live"
                value={form.live || ""}
                onChange={handleChange}
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
              <span>{isSubmitting ? "Saving…" : "Save Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();
  const editModal = useModal();
  const deleteModal = useModal();

  async function loadProjects() {
    try {
      const data = await projectsApi.getAll();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      showToast(
        "Error loading projects: " + (err.message || "Failed to fetch"),
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSaveProject = async (project) => {
    try {
      if (!project.id) {
        const res = await projectsApi.create(project);
        showToast(
          `Project "${res.data.title}" created successfully!`,
          "success",
        );
      } else {
        const res = await projectsApi.update(project.id, project);
        showToast(
          `Project "${res.data.title}" updated successfully!`,
          "success",
        );
      }
      editModal.close();
      await loadProjects();
    } catch (err) {
      showToast(err.message || "Failed to save project", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.modal?.id) return;
    try {
      await projectsApi.delete(deleteModal.modal.id);
      showToast("Project deleted successfully from database.", "info");
      deleteModal.close();
      await loadProjects();
    } catch (err) {
      showToast(err.message || "Failed to delete project", "error");
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await projectsApi.bulkSave(projects);
      showToast("All projects synchronized with database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save all projects", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminSection
        title="Work / Projects"
        desc="Loading projects data from backend server..."
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
      title="Work / Projects"
      desc="Add, edit, or remove portfolio projects with persistent storage."
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="m-0 text-xs sm:text-sm text-zinc-400">
          <span className="font-semibold text-zinc-200">{projects.length}</span>{" "}
          project{projects.length !== 1 ? "s" : ""} total
        </p>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}
            onClick={() => editModal.open({ ...EMPTY_PROJECT })}
          >
            <Plus size={13} />
            <span>Add Project</span>
          </button>
          <button
            className={`${btnSuccess} !px-3 !py-1.5 !text-xs`}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save size={13} />
                <span>Save All</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AdminCard>
        {/* Mobile View: Clean, Stacked Card List (Block on mobile < md, hidden on md+) */}
        <div className="block md:hidden space-y-3">
          {projects.length === 0 ? (
            <div className="p-6 text-center text-sm text-zinc-500">
              No projects added yet. Click &quot;Add Project&quot; above to
              create one.
            </div>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-3.5 space-y-2.5 transition-all hover:border-zinc-700/80"
              >
                {/* Top Row: # Index, Featured status & Action buttons */}
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      #{p.number || "—"}
                    </span>
                    <span className={p.featured ? badgeGreen : badgeOrange}>
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1">
                          <Check size={11} />
                          <span>Featured</span>
                        </span>
                      ) : (
                        "Standard"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                      onClick={() => editModal.open({ ...p })}
                      title="Edit project"
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`${btnDanger} !px-2 !py-1 !text-xs`}
                      onClick={() => deleteModal.open(p)}
                      title="Delete project"
                      aria-label="Delete project"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Title and year */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-zinc-100 m-0 leading-snug">
                      {p.title}
                    </h4>
                    {p.year && (
                      <span className="text-xs font-mono text-zinc-400 shrink-0 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800/80">
                        {p.year}
                      </span>
                    )}
                  </div>
                  {p.subtitle && (
                    <p className="text-xs text-zinc-400 mt-1 mb-0 leading-relaxed">
                      {p.subtitle}
                    </p>
                  )}
                </div>

                {/* Category & Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {p.category && (
                    <span className={badgeBlue}>{p.category}</span>
                  )}
                  {(Array.isArray(p.tags) ? p.tags : [])
                    .slice(0, 4)
                    .map((tag) => (
                      <span key={tag} className={badgePurple}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Spacious Table with horizontal min-width guarantee (Hidden on mobile < md, visible on md+) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-800/90 bg-zinc-950/60">
          <table className="w-full min-w-[760px] border-collapse text-sm text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/90">
                <th className="w-12 px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  #
                </th>
                <th className="min-w-[220px] px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  Title
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  Category
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  Year
                </th>
                <th className="min-w-[180px] px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  Tags
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  Featured
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-zinc-500"
                  >
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-850/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-zinc-500 font-mono text-xs font-semibold">
                      {p.number || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-zinc-100">
                        {p.title}
                      </div>
                      {p.subtitle && (
                        <div className="text-xs text-zinc-400 line-clamp-1">
                          {p.subtitle}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={badgeBlue}>{p.category}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-400 font-mono text-xs">
                      {p.year}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {(Array.isArray(p.tags) ? p.tags : [])
                          .slice(0, 3)
                          .map((tag) => (
                            <span key={tag} className={badgePurple}>
                              {tag}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={p.featured ? badgeGreen : badgeOrange}>
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1">
                            <Check size={11} />
                            <span>Yes</span>
                          </span>
                        ) : (
                          "No"
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                          onClick={() => editModal.open({ ...p })}
                          title="Edit project"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          className={`${btnDanger} !px-2 !py-1 !text-xs`}
                          onClick={() => deleteModal.open(p)}
                          title="Delete project"
                          aria-label="Delete project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {editModal.modal && (
        <ProjectModal
          project={editModal.modal}
          onSave={handleSaveProject}
          onClose={editModal.close}
        />
      )}
      {deleteModal.modal && (
        <ConfirmModal
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteModal.modal.title}"?`}
          onConfirm={handleDelete}
          onCancel={deleteModal.close}
        />
      )}
      <Toast toast={toast} />
    </AdminSection>
  );
}
