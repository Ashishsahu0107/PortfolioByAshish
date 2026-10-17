import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(contentRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" });
    });
    return () => media.revert();
  }, []);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-canvas p-6 text-primary">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--color-accent)_15%,transparent)_0%,transparent_60%)] opacity-40"
      />

      <div ref={contentRef} className="relative z-10 max-w-md text-center">
        <div className="mb-4 select-none bg-gradient-to-br from-action/35 to-action/15 bg-clip-text font-mono text-[clamp(6rem,20vw,16rem)] font-black leading-none text-transparent">
          404
        </div>

        <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight mb-4">
          Page not found
        </h1>

        <p className="text-[0.95rem] text-[var(--text-secondary)] leading-[1.7] mb-10">
          The page you are looking for doesn't exist or has been moved. Check
          the URL or head back home.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-action px-7 py-3 text-sm font-semibold text-canvas transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft size={16} /> Return Home
        </Link>
      </div>
    </div>
  );
}
