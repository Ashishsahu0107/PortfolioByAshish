import { useState, useEffect } from "react";
import { Plus, Save, Loader2, Pencil, Trash2, X, Check } from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast, ConfirmModal, useModal,
  inputCls, textareaCls, btnPrimary, btnSecondary, btnDanger, btnSuccess,
  badgeBlue, badgeGreen, badgeOrange, badgePurple,
} from "../adminUtils";
import { projectsApi } from "../../services/api";

const EMPTY_PROJECT = {
  id: "", number: "", title: "", subtitle: "", category: "",
  year: String(new Date().getFullYear()), color: "#354F52",
  shortDescription: "", description: "", problem: "", solution: "",
  features: [], tags: [], github: "", live: "", featured: true,
};

function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
    features: Array.isArray(project.features) ? project.features.join("\n") : "",
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
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        tech: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      });
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
            {project.id ? (
              <Pencil size={18} className="text-indigo-600 shrink-0" />
            ) : (
              <Plus size={18} className="text-indigo-600 shrink-0" />
            )}
            <h3 className="text-lg font-bold m-0">
              {project.id ? `Edit: ${project.title}` : "New Project"}
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
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Project Title *">
              <input className={inputCls} name="title" value={form.title || ""} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Subtitle">
              <input className={inputCls} name="subtitle" value={form.subtitle || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Category">
              <input className={inputCls} name="category" value={form.category || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Year">
              <input className={inputCls} name="year" value={form.year || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Card Color">
              <div className="flex gap-2 items-center">
                <input
                  type="color" value={form.color || "#354F52"}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="w-10 h-9 border border-gray-200 rounded-lg p-0.5 cursor-pointer"
                />
                <input className={`${inputCls} flex-1`} name="color" value={form.color || ""} onChange={handleChange} />
              </div>
            </FormGroup>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" className="w-4 h-4 accent-indigo-600" name="featured" id="featured"
                checked={Boolean(form.featured)} onChange={handleChange} />
              <label htmlFor="featured" className="text-xs font-semibold text-gray-600 cursor-pointer">Featured Project</label>
            </div>
            <FormGroup label="Short Description" fullWidth>
              <textarea className={textareaCls} name="shortDescription" value={form.shortDescription || ""} onChange={handleChange} rows={2} />
            </FormGroup>
            <FormGroup label="Full Description" fullWidth>
              <textarea className={textareaCls} name="description" value={form.description || ""} onChange={handleChange} rows={3} />
            </FormGroup>
            <FormGroup label="Problem" fullWidth>
              <textarea className={textareaCls} name="problem" value={form.problem || ""} onChange={handleChange} rows={2} />
            </FormGroup>
            <FormGroup label="Solution" fullWidth>
              <textarea className={textareaCls} name="solution" value={form.solution || ""} onChange={handleChange} rows={2} />
            </FormGroup>
            <FormGroup label="Features (one per line)" fullWidth>
              <textarea className={textareaCls} name="features" value={form.features || ""} onChange={handleChange} rows={4}
                placeholder={"Role-Based Access Control\nCourse authoring…"} />
            </FormGroup>
            <FormGroup label="Tags / Technologies (comma-separated)" fullWidth>
              <input className={inputCls} name="tags" value={form.tags || ""} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input className={inputCls} type="url" name="github" value={form.github || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Live URL">
              <input className={inputCls} type="url" name="live" value={form.live || ""} onChange={handleChange} />
            </FormGroup>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" className={btnSecondary} onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className={btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
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
      showToast("Error loading projects: " + (err.message || "Failed to fetch"), "error");
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
        showToast(`Project "${res.data.title}" created successfully!`, "success");
      } else {
        const res = await projectsApi.update(project.id, project);
        showToast(`Project "${res.data.title}" updated successfully!`, "success");
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
      <AdminSection title="Work / Projects" desc="Loading projects data from backend server...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection title="Work / Projects" desc="Add, edit, or remove portfolio projects with persistent storage.">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <p className="m-0 text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        <div className="flex gap-2.5">
          <button className={`${btnPrimary} !px-3 !py-1.5 !text-xs`} onClick={() => editModal.open({ ...EMPTY_PROJECT })}>
            <Plus size={13} />
            <span>Add Project</span>
          </button>
          <button className={`${btnSuccess} !px-3 !py-1.5 !text-xs`} onClick={handleSaveAll} disabled={saving}>
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["#", "Title", "Category", "Year", "Tags", "Featured", "Actions"].map((h) => (
                  <th key={h} className="bg-gray-50 text-gray-600 font-semibold px-4 py-2.5 text-left border-b border-gray-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-100 text-gray-400 font-semibold">{p.number}</td>
                  <td className="px-4 py-2.5 border-b border-gray-100">
                    <div className="font-semibold text-gray-900">{p.title}</div>
                    <div className="text-xs text-gray-400">{p.subtitle}</div>
                  </td>
                  <td className="px-4 py-2.5 border-b border-gray-100">
                    <span className={badgeBlue}>{p.category}</span>
                  </td>
                  <td className="px-4 py-2.5 border-b border-gray-100 text-gray-700">{p.year}</td>
                  <td className="px-4 py-2.5 border-b border-gray-100">
                    <div className="flex gap-1 flex-wrap">
                      {(Array.isArray(p.tags) ? p.tags : []).slice(0, 3).map((tag) => (
                        <span key={tag} className={badgePurple}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 border-b border-gray-100">
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
                  <td className="px-4 py-2.5 border-b border-gray-100">
                    <div className="flex gap-2">
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
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {editModal.modal && <ProjectModal project={editModal.modal} onSave={handleSaveProject} onClose={editModal.close} />}
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
