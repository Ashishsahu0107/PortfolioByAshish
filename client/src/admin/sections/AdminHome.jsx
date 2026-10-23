import { useState, useEffect } from "react";
import { User, Link2, FileText, Pencil, Save, X, Loader2 } from "lucide-react";
import {
  AdminSection,
  AdminCard,
  FormGroup,
  useToast,
  Toast,
  inputCls,
  textareaCls,
  btnPrimary,
  btnSecondary,
} from "../adminUtils";
import { developerApi } from "../../services/api";

const EMPTY_DEV = {
  name: "",
  role: "",
  tagline: "",
  statusPhrase: "",
  availableForWork: true,
  bio: "",
  philosophy: "",
  location: "",
  degree: "",
  graduatingYear: "",
  email: "",
  github: "",
  linkedin: "",
  resumeUrl: "",
};

export default function AdminHome() {
  const [form, setForm] = useState(EMPTY_DEV);
  const [original, setOriginal] = useState(EMPTY_DEV);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null); // 'personal' | 'bio' | 'links' | null
  const { toast, showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await developerApi.get();
        if (data) {
          setForm(data);
          setOriginal(data);
        }
      } catch (err) {
        showToast("Error loading developer data: " + (err.message || "Failed to fetch from API"), "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleStartEdit = (sectionKey) => {
    // If another section had unsaved changes, revert to original
    setForm({ ...original });
    setEditingSection(sectionKey);
  };

  const handleCancel = (sectionKey) => {
    setForm({ ...original });
    setEditingSection(null);
    showToast(`Cancelled editing ${sectionKey} section.`, "info");
  };

  const handleSaveSection = async (sectionKey, e) => {
    if (e) e.preventDefault();
    setSavingSection(sectionKey);
    try {
      const res = await developerApi.update(form);
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      setEditingSection(null);
      showToast("Section changes saved successfully to database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <AdminSection title="Home / Hero Section" desc="Loading section data from backend server...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  const isEditingPersonal = editingSection === "personal";
  const isEditingBio = editingSection === "bio";
  const isEditingLinks = editingSection === "links";

  return (
    <AdminSection
      title="Home / Hero Section"
      desc="Edit each card independently with dedicated Edit, Save, and Cancel controls."
    >
      <div className="flex flex-col gap-6">
        {/* 1. Personal Information Card */}
        <AdminCard
          title="Personal Information"
          icon={User}
          action={
            !isEditingPersonal ? (
              <button
                type="button"
                onClick={() => handleStartEdit("personal")}
                className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                title="Edit Personal Information"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCancel("Personal Information")}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  disabled={savingSection === "personal"}
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveSection("personal", e)}
                  className={`${btnPrimary} !px-3 !py-1 !text-xs`}
                  disabled={savingSection === "personal"}
                >
                  {savingSection === "personal" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{savingSection === "personal" ? "Saving…" : "Save"}</span>
                </button>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Full Name">
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
                required
              />
            </FormGroup>
            <FormGroup label="Professional Role / Title">
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="role"
                value={form.role || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
                required
              />
            </FormGroup>
            <FormGroup label="Tagline">
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="tagline"
                value={form.tagline || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
              />
            </FormGroup>
            <FormGroup label="Status Phrase">
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="statusPhrase"
                value={form.statusPhrase || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
              />
            </FormGroup>
            <FormGroup label="Location">
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
              />
            </FormGroup>
            <FormGroup label="Graduating Year">
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="graduatingYear"
                value={form.graduatingYear || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
              />
            </FormGroup>
            <FormGroup label="Degree" fullWidth>
              <input
                className={`${inputCls} ${!isEditingPersonal ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="degree"
                value={form.degree || ""}
                onChange={handleChange}
                disabled={!isEditingPersonal}
              />
            </FormGroup>
            <div className="col-span-full flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="availableForWork"
                name="availableForWork"
                checked={Boolean(form.availableForWork)}
                onChange={handleChange}
                disabled={!isEditingPersonal}
                className={`w-4 h-4 accent-indigo-600 ${!isEditingPersonal ? "cursor-not-allowed" : "cursor-pointer"}`}
              />
              <label
                htmlFor="availableForWork"
                className={`text-xs font-semibold ${!isEditingPersonal ? "text-gray-400 cursor-not-allowed" : "text-gray-600 cursor-pointer"}`}
              >
                Available for Work & Opportunities
              </label>
            </div>
          </div>
        </AdminCard>

        {/* 2. Biography & Philosophy Card */}
        <AdminCard
          title="Biography & Philosophy"
          icon={FileText}
          action={
            !isEditingBio ? (
              <button
                type="button"
                onClick={() => handleStartEdit("bio")}
                className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                title="Edit Bio & Philosophy"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCancel("Biography & Philosophy")}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  disabled={savingSection === "bio"}
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveSection("bio", e)}
                  className={`${btnPrimary} !px-3 !py-1 !text-xs`}
                  disabled={savingSection === "bio"}
                >
                  {savingSection === "bio" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{savingSection === "bio" ? "Saving…" : "Save"}</span>
                </button>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <FormGroup label="Bio Description" fullWidth>
              <textarea
                className={`${textareaCls} ${!isEditingBio ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="bio"
                value={form.bio || ""}
                onChange={handleChange}
                disabled={!isEditingBio}
                rows={4}
              />
            </FormGroup>
            <FormGroup label="Engineering Philosophy / Motto" fullWidth>
              <textarea
                className={`${textareaCls} ${!isEditingBio ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="philosophy"
                value={form.philosophy || ""}
                onChange={handleChange}
                disabled={!isEditingBio}
                rows={2}
              />
            </FormGroup>
          </div>
        </AdminCard>

        {/* 3. Contact & Social Links Card */}
        <AdminCard
          title="Contact & Social Links"
          icon={Link2}
          action={
            !isEditingLinks ? (
              <button
                type="button"
                onClick={() => handleStartEdit("links")}
                className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                title="Edit Social Links"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCancel("Contact & Links")}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  disabled={savingSection === "links"}
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveSection("links", e)}
                  className={`${btnPrimary} !px-3 !py-1 !text-xs`}
                  disabled={savingSection === "links"}
                >
                  {savingSection === "links" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{savingSection === "links" ? "Saving…" : "Save"}</span>
                </button>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Email">
              <input
                className={`${inputCls} ${!isEditingLinks ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={!isEditingLinks}
              />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input
                className={`${inputCls} ${!isEditingLinks ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                type="url"
                name="github"
                value={form.github || ""}
                onChange={handleChange}
                disabled={!isEditingLinks}
              />
            </FormGroup>
            <FormGroup label="LinkedIn URL">
              <input
                className={`${inputCls} ${!isEditingLinks ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                type="url"
                name="linkedin"
                value={form.linkedin || ""}
                onChange={handleChange}
                disabled={!isEditingLinks}
              />
            </FormGroup>
            <FormGroup label="Resume PDF URL">
              <input
                className={`${inputCls} ${!isEditingLinks ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="resumeUrl"
                value={form.resumeUrl || ""}
                onChange={handleChange}
                disabled={!isEditingLinks}
              />
            </FormGroup>
          </div>
        </AdminCard>
      </div>
      <Toast toast={toast} />
    </AdminSection>
  );
}
