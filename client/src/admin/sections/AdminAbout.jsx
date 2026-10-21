import { useState, useEffect } from "react";
import { FileText, Target, BarChart3, Plus, Trash2, RotateCcw, Save, Loader2 } from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast,
  inputCls, textareaCls, selectCls, btnPrimary, btnSecondary, btnDanger,
} from "../adminUtils";
import { aboutApi } from "../../services/api";

const ICON_OPTIONS = ["Code2", "Server", "Database", "Cpu", "Terminal", "Globe", "Layers", "Zap"];

const DEFAULT_ABOUT = {
  bio: "",
  philosophy: "",
  focusAreas: [],
  stats: [],
};

export default function AdminAbout() {
  const [form, setForm] = useState(DEFAULT_ABOUT);
  const [original, setOriginal] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await aboutApi.get();
        if (data) {
          setForm(data);
          setOriginal(data);
        }
      } catch (err) {
        showToast("Error loading about data: " + (err.message || "Failed to fetch"), "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await aboutApi.update(form);
      if (res.data) {
        setForm(res.data);
        setOriginal(res.data);
      }
      showToast("About section saved successfully to database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save about section", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateFocusArea = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.map((f, i) => (i === idx ? { ...f, [field]: value } : f)),
    }));

  const addFocusArea = () =>
    setForm((prev) => ({
      ...prev,
      focusAreas: [...(prev.focusAreas || []), { title: "", description: "", icon: "Code2" }],
    }));

  const removeFocusArea = (idx) => {
    setForm((prev) => ({ ...prev, focusAreas: prev.focusAreas.filter((_, i) => i !== idx) }));
    showToast("Focus area removed.", "info");
  };

  const updateStat = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));

  const addStat = () =>
    setForm((prev) => ({ ...prev, stats: [...(prev.stats || []), { value: "", label: "" }] }));

  const removeStat = (idx) =>
    setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }));

  if (loading) {
    return (
      <AdminSection title="About Section" desc="Loading section data from backend server...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Connecting to database...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection title="About Section" desc="Manage your bio, philosophy, focus areas, and stats cards.">
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Bio */}
        <AdminCard title="Bio & Philosophy" icon={FileText}>
          <div className="flex flex-col gap-4">
            <FormGroup label="Bio">
              <textarea
                className={textareaCls}
                rows={4}
                value={form.bio || ""}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              />
            </FormGroup>
            <FormGroup label="Philosophy / Motto">
              <textarea
                className={textareaCls}
                rows={2}
                value={form.philosophy || ""}
                onChange={(e) => setForm((p) => ({ ...p, philosophy: e.target.value }))}
              />
            </FormGroup>
          </div>
        </AdminCard>

        {/* Focus Areas */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900 m-0">Focus Areas</h2>
            </div>
            <button type="button" className={`${btnPrimary} !px-3 !py-1.5 !text-xs`} onClick={addFocusArea}>
              <Plus size={13} />
              <span>Add Area</span>
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {(form.focusAreas || []).map((area, idx) => (
              <div key={idx} className="flex gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormGroup label="Title">
                    <input
                      className={inputCls}
                      value={area.title || ""}
                      onChange={(e) => updateFocusArea(idx, "title", e.target.value)}
                      placeholder="e.g. Frontend Development"
                    />
                  </FormGroup>
                  <FormGroup label="Icon">
                    <select
                      className={selectCls}
                      value={area.icon || "Code2"}
                      onChange={(e) => updateFocusArea(idx, "icon", e.target.value)}
                    >
                      {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup label="Description" fullWidth>
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={area.description || ""}
                      onChange={(e) => updateFocusArea(idx, "description", e.target.value)}
                    />
                  </FormGroup>
                </div>
                <button
                  type="button"
                  className={`${btnDanger} !px-2.5 !py-2 !text-xs self-start mt-5`}
                  onClick={() => removeFocusArea(idx)}
                  aria-label="Remove focus area"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Stats */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900 m-0">Stats Cards</h2>
            </div>
            <button type="button" className={`${btnPrimary} !px-3 !py-1.5 !text-xs`} onClick={addStat}>
              <Plus size={13} />
              <span>Add Stat</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(form.stats || []).map((stat, idx) => (
              <div key={idx} className="flex items-end gap-2 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                <FormGroup label="Value">
                  <input
                    className={inputCls}
                    value={stat.value || ""}
                    onChange={(e) => updateStat(idx, "value", e.target.value)}
                    placeholder="e.g. 20+"
                  />
                </FormGroup>
                <FormGroup label="Label">
                  <input
                    className={inputCls}
                    value={stat.label || ""}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                    placeholder="e.g. Projects Built"
                  />
                </FormGroup>
                <button
                  type="button"
                  className={`${btnDanger} !px-2.5 !py-2.5 !text-xs mb-0.5`}
                  onClick={() => removeStat(idx)}
                  aria-label="Remove stat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setForm(original);
              showToast("Reset to saved values.", "info");
            }}
          >
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
