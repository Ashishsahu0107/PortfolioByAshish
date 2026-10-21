import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function CustomCursor() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTouch = useMediaQuery("(hover: none)");
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [cursorState, setCursorState] = useState("default");

  useEffect(() => {
    if (!isDesktop || isTouch) return;

    const outerCursor = outerRef.current;
    const innerCursor = innerRef.current;
    const setOuterX = gsap.quickTo(outerCursor, "left", { duration: 0.18, ease: "power3.out" });
    const setOuterY = gsap.quickTo(outerCursor, "top", { duration: 0.18, ease: "power3.out" });
    const handleMove = (event) => {
      gsap.set(innerCursor, { left: event.clientX, top: event.clientY });
      setOuterX(event.clientX);
      setOuterY(event.clientY);
    };

    const handleHoverIn = (e) => {
      const el = e.target;
      if (el.tagName === "BUTTON" || el.tagName === "A" || el.closest("button") || el.closest("a")) {
        setCursorState("hover");
      } else if (el.closest(".project-card")) {
        setCursorState("view");
      }
    };

    const handleHoverOut = () => {
      setCursorState("default");
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleHoverIn);
    document.addEventListener("mouseout", handleHoverOut);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleHoverIn);
      document.removeEventListener("mouseout", handleHoverOut);
      gsap.killTweensOf([outerCursor, innerCursor]);
    };
  }, [isDesktop, isTouch]);

  if (!isDesktop || isTouch) return null;

  return (
    <>
      <div
        ref={outerRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-action transition-[width,height,background-color,border-color] duration-200 ${cursorState === "hover" ? "size-[60px] bg-action/10" : ""} ${cursorState === "view" ? "size-20 bg-action/15" : ""}`}
        aria-hidden="true"
      >
        {cursorState === "view" && (
          <span className="font-mono text-[9px] font-bold tracking-[.08em] text-primary">
            VIEW
          </span>
        )}
      </div>
      <div ref={innerRef} className="pointer-events-none fixed left-0 top-0 z-[9999] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action" aria-hidden="true" />
    </>
  );
}
