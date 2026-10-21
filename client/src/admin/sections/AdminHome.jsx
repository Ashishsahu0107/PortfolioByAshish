import { useState, useEffect } from "react";
import { User, Link2, RotateCcw, Save, Loader2 } from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast,
  inputCls, textareaCls, btnPrimary, btnSecondary,
} from "../adminUtils";
import { developerApi } from "../../services/api";

const FALLBACK = {
  name: "Ashish Sahu",
  role: "Full Stack Developer",
  tagline: "Editorial craft meets engineering precision.",
  statusPhrase: "Available for opportunities",
  availableForWork: true,
  bio: "",
  philosophy: "",
  location: "India",
  degree: "B.Tech in Computer Science and Engineering",
  graduatingYear: "2026",
  email: "ashishsahu01072005@gmail.com",
  github: "https://github.com/Ashishsahu0107",
  linkedin: "https://linkedin.com/in/ashishsahu0107",
  resumeUrl: "/resume/ashish-sahu-resume.pdf",
};

export default function AdminHome() {
  const [form, setForm] = useState(FALLBACK);
  const [original, setOriginal] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        showToast("Using local fallback: " + (err.message || "Failed to fetch from API"), "info");
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await developerApi.update(form);
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      showToast("Hero section saved successfully to database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save hero changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(original);
    showToast("Reset to saved values.", "info");
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

  return (
    <AdminSection title="Home / Hero Section" desc="Edit the hero content that appears at the top of your portfolio.">
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Personal Info */}
        <AdminCard title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Full Name">
              <input className={inputCls} name="name" value={form.name || ""} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Professional Role / Title">
              <input className={inputCls} name="role" value={form.role || ""} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Tagline">
              <input className={inputCls} name="tagline" value={form.tagline || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Status Phrase">
              <input className={inputCls} name="statusPhrase" value={form.statusPhrase || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Location">
              <input className={inputCls} name="location" value={form.location || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Graduating Year">
              <input className={inputCls} name="graduatingYear" value={form.graduatingYear || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Degree" fullWidth>
              <input className={inputCls} name="degree" value={form.degree || ""} onChange={handleChange} />
            </FormGroup>
            <div className="col-span-full flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="availableForWork"
                name="availableForWork"
                checked={Boolean(form.availableForWork)}
                onChange={handleChange}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="availableForWork" className="text-xs font-semibold text-gray-600 cursor-pointer">
                Available for Work
              </label>
            </div>
            <FormGroup label="Bio" fullWidth>
              <textarea className={textareaCls} name="bio" value={form.bio || ""} onChange={handleChange} rows={4} />
            </FormGroup>
            <FormGroup label="Philosophy / Motto" fullWidth>
              <textarea className={textareaCls} name="philosophy" value={form.philosophy || ""} onChange={handleChange} rows={2} />
            </FormGroup>
          </div>
        </AdminCard>

        {/* Links */}
        <AdminCard title="Contact & Links" icon={Link2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Email">
              <input className={inputCls} type="email" name="email" value={form.email || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input className={inputCls} type="url" name="github" value={form.github || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="LinkedIn URL">
              <input className={inputCls} type="url" name="linkedin" value={form.linkedin || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Resume PDF URL">
              <input className={inputCls} name="resumeUrl" value={form.resumeUrl || ""} onChange={handleChange} />
            </FormGroup>
          </div>
        </AdminCard>

        <div className="flex gap-3 justify-end">
          <button type="button" className={btnSecondary} onClick={handleReset}>
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving to Database…</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
      <Toast toast={toast} />
    </AdminSection>
  );
}
