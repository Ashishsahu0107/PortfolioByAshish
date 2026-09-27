import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function CustomCursor() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTouch = useMediaQuery("(hover: none)");
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [cursorState, setCursorState] = useState("default");
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const outerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDesktop || isTouch) return;

    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (innerRef.current) {
        innerRef.current.style.left = `${e.clientX}px`;
        innerRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      const dx = posRef.current.x - outerPos.current.x;
      const dy = posRef.current.y - outerPos.current.y;
      outerPos.current.x += dx * 0.12;
      outerPos.current.y += dy * 0.12;
      if (outerRef.current) {
        outerRef.current.style.left = `${outerPos.current.x}px`;
        outerRef.current.style.top = `${outerPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleHoverIn = (e) => {
      const el = e.target;
      if (
        el.tagName === "BUTTON" ||
        el.tagName === "A" ||
        el.closest("button") ||
        el.closest("a")
      ) {
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
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleHoverIn);
      document.removeEventListener("mouseout", handleHoverOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, isTouch]);

  if (!isDesktop || isTouch) return null;

  return (
    <>
      <div
        ref={outerRef}
        className={`cursor-outer ${cursorState === "hover" ? "cursor-hover" : ""} ${cursorState === "view" ? "cursor-text" : ""}`}
        aria-hidden="true"
      >
        {cursorState === "view" && (
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.8)",
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            VIEW
          </span>
        )}
      </div>
      <div ref={innerRef} className="cursor-inner" aria-hidden="true" />
    </>
  );
}
