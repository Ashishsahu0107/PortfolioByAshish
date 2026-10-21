import { useState, useEffect } from "react";
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
  Inbox,
  Trash2,
  Check,
} from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast,
  inputCls, btnPrimary, btnSecondary, btnDanger,
} from "../adminUtils";
import { contactApi } from "../../services/api";

const INITIAL = {
  email: "ashishsahu01072005@gmail.com",
  github: "https://github.com/Ashishsahu0107",
  linkedin: "https://linkedin.com/in/ashishsahu0107",
  location: "India",
  statusPhrase: "Available for opportunities",
  availableForWork: true,
  emailjsServiceId: "",
  emailjsTemplateId: "",
  emailjsPublicKey: "",
};

export default function AdminContact() {
  const [form, setForm] = useState(INITIAL);
  const [original, setOriginal] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast, showToast } = useToast();

  async function loadData() {
    try {
      const data = await contactApi.getInfo();
      if (data) {
        setForm(data);
        setOriginal(data);
      }
    } catch (err) {
      showToast("Error loading contact info: " + (err.message || "Failed to fetch"), "error");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    setLoadingMessages(true);
    try {
      const res = await contactApi.getMessages();
      if (res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.warn("Could not load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    loadData();
    loadMessages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await contactApi.updateInfo(form);
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      showToast("Contact information saved to database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save contact settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRead = async (msgId, currentStatus) => {
    try {
      await contactApi.markRead(msgId, !currentStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, read: !currentStatus } : m))
      );
      showToast("Message status updated.", "info");
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await contactApi.deleteMessage(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      showToast("Message deleted.", "info");
    } catch (err) {
      showToast(err.message || "Failed to delete message", "error");
    }
  };

  if (loading) {
    return (
      <AdminSection title="Contact" desc="Loading contact settings from backend server...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection title="Contact" desc="Update contact info, social links, email credentials, and view persistent inquiries.">
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Contact Info */}
        <AdminCard title="Contact Information" icon={Mail}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Email Address">
              <input className={inputCls} type="email" name="email" value={form.email || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Location">
              <input className={inputCls} name="location" value={form.location || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input className={inputCls} type="url" name="github" value={form.github || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="LinkedIn URL">
              <input className={inputCls} type="url" name="linkedin" value={form.linkedin || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup label="Status Phrase">
              <input className={inputCls} name="statusPhrase" value={form.statusPhrase || ""} onChange={handleChange} />
            </FormGroup>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" className="w-4 h-4 accent-indigo-600 cursor-pointer" name="availableForWork"
                id="availableForWork" checked={Boolean(form.availableForWork)} onChange={handleChange} />
              <label htmlFor="availableForWork" className="text-xs font-semibold text-gray-600 cursor-pointer">
                Available for Work
              </label>
            </div>
          </div>
        </AdminCard>

        {/* EmailJS */}
        <AdminCard title="EmailJS Integration" icon={Settings2}>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-amber-700 flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 text-amber-600 mt-0.5" />
            <span>Optional client-side dispatch parameters stored securely in backend configuration.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormGroup label="Service ID">
              <input className={inputCls} name="emailjsServiceId" value={form.emailjsServiceId || ""} onChange={handleChange} placeholder="service_xxxxxxx" />
            </FormGroup>
            <FormGroup label="Template ID">
              <input className={inputCls} name="emailjsTemplateId" value={form.emailjsTemplateId || ""} onChange={handleChange} placeholder="template_xxxxxxx" />
            </FormGroup>
            <FormGroup label="Public Key">
              <input className={inputCls} name="emailjsPublicKey" value={form.emailjsPublicKey || ""} onChange={handleChange} placeholder="XXXXXXXXXXXXXXXXXXXX" />
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
            onClick={() => { setForm(original); showToast("Reset to saved values.", "info"); }}>
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
                <span>Save Contact</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Persistent Message Inbox */}
      <div className="mt-8">
        <AdminCard title={`Inbox Messages (${messages.length})`} icon={Inbox}>
          {loadingMessages ? (
            <div className="flex items-center justify-center p-6 text-gray-400 gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span>Checking inbox messages…</span>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-500 py-3">No messages received yet. Visitor contact inquiries will appear here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all ${
                    m.read ? "bg-white border-gray-200" : "bg-indigo-50/50 border-indigo-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">{m.name}</span>
                        <span className="text-xs text-gray-500">· {m.email}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(m.receivedAt || m.createdAt).toLocaleString()}
                        </span>
                        {!m.read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">{m.subject}</p>
                      <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(m.id, m.read)}
                        className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                        title={m.read ? "Mark as unread" : "Mark as read"}
                      >
                        <Check size={12} className={m.read ? "text-gray-400" : "text-indigo-600"} />
                        <span>{m.read ? "Read" : "Mark Read"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(m.id)}
                        className={`${btnDanger} !px-2 !py-1 !text-xs`}
                        title="Delete message"
                        aria-label="Delete message"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <Toast toast={toast} />
    </AdminSection>
  );
}
