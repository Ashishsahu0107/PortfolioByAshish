import { useState } from "react";
import {
  Mail,
  Settings2,
  AlertTriangle,
  Eye,
  MapPin,
  RotateCcw,
  Save,
  Loader2,
  CheckCircle2,
  Briefcase,
  Code2,
} from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast,
  inputCls, btnPrimary, btnSecondary,
} from "../adminUtils";
import { developer } from "../../data/developer";

const INITIAL = {
  email: developer.email,
  github: developer.github,
  linkedin: developer.linkedin,
  location: developer.location,
  statusPhrase: developer.statusPhrase,
  availableForWork: developer.availableForWork,
  emailjsServiceId: developer.emailjsServiceId || "",
  emailjsTemplateId: developer.emailjsTemplateId || "",
  emailjsPublicKey: developer.emailjsPublicKey || "",
};

export default function AdminContact() {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Contact information saved!", "success");
  };

  return (
    <AdminSection title="Contact" desc="Update contact info, social links, and EmailJS configuration.">
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Contact Info */}
        <AdminCard title="Contact Information" icon={Mail}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Email Address">
              <input className={inputCls} type="email" name="email" value={form.email} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Location">
              <input className={inputCls} name="location" value={form.location} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input className={inputCls} type="url" name="github" value={form.github} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="LinkedIn URL">
              <input className={inputCls} type="url" name="linkedin" value={form.linkedin} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Status Phrase">
              <input className={inputCls} name="statusPhrase" value={form.statusPhrase} onChange={handleChange} />
            </FormGroup>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" className="w-4 h-4 accent-indigo-600 cursor-pointer" name="availableForWork"
                id="availableForWork" checked={form.availableForWork} onChange={handleChange} />
              <label htmlFor="availableForWork" className="text-xs font-semibold text-gray-600 cursor-pointer">
                Available for Work
              </label>
            </div>
          </div>
        </AdminCard>

        {/* EmailJS */}
        <AdminCard title="EmailJS Configuration" icon={Settings2}>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-amber-700 flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 text-amber-600 mt-0.5" />
            <span>These values are sourced from your <code>.env</code> file (VITE_EMAILJS_*). Edit them there for production.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormGroup label="Service ID">
              <input className={inputCls} name="emailjsServiceId" value={form.emailjsServiceId} onChange={handleChange} placeholder="service_xxxxxxx" />
            </FormGroup>
            <FormGroup label="Template ID">
              <input className={inputCls} name="emailjsTemplateId" value={form.emailjsTemplateId} onChange={handleChange} placeholder="template_xxxxxxx" />
            </FormGroup>
            <FormGroup label="Public Key">
              <input className={inputCls} name="emailjsPublicKey" value={form.emailjsPublicKey} onChange={handleChange} placeholder="XXXXXXXXXXXXXXXXXXXX" />
            </FormGroup>
          </div>
        </AdminCard>

        {/* Preview */}
        <AdminCard title="Contact Card Preview" icon={Eye}>
          <div className="bg-gray-50 rounded-xl p-5 flex flex-col gap-3">
            {[
              { icon: Mail, label: "Email", value: form.email },
              { icon: MapPin, label: "Location", value: form.location },
              { icon: Code2, label: "GitHub", value: form.github },
              { icon: Briefcase, label: "LinkedIn", value: form.linkedin },
              { icon: CheckCircle2, label: "Status", value: `${form.statusPhrase} (${form.availableForWork ? "Available" : "Unavailable"})` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-2.5 items-start">
                <Icon size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="text-[11px] font-semibold text-gray-400 w-16 shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-gray-700 break-all">{value}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <div className="flex gap-3 justify-end">
          <button type="button" className={btnSecondary}
            onClick={() => { setForm(INITIAL); showToast("Reset to original.", "info"); }}>
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
                <span>Save Contact</span>
              </>
            )}
          </button>
        </div>
      </form>
      <Toast toast={toast} />
    </AdminSection>
  );
}
