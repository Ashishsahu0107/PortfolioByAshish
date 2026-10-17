import { useState, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/PortfolioNavbar";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useScrollProgress } from "./hooks/useScrollProgress";

function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="page-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "dark";
    }
  });

  useLayoutEffect(() => {
    document.documentElement.className = theme === "light" ? "light" : "";
    const background = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim();
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", background);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      <CustomCursor />
      <ScrollProgress />

      {/* BG dot grid */}
      <div
        className="bg-grid fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-4 focus:px-6 focus:py-3 focus:bg-[var(--color-accent)] focus:text-[var(--color-background)] focus:font-bold focus:rounded-b-lg focus:z-[9999]"
      >
        Skip to main content
      </a>

      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <AnimatedRoutes />
      <ScrollToTop />
    </BrowserRouter>
  );
}
