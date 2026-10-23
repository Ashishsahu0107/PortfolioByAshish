import { useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

/** Toast hook */
export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);
  return { toast, showToast };
}

/** Modal state hook */
export function useModal(initial = null) {
  const [modal, setModal] = useState(initial);
  const open = useCallback((data) => setModal(data), []);
  const close = useCallback(() => setModal(null), []);
  return { modal, open, close };
}

/** Toast component */
export function Toast({ toast }) {
  if (!toast) return null;
  const icons = {
    success: <CheckCircle2 size={16} className="shrink-0 text-white" />,
    error: <AlertCircle size={16} className="shrink-0 text-white" />,
    info: <Info size={16} className="shrink-0 text-white" />,
  };
  const colors = {
    success: "bg-emerald-600/90 border border-emerald-500/40 text-emerald-100",
    error: "bg-red-600/90 border border-red-500/40 text-red-100",
    info: "bg-blue-600/90 border border-blue-500/40 text-blue-100",
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-2xl backdrop-blur-md animate-[fadeUp_0.3s_ease] ${colors[toast.type] || colors.success}`}
      style={{ animation: "fadeUp 0.3s ease" }}
    >
      {icons[toast.type] || icons.success}
      <span>{toast.message}</span>
    </div>
  );
}

/** Confirm delete modal */
export function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-[500] backdrop-blur-xs flex items-center justify-center p-5"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 w-full max-w-sm shadow-2xl text-zinc-100 animate-[scaleIn_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2 text-white">
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
            <h3 className="text-base font-bold m-0">{title || "Confirm Action"}</h3>
          </div>
          <button
            onClick={onCancel}
            className="bg-zinc-800 hover:bg-zinc-700 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-zinc-400 text-sm mb-1">{message}</p>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/80">
          <button
            onClick={onCancel}
            className={btnSecondary}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={btnDanger}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/** Section wrapper */
export function AdminSection({ title, desc, children }) {
  return (
    <div className="animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 m-0 mb-1">{title}</h1>
        {desc && <p className="text-sm text-zinc-400 m-0">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

/** Reusable card with dark surface & theme accents */
export function AdminCard({ title, icon: Icon, action, children, className = "" }) {
  return (
    <div className={`bg-zinc-900/85 border border-zinc-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80 flex-wrap gap-2">
          <h2 className="text-base font-bold text-zinc-100 m-0 flex items-center gap-2">
            {Icon && <Icon size={16} style={{ color: "var(--admin-glow)" }} className="shrink-0" />}
            <span>{title}</span>
          </h2>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Form group wrapper */
export function FormGroup({ label, children, fullWidth = false }) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "col-span-full" : ""}`}>
      {label && <label className="text-xs font-semibold text-zinc-300 tracking-wide">{label}</label>}
      {children}
    </div>
  );
}

/** Input styles (shared class string) */
export const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:border-[var(--admin-accent)] focus:ring-1 focus:ring-[var(--admin-accent)]/40 transition-all font-[inherit]";

export const textareaCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:border-[var(--admin-accent)] focus:ring-1 focus:ring-[var(--admin-accent)]/40 transition-all font-[inherit] resize-y min-h-[85px]";

export const selectCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/80 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:border-[var(--admin-accent)] focus:ring-1 focus:ring-[var(--admin-accent)]/40 transition-all font-[inherit]";

/** Button variants */
export const btnPrimary =
  "btn-theme-primary inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer border-none text-zinc-950 shadow-md hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

export const btnSecondary =
  "btn-theme-secondary inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer border border-red-500/30 bg-red-950/30 text-red-400 hover:bg-red-950/50 hover:border-red-500/50 transition-all";

export const btnSuccess =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50 hover:border-emerald-500/50 transition-all";

export const btnSm = "!px-3 !py-1.5 !text-xs";

/** Badge variants */
export const badgeBlue =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300";

export const badgeGreen =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

export const badgeOrange =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-300";

export const badgePurple =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300";
