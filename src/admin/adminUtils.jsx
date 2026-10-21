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
    success: "bg-emerald-600",
    error: "bg-red-500",
    info: "bg-blue-600",
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-2xl animate-[fadeUp_0.3s_ease] ${colors[toast.type] || colors.success}`}
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
      className="fixed inset-0 bg-black/45 z-[500] flex items-center justify-center p-5"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl animate-[scaleIn_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-900">
            <AlertTriangle size={18} className="text-amber-500 shrink-0" />
            <h3 className="text-base font-bold m-0">{title || "Confirm Action"}</h3>
          </div>
          <button
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-1">{message}</p>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all"
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
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{title}</h1>
        {desc && <p className="text-sm text-gray-500 m-0">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

/** Reusable card */
export function AdminCard({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`}>
      {title && (
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
          {Icon && <Icon size={16} className="text-indigo-600 shrink-0" />}
          <span>{title}</span>
        </h2>
      )}
      {children}
    </div>
  );
}

/** Form group wrapper */
export function FormGroup({ label, children, fullWidth = false }) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "col-span-full" : ""}`}>
      {label && <label className="text-xs font-semibold text-gray-600 tracking-wide">{label}</label>}
      {children}
    </div>
  );
}

/** Input styles (shared class string) */
export const inputCls =
  "w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-[inherit]";

export const textareaCls =
  "w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-[inherit] resize-y min-h-[80px]";

export const selectCls =
  "w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-[inherit]";

/** Button variants */
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-[0_3px_10px_rgba(79,70,229,0.3)] hover:shadow-[0_5px_16px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-all";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all";
export const btnSuccess =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all";
export const btnSm = "!px-3 !py-1.5 !text-xs";

/** Badge variants */
export const badgeBlue = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600";
export const badgeGreen = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600";
export const badgeOrange = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-500";
export const badgePurple = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-600";
