import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  User,
  Zap,
  FolderGit2,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  Menu,
  Globe,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  FileSpreadsheet,
  Palette,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { AdminThemeProvider, useAdminTheme } from "./AdminThemeContext";
import "./adminTheme.css";

import AdminHome from "./sections/AdminHome";
import AdminAbout from "./sections/AdminAbout";
import AdminSkills from "./sections/AdminSkills";
import AdminProjects from "./sections/AdminProjects";
import AdminExperience from "./sections/AdminExperience";
import AdminContact from "./sections/AdminContact";
import AdminSettings from "./sections/AdminSettings";
import AdminOverview from "./sections/AdminOverview";
import AdminSections from "./sections/AdminSections";
import AdminFormBuilder from "./sections/AdminFormBuilder";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/home", label: "Home", icon: Home },
  { path: "/admin/sections", label: "Manage Sections", icon: LayoutGrid },
  { path: "/admin/about", label: "About", icon: User },
  { path: "/admin/skills", label: "Skills", icon: Zap },
  { path: "/admin/projects", label: "Work / Projects", icon: FolderGit2 },
  { path: "/admin/experience", label: "Experience", icon: Briefcase },
  { path: "/admin/forms", label: "Form Builder", icon: FileSpreadsheet },
  { path: "/admin/contact", label: "Contact", icon: Mail },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const { currentTheme, themeId, setTheme, themes } = useAdminTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (logoutConfirm) {
      logout();
      navigate("/secret-login", { replace: true });
    } else {
      setLogoutConfirm(true);
      setTimeout(() => setLogoutConfirm(false), 3000);
    }
  };

  const currentLabel =
    NAV_ITEMS.find((item) =>
      item.exact
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path) && item.path !== "/admin"
    )?.label || "Dashboard";

  // Calculate RGB string for dynamic rgba overlays
  const hex = (currentTheme.accent || "#f59e0b").replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) || 245;
  const g = parseInt(hex.substring(2, 4), 16) || 158;
  const b = parseInt(hex.substring(4, 6), 16) || 11;
  const currentThemeRgb = `${r}, ${g}, ${b}`;

  return (
    <div
      className="admin-dashboard-scope flex min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-500/30"
      style={{
        "--admin-accent": currentTheme.accent,
        "--admin-glow": currentTheme.glow,
        "--admin-trim": currentTheme.lampTrim,
        "--admin-trim-light": currentTheme.lampTrimLight,
        "--admin-accent-rgb": currentThemeRgb,
        "--admin-gradient": `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.glow})`,
        "--admin-shadow": `0 4px 18px rgba(${currentThemeRgb}, 0.35)`,
      }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[199] lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed top-0 left-0 h-full bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col z-[200] shadow-2xl backdrop-blur-xl transition-all duration-250 overflow-hidden",
          sidebarOpen ? "w-60" : "w-[68px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800/80 min-h-[64px] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-zinc-800 bg-zinc-900/90 shadow-xs transition-colors duration-300"
              style={{ color: currentTheme.glow }}
            >
              <Zap size={18} />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-bold text-white whitespace-nowrap tracking-tight flex items-center gap-1.5">
                <span>Portfolio Admin</span>
                <span
                  className="size-1.5 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: currentTheme.glow }}
                />
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg w-7 h-7 items-center justify-center cursor-pointer text-zinc-400 hover:text-white transition-colors shrink-0"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto overflow-x-hidden space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.glow})`,
                        boxShadow: `0 4px 16px rgba(${currentThemeRgb}, 0.35)`,
                        color: "#09090b",
                        fontWeight: 700,
                      }
                    : undefined
                }
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all whitespace-nowrap",
                    isActive
                      ? "shadow-md"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                  ].join(" ")
                }
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-zinc-800/80 flex flex-col gap-2">
          {sidebarOpen && user && (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 overflow-hidden">
              <div
                className="w-8 h-8 rounded-full text-zinc-950 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.glow})`,
                }}
              >
                {user.name?.charAt(0) || "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis m-0">
                  {user.name}
                </p>
                <p className="text-[10px] text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis m-0">
                  {user.role}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className={[
              "flex items-center gap-2.5 px-3 py-2 rounded-lg border-none text-sm font-medium cursor-pointer transition-all w-full whitespace-nowrap",
              logoutConfirm
                ? "bg-red-500 text-white text-xs justify-center font-bold shadow-lg"
                : "bg-transparent text-red-400 hover:bg-red-950/40 hover:text-red-300",
            ].join(" ")}
          >
            <LogOut size={16} className="shrink-0" />
            {sidebarOpen && (
              <span>{logoutConfirm ? "Confirm Logout" : "Logout"}</span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main View Area ── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-[margin] duration-250 bg-zinc-950"
        style={{ marginLeft: sidebarOpen ? "240px" : "68px" }}
      >
        {/* Topbar */}
        <header className="h-16 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between px-6 sticky top-0 z-[100] gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer text-zinc-300"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-zinc-500 font-medium">Console</span>
              <span className="text-zinc-700">/</span>
              <span className="font-semibold text-white">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 5-Color Theme Switcher */}
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
              <Palette size={13} className="text-zinc-400 mr-0.5" />
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                Theme:
              </span>
              <div className="flex items-center gap-2">
                {themes.map((t) => {
                  const isSelected = t.id === themeId;
                  return (
                    <button
                      key={t.id}
                      id={`theme-btn-${t.id}`}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      title={`${t.name} (${t.label})`}
                      className={`group relative size-5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "scale-125 ring-2 ring-white/95 shadow-lg"
                          : "hover:scale-115 opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: t.accent,
                        boxShadow: isSelected ? `0 0 12px ${t.glow}` : "none",
                      }}
                      aria-label={`Select ${t.name} theme`}
                    >
                      {isSelected && (
                        <span className="size-1.5 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span
                className="text-[11px] font-mono font-semibold hidden md:inline ml-1 transition-colors duration-300"
                style={{ color: currentTheme.glow }}
              >
                {currentTheme.name}
              </span>
            </div>

            {/* View Portfolio Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-300 text-xs font-semibold no-underline hover:border-zinc-700 hover:text-white hover:bg-zinc-850 transition-all whitespace-nowrap shadow-xs"
            >
              <Globe
                size={13}
                style={{ color: currentTheme.glow }}
                className="transition-colors duration-300"
              />
              <span>Live Site</span>
            </a>

            {/* User Avatar */}
            <div
              title={user?.name}
              className="w-8 h-8 rounded-full text-zinc-950 font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-md transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.glow})`,
                boxShadow: `0 0 10px rgba(${currentThemeRgb}, 0.3)`,
              }}
            >
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Content Router */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1400px] w-full">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="sections" element={<AdminSections />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="forms" element={<AdminFormBuilder />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminThemeProvider>
      <AdminDashboardContent />
    </AdminThemeProvider>
  );
}
