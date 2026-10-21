import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, Lock, ShieldAlert, LogOut, Info } from "lucide-react";
import {
  AdminSection, AdminCard, useToast, Toast, ConfirmModal, useModal,
  inputCls, btnPrimary, btnDanger,
} from "../adminUtils";
import { useAuth } from "../../auth/AuthContext";

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const logoutModal = useModal();

  const [appearance, setAppearance] = useState({ compactMode: false, showTips: true });
  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!security.currentPassword) { showToast("Please enter current password.", "error"); return; }
    if (security.newPassword !== security.confirmPassword) { showToast("New passwords do not match!", "error"); return; }
    if (security.newPassword.length < 8) { showToast("Password must be at least 8 characters.", "error"); return; }
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showToast("Password change simulated (connect backend to persist).", "success");
  };

  const handleLogout = () => {
    logout();
    navigate("/secret-login", { replace: true });
  };

  const INFO_ROWS = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Role", value: user?.role },
    { label: "Login Time", value: user?.loginTime ? new Date(user.loginTime).toLocaleString() : "—" },
    { label: "Session", value: user?.expiresIn ? `Expires in ${user.expiresIn}` : "—" },
  ];

  const TOGGLES = [
    { name: "compactMode", label: "Compact Mode", desc: "Reduce padding for a denser layout" },
    { name: "showTips", label: "Show Tips", desc: "Display helpful tips throughout the dashboard" },
  ];

  return (
    <AdminSection title="Settings" desc="Admin appearance, security, and session management.">
      <div className="flex flex-col gap-5">
        {/* Account Info */}
        <AdminCard title="Account Information" icon={User}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white text-2xl font-extrabold flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="m-0 text-base font-bold text-gray-900">{user?.name}</p>
              <p className="m-0 text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>
          <div className="flex flex-col">
            {INFO_ROWS.map(({ label, value }) => (
              <div key={label} className="flex gap-2.5 py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs font-semibold text-gray-400 w-24 shrink-0">{label}</span>
                <span className="text-sm text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Appearance */}
        <AdminCard title="Appearance" icon={Palette}>
          <div className="flex flex-col gap-4">
            {TOGGLES.map(({ name, label, desc }) => (
              <div key={name} className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-sm font-semibold text-gray-900">{label}</p>
                  <p className="m-0 text-xs text-gray-400">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  name={name}
                  checked={appearance[name]}
                  onChange={(e) => setAppearance((p) => ({ ...p, [name]: e.target.checked }))}
                />
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Change Password */}
        <AdminCard title="Change Password" icon={Lock}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-blue-700 flex items-start gap-2">
            <Info size={15} className="shrink-0 text-blue-600 mt-0.5" />
            <span>Password changes here are simulated. Connect a real auth backend to persist credential changes.</span>
          </div>
          <form onSubmit={handlePasswordSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="col-span-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Current Password</label>
                <input className={inputCls} type="password" value={security.currentPassword} placeholder="••••••••"
                  onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">New Password</label>
                <input className={inputCls} type="password" value={security.newPassword} placeholder="Min 8 characters"
                  onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Confirm New Password</label>
                <input className={inputCls} type="password" value={security.confirmPassword} placeholder="Repeat new password"
                  onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className={btnPrimary}>
                <Lock size={14} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </AdminCard>

        {/* Danger zone */}
        <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-red-500 mb-4 pb-3 border-b border-red-100 flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500" />
            <span>Danger Zone</span>
          </h2>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="m-0 text-sm font-semibold text-gray-900">Log Out</p>
              <p className="m-0 text-xs text-gray-400">End your admin session and return to login.</p>
            </div>
            <button className={btnDanger} onClick={() => logoutModal.open(true)}>
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {logoutModal.modal && (
        <ConfirmModal
          title="Log Out"
          message="Are you sure you want to end your admin session?"
          onConfirm={handleLogout}
          onCancel={logoutModal.close}
        />
      )}
      <Toast toast={toast} />
    </AdminSection>
  );
}
