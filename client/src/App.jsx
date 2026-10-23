import { useRef, useState, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { gsap } from "gsap";

import Navbar from "./components/PortfolioNavbar";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ResumeViewPage from "./pages/ResumeViewPage";
import SecretLoginPage from "./pages/SecretLoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./admin/AdminDashboard";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { ResumeModalProvider } from "./resume-builder/context/ResumeModalContext";
import { AuthProvider, ProtectedRoute } from "./auth/AuthContext";
import { DeveloperProvider } from "./context/DeveloperContext";

function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="fixed left-0 top-0 z-[1000] h-0.5 bg-action transition-[width] duration-75"
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
  const routeRef = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        routeRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25, ease: "power2.out" },
      );
    });
    return () => media.revert();
  }, [location.pathname]);

  return (
    <div ref={routeRef} className="min-h-screen">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/resume-builder/view" element={<ResumeViewPage />} />
        <Route path="/login" element={<SecretLoginPage />} />
        <Route path="/secret-login" element={<SecretLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/secret-register" element={<RegisterPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function AppContent({ theme, toggleTheme }) {
  const location = useLocation();
  const isStandalone =
    location.pathname.startsWith("/resume-builder") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/secret-login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/secret-register") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      <CustomCursor />
      {!isStandalone && <ScrollProgress />}

      {!isStandalone && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-4 focus:px-6 focus:py-3 focus:bg-[var(--color-accent)] focus:text-[var(--color-background)] focus:font-bold focus:rounded-b-lg focus:z-[9999]"
        >
          Skip to main content
        </a>
      )}

      {!isStandalone && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <AnimatedRoutes />
      {!isStandalone && <ScrollToTop />}
    </>
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
      <AuthProvider>
        <DeveloperProvider>
          <ResumeModalProvider>
            <AppContent theme={theme} toggleTheme={toggleTheme} />
          </ResumeModalProvider>
        </DeveloperProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
