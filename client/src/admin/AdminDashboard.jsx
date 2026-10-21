import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import AdminHome from "./sections/AdminHome";
import AdminAbout from "./sections/AdminAbout";
import AdminSkills from "./sections/AdminSkills";
import AdminProjects from "./sections/AdminProjects";
import AdminExperience from "./sections/AdminExperience";
import AdminContact from "./sections/AdminContact";
import AdminSettings from "./sections/AdminSettings";
import AdminOverview from "./sections/AdminOverview";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/home", label: "Home", icon: Home },
  { path: "/admin/about", label: "About", icon: User },
  { path: "/admin/skills", label: "Skills", icon: Zap },
  { path: "/admin/projects", label: "Work / Projects", icon: FolderGit2 },
  { path: "/admin/experience", label: "Experience", icon: Briefcase },
  { path: "/admin/contact", label: "Contact", icon: Mail },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
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

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/35 z-[199] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col z-[200] shadow-[2px_0_12px_rgba(0,0,0,0.06)] transition-all duration-250 overflow-hidden",
          sidebarOpen ? "w-60" : "w-[68px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 min-h-[64px] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Zap size={18} className="text-indigo-600" />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight">
                Portfolio Admin
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex bg-gray-100 hover:bg-gray-200 border-none rounded-lg w-7 h-7 items-center justify-center cursor-pointer text-gray-500 transition-colors shrink-0"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto overflow-x-hidden space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all whitespace-nowrap",
                    isActive
                      ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-[0_3px_10px_rgba(79,70,229,0.3)]"
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600",
                  ].join(" ")
                }
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 flex flex-col gap-2">
          {sidebarOpen && user && (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gray-50 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.name?.charAt(0) || "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis m-0">
                  {user.name}
                </p>
                <p className="text-[10px] text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis m-0">
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
                ? "bg-red-500 text-white text-xs justify-center"
                : "bg-transparent text-red-500 hover:bg-red-50",
            ].join(" ")}
          >
            <LogOut size={16} className="shrink-0" />
            {sidebarOpen && <span>{logoutConfirm ? "Confirm Logout" : "Logout"}</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-[margin] duration-250"
        style={{ marginLeft: sidebarOpen ? "240px" : "68px" }}
      >
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-[100] gap-4">
          <div className="flex items-center gap-3.5">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden bg-gray-100 hover:bg-gray-200 border-none rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer text-gray-700"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-400 font-medium">Admin</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-900">{currentLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold no-underline hover:bg-indigo-100 transition-colors whitespace-nowrap"
            >
              <Globe size={13} />
              <span>View Portfolio</span>
            </a>
            <div
              title={user?.name}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white font-bold text-sm flex items-center justify-center cursor-pointer shadow-xs"
            >
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-7 max-w-[1400px] w-full">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
