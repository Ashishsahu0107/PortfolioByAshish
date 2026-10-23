import { useState, useEffect } from "react";
import {
  Mail,
  Settings2,
  Pencil,
  Save,
  X,
  Loader2,
  Trash2,
  CheckCircle2,
  Inbox,
  Check,
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
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "../adminUtils";
import { contactApi } from "../../services/api";

const INITIAL = {
  email: "",
  github: "",
  linkedin: "",
  location: "",
  statusPhrase: "",
  availableForWork: true,
  emailjsServiceId: "",
  emailjsTemplateId: "",
  emailjsPublicKey: "",
};

export default function AdminContact() {
  const [form, setForm] = useState(INITIAL);
  const [original, setOriginal] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null); // 'contact' | 'emailjs' | null
  const [savingSection, setSavingSection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast, showToast } = useToast();
  const deleteMsgModal = useModal();

  async function loadData() {
    try {
      const data = await contactApi.getInfo();
      if (data) {
        setForm(data);
        setOriginal(data);
      }
    } catch (err) {
      showToast(
        "Error loading contact info: " + (err.message || "Failed to fetch"),
        "error"
      );
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

  const handleStartEdit = (sectionKey) => {
    setForm({ ...original });
    setEditingSection(sectionKey);
  };

  const handleCancel = (sectionName) => {
    setForm({ ...original });
    setEditingSection(null);
    showToast(`Cancelled editing ${sectionName}.`, "info");
  };

  const handleSaveSection = async (sectionKey) => {
    setSavingSection(sectionKey);
    try {
      const res = await contactApi.updateInfo(form);
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      setEditingSection(null);
      showToast("Contact settings saved successfully to database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save contact settings", "error");
    } finally {
      setSavingSection(null);
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

  const handleDeleteMessage = async () => {
    const msgId = deleteMsgModal.modal?.id;
    if (!msgId) return;
    try {
      await contactApi.deleteMessage(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      deleteMsgModal.close();
      showToast("Message deleted from database.", "info");
    } catch (err) {
      showToast(err.message || "Failed to delete message", "error");
    }
  };

  if (loading) {
    return (
      <AdminSection
        title="Contact"
        desc="Loading contact settings from backend server..."
      >
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  const isEditingContact = editingSection === "contact";
  const isEditingEmailJs = editingSection === "emailjs";

  return (
    <AdminSection
      title="Contact & Communication"
      desc="Independent controls for contact coordinates, EmailJS API credentials, and visitor inquiries."
    >
      <div className="flex flex-col gap-6">
        {/* 1. Contact Information Card */}
        <AdminCard
          title="Contact Information & Availability"
          icon={Mail}
          action={
            !isEditingContact ? (
              <button
                type="button"
                onClick={() => handleStartEdit("contact")}
                className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                title="Edit Contact Info"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCancel("Contact Info")}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  disabled={savingSection === "contact"}
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection("contact")}
                  className={`${btnPrimary} !px-3 !py-1 !text-xs`}
                  disabled={savingSection === "contact"}
                >
                  {savingSection === "contact" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{savingSection === "contact" ? "Saving…" : "Save"}</span>
                </button>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup label="Email Address">
              <input
                className={`${inputCls} ${!isEditingContact ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={!isEditingContact}
              />
            </FormGroup>
            <FormGroup label="Location / Timezone">
              <input
                className={`${inputCls} ${!isEditingContact ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                disabled={!isEditingContact}
              />
            </FormGroup>
            <FormGroup label="Availability Status Phrase">
              <input
                className={`${inputCls} ${!isEditingContact ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="statusPhrase"
                value={form.statusPhrase || ""}
                onChange={handleChange}
                disabled={!isEditingContact}
              />
            </FormGroup>
            <div className="col-span-full flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="contactAvailableForWork"
                name="availableForWork"
                checked={Boolean(form.availableForWork)}
                onChange={handleChange}
                disabled={!isEditingContact}
                className={`w-4 h-4 accent-indigo-600 ${!isEditingContact ? "cursor-not-allowed" : "cursor-pointer"}`}
              />
              <label
                htmlFor="contactAvailableForWork"
                className={`text-xs font-semibold ${!isEditingContact ? "text-gray-400 cursor-not-allowed" : "text-gray-600 cursor-pointer"}`}
              >
                Display &quot;Available for work&quot; green pulse indicator
              </label>
            </div>
          </div>
        </AdminCard>

        {/* 2. EmailJS Credentials Card */}
        <AdminCard
          title="EmailJS Dispatch Integration"
          icon={Settings2}
          action={
            !isEditingEmailJs ? (
              <button
                type="button"
                onClick={() => handleStartEdit("emailjs")}
                className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                title="Edit EmailJS Settings"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCancel("EmailJS Settings")}
                  className={`${btnSecondary} !px-2.5 !py-1 !text-xs`}
                  disabled={savingSection === "emailjs"}
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection("emailjs")}
                  className={`${btnPrimary} !px-3 !py-1 !text-xs`}
                  disabled={savingSection === "emailjs"}
                >
                  {savingSection === "emailjs" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>{savingSection === "emailjs" ? "Saving…" : "Save"}</span>
                </button>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormGroup label="Service ID">
              <input
                className={`${inputCls} ${!isEditingEmailJs ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="emailjsServiceId"
                value={form.emailjsServiceId || ""}
                onChange={handleChange}
                disabled={!isEditingEmailJs}
                placeholder="service_..."
              />
            </FormGroup>
            <FormGroup label="Template ID">
              <input
                className={`${inputCls} ${!isEditingEmailJs ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="emailjsTemplateId"
                value={form.emailjsTemplateId || ""}
                onChange={handleChange}
                disabled={!isEditingEmailJs}
                placeholder="template_..."
              />
            </FormGroup>
            <FormGroup label="Public Key">
              <input
                className={`${inputCls} ${!isEditingEmailJs ? "bg-gray-100/60 cursor-not-allowed opacity-80" : ""}`}
                name="emailjsPublicKey"
                value={form.emailjsPublicKey || ""}
                onChange={handleChange}
                disabled={!isEditingEmailJs}
                placeholder="public_key..."
              />
            </FormGroup>
          </div>
        </AdminCard>

        {/* 3. Messages Inbox */}
        <AdminCard
          title="Visitor Inquiries Inbox"
          icon={Inbox}
          action={
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold">
              {messages.length} messages
            </span>
          }
        >
          {loadingMessages ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin inline mr-2 text-indigo-600" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm italic">
              No inquiries received yet. Visitor form submissions will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-all ${
                    msg.read ? "bg-white border-gray-200" : "bg-indigo-50/40 border-indigo-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold text-gray-900">
                          {msg.name}
                        </strong>
                        <span className="text-xs text-gray-400 font-mono">
                          &lt;{msg.email}&gt;
                        </span>
                        {!msg.read && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-semibold uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-indigo-600">
                        {msg.subject || "(No subject)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(msg.id, msg.read)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-gray-100"
                        title={msg.read ? "Mark as unread" : "Mark as read"}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMsgModal.open(msg)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100"
                        title="Delete message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap m-0">
                    {msg.message}
                  </p>
                  <span className="mt-2 block text-[10px] text-gray-400 font-mono">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {deleteMsgModal.modal && (
        <ConfirmModal
          title="Delete Message"
          message={`Are you sure you want to delete inquiry from "${deleteMsgModal.modal.name}"?`}
          onConfirm={handleDeleteMessage}
          onCancel={deleteMsgModal.close}
        />
      )}

      <Toast toast={toast} />
    </AdminSection>
  );
}
