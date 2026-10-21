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
} from "lucide-react";
import { AdminSection, AdminCard, badgeBlue, badgePurple } from "../adminUtils";
import { developer } from "../../data/developer";
import { projects } from "../../data/projects";
import { skillCategories } from "../../data/skills";
import { experience } from "../../data/experience";

const STAT_CARDS = [
  { icon: FolderGit2, label: "Projects", getValue: () => projects.length },
  { icon: Zap, label: "Skill Categories", getValue: () => skillCategories.length },
  { icon: Briefcase, label: "Experience Entries", getValue: () => experience.length },
  { icon: CheckCircle2, label: "Available for Work", getValue: () => (developer.availableForWork ? "Yes" : "No") },
];

const QUICK_LINKS = [
  { label: "Edit Hero / Home", href: "/admin/home", icon: Home },
  { label: "Manage Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Update Skills", href: "/admin/skills", icon: Zap },
  { label: "Edit Experience", href: "/admin/experience", icon: Briefcase },
  { label: "View Contact Info", href: "/admin/contact", icon: Mail },
  { label: "Dashboard Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminOverview() {
  return (
    <AdminSection
      title="Dashboard Overview"
      desc={`Welcome back, ${developer.name}. Here's a snapshot of your portfolio content.`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-3.5 shadow-sm">
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 m-0 leading-none">{card.getValue()}</p>
                <p className="text-xs text-gray-400 mt-1 m-0">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Quick access */}
        <AdminCard title="Quick Access" icon={Compass}>
          <div className="flex flex-col gap-1.5">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <Icon size={16} className="text-gray-400 shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </a>
              );
            })}
          </div>
        </AdminCard>

        {/* Portfolio info */}
        <AdminCard title="Portfolio Information" icon={User}>
          <div className="flex flex-col gap-3">
            {[
              { label: "Name", value: developer.name },
              { label: "Role", value: developer.role },
              { label: "Email", value: developer.email },
              { label: "Location", value: developer.location },
              { label: "Status", value: developer.statusPhrase },
              { label: "GitHub", value: developer.github },
              { label: "LinkedIn", value: developer.linkedin },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2.5">
                <span className="text-[11px] font-semibold text-gray-400 w-[70px] shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-gray-700 break-all">{value}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Projects table */}
      <AdminCard title="Recent Projects" icon={Layers}>
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
              {projects.slice(0, 6).map((p) => (
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
