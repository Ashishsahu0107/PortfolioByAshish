import { useScrollProgress } from "../hooks/useScrollProgress";

export default function ScrollToTop() {
  const progress = useScrollProgress();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (progress < 20) return null;

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "color-mix(in srgb, var(--color-accent) 15%, transparent)",
        border: "1px solid var(--color-accent)",
        color: "var(--color-accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        transition: "all 0.2s ease",
        cursor: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "color-mix(in srgb, var(--color-accent) 25%, transparent)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "color-mix(in srgb, var(--color-accent) 15%, transparent)";
        e.currentTarget.style.transform = "none";
      }}
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
