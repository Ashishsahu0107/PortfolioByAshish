import { useState } from "react";
import { Plus, Trash2, Save, Loader2, Code2 } from "lucide-react";
import {
  AdminSection, AdminCard, FormGroup, useToast, Toast, ConfirmModal, useModal,
  inputCls, btnPrimary, btnSecondary, btnDanger, btnSuccess,
} from "../adminUtils";
import { skillCategories } from "../../data/skills";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function AdminSkills() {
  const [categories, setCategories] = useState(deepClone(skillCategories));
  const [activeTab, setActiveTab] = useState(skillCategories[0]?.id || "");
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();
  const deleteModal = useModal();

  const activeCategory = categories.find((c) => c.id === activeTab);

  const addCategory = () => {
    const id = "category_" + Date.now();
    setCategories((prev) => [
      ...prev,
      { id, label: "New Category", color: "var(--color-accent)", skills: [] },
    ]);
    setActiveTab(id);
  };
  const updateCategoryLabel = (id, label) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
  const removeCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (activeTab === id) setActiveTab(categories.find((c) => c.id !== id)?.id || "");
    showToast("Category removed.", "info");
  };

  const updateSkill = (skillIdx, field, value) =>
    setCategories((prev) =>
      prev.map((c) =>
        c.id === activeTab
          ? {
              ...c,
              skills: c.skills.map((s, i) =>
                i === skillIdx ? { ...s, [field]: field === "level" ? Number(value) : value } : s
              ),
            }
          : c
      )
    );
  const addSkill = () =>
    setCategories((prev) =>
      prev.map((c) =>
        c.id === activeTab
          ? { ...c, skills: [...c.skills, { name: "", description: "", level: 75, icon: "Code2" }] }
          : c
      )
    );
  const confirmDeleteSkill = (idx) => deleteModal.open({ idx });
  const deleteSkill = () => {
    const idx = deleteModal.modal?.idx;
    if (idx === undefined) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === activeTab ? { ...c, skills: c.skills.filter((_, i) => i !== idx) } : c
      )
    );
    deleteModal.close();
    showToast("Skill removed.", "info");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Skills saved successfully!", "success");
  };

  return (
    <AdminSection title="Skills" desc="Manage skill categories and individual proficiency levels.">
      <AdminCard>
        {/* Tabs */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all",
                  activeTab === cat.id
                    ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white border-transparent shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                    : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100",
                ].join(" ")}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <button type="button" className={`${btnSuccess} !px-3 !py-1.5 !text-xs`} onClick={addCategory}>
            <Plus size={13} />
            <span>New Category</span>
          </button>
        </div>

        {activeCategory && (
          <>
            {/* Category name + remove */}
            <div className="flex items-end gap-3 mb-5">
              <FormGroup label="Category Name">
                <input
                  className={`${inputCls} max-w-[260px]`}
                  value={activeCategory.label}
                  onChange={(e) => updateCategoryLabel(activeCategory.id, e.target.value)}
                />
              </FormGroup>
              <button
                type="button"
                className={`${btnDanger} !px-3 !py-2 !text-xs mb-0.5`}
                onClick={() => removeCategory(activeCategory.id)}
              >
                <Trash2 size={13} />
                <span>Remove Category</span>
              </button>
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-3">
              {activeCategory.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormGroup label="Skill Name">
                      <input
                        className={inputCls}
                        value={skill.name}
                        onChange={(e) => updateSkill(idx, "name", e.target.value)}
                        placeholder="e.g. React"
                      />
                    </FormGroup>
                    <FormGroup label="Icon Name / Key">
                      <input
                        className={inputCls}
                        value={skill.icon}
                        onChange={(e) => updateSkill(idx, "icon", e.target.value)}
                        placeholder="e.g. Code2, Server, Database"
                      />
                    </FormGroup>
                    <FormGroup label="Description" fullWidth>
                      <input
                        className={inputCls}
                        value={skill.description}
                        onChange={(e) => updateSkill(idx, "description", e.target.value)}
                      />
                    </FormGroup>
                    <div className="col-span-full">
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Proficiency Level: {skill.level}%
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={skill.level}
                        onChange={(e) => updateSkill(idx, "level", e.target.value)}
                        className="w-full accent-indigo-600"
                      />
                      <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
                        <span>0%</span><span>50%</span><span>100%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${btnDanger} !px-2.5 !py-2 !text-xs self-start mt-5`}
                    onClick={() => confirmDeleteSkill(idx)}
                    aria-label="Delete skill"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className={`${btnSecondary} mt-3`} onClick={addSkill}>
              <Plus size={13} />
              <span>Add Skill</span>
            </button>
          </>
        )}
      </AdminCard>

      <div className="flex justify-end mt-4">
        <button className={btnPrimary} onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Save All Skills</span>
            </>
          )}
        </button>
      </div>

      {deleteModal.modal !== null && (
        <ConfirmModal
          title="Delete Skill"
          message="Are you sure you want to remove this skill? This action cannot be undone."
          onConfirm={deleteSkill}
          onCancel={deleteModal.close}
        />
      )}
      <Toast toast={toast} />
    </AdminSection>
  );
}
