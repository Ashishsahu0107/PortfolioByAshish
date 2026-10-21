import { useScrollProgress } from "../hooks/useScrollProgress";

export default function ScrollToTop() {
  const progress = useScrollProgress();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (progress < 20) return null;

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      className="fixed bottom-8 right-8 z-[200] grid size-11 place-items-center rounded-full border border-action bg-action/15 text-action transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-action/25"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
