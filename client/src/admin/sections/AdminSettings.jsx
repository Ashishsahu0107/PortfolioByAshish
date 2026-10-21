import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, Lock, ShieldAlert, LogOut, Info, Loader2, Check } from "lucide-react";
import {
  AdminSection, AdminCard, useToast, Toast, ConfirmModal, useModal,
  inputCls, btnPrimary, btnDanger,
} from "../adminUtils";
import { useAuth } from "../../auth/AuthContext";

export default function AdminSettings() {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const logoutModal = useModal();

  const [appearance, setAppearance] = useState({ compactMode: false, showTips: true });
  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!security.currentPassword) {
      showToast("Please enter your current password.", "error");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }
    if (security.newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(security.currentPassword, security.newPassword);
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password updated successfully in database!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setSavingPassword(false);
    }
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
    <AdminSection title="Settings" desc="Admin appearance, security credentials, and session management.">
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-emerald-800 flex items-start gap-2">
            <Info size={15} className="shrink-0 text-emerald-600 mt-0.5" />
            <span>Credentials are securely hashed with bcrypt (salt rounds: 10) and persisted in the server database.</span>
          </div>
          <form onSubmit={handlePasswordSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="col-span-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Current Password</label>
                <input
                  type="password"
                  className={inputCls}
                  value={security.currentPassword}
                  onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">New Password</label>
                <input
                  type="password"
                  className={inputCls}
                  value={security.newPassword}
                  onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Confirm New Password</label>
                <input
                  type="password"
                  className={inputCls}
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className={btnPrimary} disabled={savingPassword}>
                {savingPassword ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Updating Credentials…</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </AdminCard>

        {/* Danger Zone */}
        <AdminCard title="Danger Zone" icon={ShieldAlert}>
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
            <div>
              <p className="m-0 text-sm font-bold text-red-900">Sign Out of Admin Console</p>
              <p className="m-0 text-xs text-red-600 mt-0.5">End your administrative session on this device.</p>
            </div>
            <button className={btnDanger} onClick={() => logoutModal.open()}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </AdminCard>
      </div>

      {logoutModal.modal !== null && (
        <ConfirmModal
          title="Sign Out"
          message="Are you sure you want to end your admin session?"
          confirmText="Sign Out"
          confirmDanger
          onConfirm={handleLogout}
          onCancel={logoutModal.close}
        />
      )}
      <Toast toast={toast} />
    </AdminSection>
  );
}
