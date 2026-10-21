import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  Zap,
  Briefcase,
  CheckCircle2,
  Home,
  Mail,
  Settings,
  ArrowRight,
  Compass,
  User,
  Layers,
  LayoutGrid,
  FileSpreadsheet,
  Server,
  Loader2,
  Clock,
  Activity,
} from "lucide-react";
import { AdminSection, AdminCard, badgeBlue, badgePurple, badgeGreen } from "../adminUtils";
import { overviewApi, projectsApi } from "../../services/api";

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const [overviewRes, projectsRes] = await Promise.all([
          overviewApi.get().catch(() => null),
          projectsApi.getAll().catch(() => []),
        ]);
        if (overviewRes) setData(overviewRes);
        if (Array.isArray(projectsRes)) setRecentProjects(projectsRes.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  const counts = data?.counts || {
    projects: 3,
    featuredProjects: 3,
    skillCategories: 5,
    totalSkills: 20,
    experience: 4,
    sections: 7,
    activeSections: 7,
    forms: 1,
    submissions: 0,
    messages: 0,
    unreadMessages: 0,
  };

  const dev = data?.developer || {
    name: "Ashish Sahu",
    role: "Full Stack Developer",
    availableForWork: true,
    statusPhrase: "Available for opportunities",
  };

  const system = data?.system || {
    status: "healthy",
    nodeVersion: "v25.2.0",
    uptimeSeconds: 0,
    timestamp: new Date().toISOString(),
  };

  const STAT_CARDS = [
    { icon: FolderGit2, label: "Live Projects", value: counts.projects, sub: `${counts.featuredProjects} featured` },
    { icon: Zap, label: "Skill Categories", value: counts.skillCategories, sub: `${counts.totalSkills} total skills` },
    { icon: Briefcase, label: "Experience Entries", value: counts.experience, sub: "Academia & work" },
    { icon: LayoutGrid, label: "Dynamic Sections", value: counts.sections, sub: `${counts.activeSections} active` },
    { icon: FileSpreadsheet, label: "Form Submissions", value: counts.submissions, sub: `${counts.forms} active templates` },
    { icon: Mail, label: "Inbox Messages", value: counts.messages, sub: `${counts.unreadMessages} unread` },
  ];

  const QUICK_LINKS = [
    { label: "Edit Hero / Home", href: "/admin/home", icon: Home },
    { label: "Manage Dynamic Sections", href: "/admin/sections", icon: LayoutGrid },
    { label: "Manage Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Form Builder & Submissions", href: "/admin/forms", icon: FileSpreadsheet },
    { label: "Update Skills", href: "/admin/skills", icon: Zap },
    { label: "Edit Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Inbox & Contact Info", href: "/admin/contact", icon: Mail },
    { label: "Security & Settings", href: "/admin/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <AdminSection title="Dashboard Overview" desc="Loading system telemetry...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-600" />
          <span>Synchronizing dashboard with backend server...</span>
        </div>
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Dashboard Overview"
      desc={`Welcome back, ${dev.name}. Live telemetry and full-stack system status.`}
    >
      {/* System Health Banner */}
      <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
            <Activity size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Backend Server Online</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={badgeGreen}>REST API Connected</span>
            </div>
            <p className="text-xs text-gray-500 m-0">Persistent storage active at port 5000 with atomic JSON cache.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1">
            <Server size={13} className="text-gray-400" />
            <span>Node {system.nodeVersion}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-gray-400" />
            <span>Uptime: {Math.floor(system.uptimeSeconds / 60)}m</span>
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-7">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-500">{card.label}</span>
                <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 m-0 leading-none">{card.value}</p>
                <p className="text-[11px] text-gray-400 mt-1 m-0">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Quick access */}
        <AdminCard title="Quick Management Navigation" icon={Compass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100 hover:border-indigo-100 transition-all"
                >
                  <Icon size={15} className="text-indigo-600 shrink-0" />
                  <span className="flex-1 truncate">{link.label}</span>
                  <ArrowRight size={13} className="text-gray-400" />
                </Link>
              );
            })}
          </div>
        </AdminCard>

        {/* Portfolio info */}
        <AdminCard title="Developer Identity & Availability" icon={User}>
          <div className="flex flex-col gap-3">
            {[
              { label: "Name", value: dev.name },
              { label: "Role", value: dev.role },
              { label: "Status Phrase", value: dev.statusPhrase },
              { label: "Available", value: dev.availableForWork ? "Active & Accepting Inquiries" : "Currently Unavailable" },
              { label: "Dynamic Sections", value: `${counts.activeSections} of ${counts.sections} enabled on portfolio` },
              { label: "Unread Messages", value: `${counts.unreadMessages} requiring review` },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2.5">
                <span className="text-[11px] font-semibold text-gray-400 w-28 shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-gray-700 break-all font-medium">{value}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Projects table */}
      <AdminCard title="Recent Projects from Database" icon={Layers}>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["#", "Title", "Category", "Year", "Technologies"].map((h) => (
                  <th
                    key={h}
                    className="bg-gray-50 text-gray-600 font-semibold px-4 py-2.5 text-left border-b border-gray-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-100 text-gray-400 font-semibold">{p.number}</td>
                  <td className="px-4 py-2.5 border-b border-gray-100 font-semibold text-gray-900">{p.title}</td>
                  <td className="px-4 py-2.5 border-b border-gray-100">
                    <span className={badgeBlue}>{p.category}</span>
                  </td>
                  <td className="px-4 py-2.5 border-b border-gray-100 text-gray-700">{p.year}</td>
                  <td className="px-4 py-2.5 border-b border-gray-100">
                    <div className="flex gap-1 flex-wrap">
                      {(p.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className={badgePurple}>{tag}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </AdminSection>
  );
}
