import { useState } from "react";
import { ResumeProvider } from "../resume-builder/context/ResumeContext";
import ResumeBuilderNav from "../resume-builder/components/ResumeBuilderNav";
import ResumeEditor from "../resume-builder/components/ResumeEditor";
import ResumePreview from "../resume-builder/components/ResumePreview";
import { Edit3, Eye } from "lucide-react";

export default function ResumeBuilderPage() {
  const [mobileTab, setMobileTab] = useState("editor"); // 'editor' | 'preview'

  return (
    <ResumeProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-900 antialiased">
        {/* Top Header / Action Bar */}
        <ResumeBuilderNav />

        {/* Mobile View Switcher (Tabs shown only on mobile/tablet screens < lg) */}
        <div className="flex items-center justify-center border-b border-zinc-200 bg-white p-2 lg:hidden shadow-xs">
          <div className="inline-flex rounded-lg bg-zinc-100 p-1">
            <button
              onClick={() => setMobileTab("editor")}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                mobileTab === "editor"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Edit3 size={14} />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                mobileTab === "preview"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Eye size={14} />
              <span>Live Preview</span>
            </button>
          </div>
        </div>

        {/* Main Work Area: 2 Columns on Desktop, Tabbed on Mobile */}
        <main className="flex flex-1 overflow-hidden">
          {/* Left: Form Editor */}
          <section
            className={`w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] h-full overflow-y-auto border-r border-zinc-200 bg-white p-4 sm:p-6 lg:p-7 ${
              mobileTab === "editor" ? "block" : "hidden lg:block"
            }`}
          >
            <ResumeEditor />
          </section>

          {/* Right: Live A4 Preview */}
          <section
            className={`flex-1 h-full overflow-hidden ${
              mobileTab === "preview" ? "block" : "hidden lg:block"
            }`}
          >
            <ResumePreview />
          </section>
        </main>
      </div>
    </ResumeProvider>
  );
}
