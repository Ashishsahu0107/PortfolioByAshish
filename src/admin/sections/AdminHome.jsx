import { useState } from "react";
import { User, Link2, RotateCcw, Save, Loader2 } from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast,
  inputCls, textareaCls, btnPrimary, btnSecondary,
} from "../adminUtils";
import { developer } from "../../data/developer";

const INITIAL = {
  name: developer.name,
  role: developer.role,
  tagline: developer.tagline,
  statusPhrase: developer.statusPhrase,
  availableForWork: developer.availableForWork,
  bio: developer.bio,
  philosophy: developer.philosophy,
  location: developer.location,
  degree: developer.degree,
  graduatingYear: developer.graduatingYear,
  email: developer.email,
  github: developer.github,
  linkedin: developer.linkedin,
  resumeUrl: developer.resumeUrl,
};

export default function AdminHome() {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Hero section saved successfully!", "success");
  };

  const handleReset = () => {
    setForm(INITIAL);
    showToast("Reset to original values.", "info");
  };

  return (
    <AdminSection title="Home / Hero Section" desc="Edit the hero content that appears at the top of your portfolio.">
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Personal Info */}
        <AdminCard title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Full Name">
              <input className={inputCls} name="name" value={form.name} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Professional Role / Title">
              <input className={inputCls} name="role" value={form.role} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Tagline">
              <input className={inputCls} name="tagline" value={form.tagline} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Status Phrase">
              <input className={inputCls} name="statusPhrase" value={form.statusPhrase} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Location">
              <input className={inputCls} name="location" value={form.location} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Graduating Year">
              <input className={inputCls} name="graduatingYear" value={form.graduatingYear} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Degree" fullWidth>
              <input className={inputCls} name="degree" value={form.degree} onChange={handleChange} />
            </FormGroup>
            <div className="col-span-full flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="availableForWork"
                name="availableForWork"
                checked={form.availableForWork}
                onChange={handleChange}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="availableForWork" className="text-xs font-semibold text-gray-600 cursor-pointer">
                Available for Work
              </label>
            </div>
            <FormGroup label="Bio" fullWidth>
              <textarea className={textareaCls} name="bio" value={form.bio} onChange={handleChange} rows={4} />
            </FormGroup>
            <FormGroup label="Philosophy / Motto" fullWidth>
              <textarea className={textareaCls} name="philosophy" value={form.philosophy} onChange={handleChange} rows={2} />
            </FormGroup>
          </div>
        </AdminCard>

        {/* Links */}
        <AdminCard title="Contact & Links" icon={Link2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Email">
              <input className={inputCls} type="email" name="email" value={form.email} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input className={inputCls} type="url" name="github" value={form.github} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="LinkedIn URL">
              <input className={inputCls} type="url" name="linkedin" value={form.linkedin} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Resume PDF URL">
              <input className={inputCls} name="resumeUrl" value={form.resumeUrl} onChange={handleChange} />
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
                <span>Saving…</span>
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
