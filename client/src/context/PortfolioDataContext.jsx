import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { portfolioApi } from "../services/api";

const CACHE_KEY = "portfolio_bundle_cache_v2";

/**
 * Default fallback section configuration for instant first paint
 */
export const DEFAULT_BUILTIN_SECTIONS = [
  { id: "hero", slug: "hero", name: "Hero", type: "builtin", enabled: true, order: 0 },
  { id: "about", slug: "about", name: "About", type: "builtin", enabled: true, order: 1 },
  { id: "skills", slug: "skills", name: "Skills", type: "builtin", enabled: true, order: 2 },
  { id: "projects", slug: "projects", name: "Projects", type: "builtin", enabled: true, order: 3 },
  { id: "process", slug: "process", name: "Process", type: "builtin", enabled: true, order: 4 },
  { id: "experience", slug: "experience", name: "Experience", type: "builtin", enabled: true, order: 5 },
  { id: "contact", slug: "contact", name: "Contact", type: "builtin", enabled: true, order: 6 },
];

/**
 * Synchronously retrieves cached portfolio bundle from storage
 */
export function getStoredPortfolioBundle() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.data) {
      return parsed.data;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

/**
 * Saves fresh bundle data into persistent client cache
 */
export function setStoredPortfolioBundle(bundle) {
  if (typeof window === "undefined" || !bundle) return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: bundle,
        timestamp: Date.now(),
      })
    );
  } catch {}
}

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  // Synchronous cache hydration on frame 0
  const [bundle, setBundle] = useState(() => {
    return getStoredPortfolioBundle();
  });

  const [loading, setLoading] = useState(() => !bundle);
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());

  const refreshBundle = useCallback(async (silent = false) => {
    if (!silent && !bundle) {
      setLoading(true);
    }
    try {
      const res = await portfolioApi.getBundle();
      if (res && res.success && res.data) {
        setBundle(res.data);
        setStoredPortfolioBundle(res.data);
        setLastUpdated(Date.now());
      }
    } catch (err) {
      console.warn("[PortfolioDataProvider] Background bundle sync notice:", err.message);
    } finally {
      setLoading(false);
    }
  }, [bundle]);

  // Initial fetch on mount
  useEffect(() => {
    refreshBundle(!!bundle);
  }, [refreshBundle]);

  // Listen to real-time sync events from Admin mutations
  useEffect(() => {
    const handleSync = () => {
      refreshBundle(true);
    };

    window.addEventListener("portfolio_updated", handleSync);
    window.addEventListener("storage", (e) => {
      if (e.key === "portfolio_sync_timestamp") {
        refreshBundle(true);
      }
    });

    return () => {
      window.removeEventListener("portfolio_updated", handleSync);
    };
  }, [refreshBundle]);

  const value = useMemo(() => {
    return {
      bundle,
      developer: bundle?.developer || null,
      about: bundle?.about || null,
      skills: bundle?.skills || [],
      projects: bundle?.projects || [],
      experience: bundle?.experience || [],
      sections: bundle?.sections && bundle.sections.length > 0 ? bundle.sections : DEFAULT_BUILTIN_SECTIONS,
      loading,
      isInstantReady: !!bundle,
      lastUpdated,
      refreshBundle,
    };
  }, [bundle, loading, lastUpdated, refreshBundle]);

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    return {
      bundle: null,
      developer: null,
      about: null,
      skills: [],
      projects: [],
      experience: [],
      sections: DEFAULT_BUILTIN_SECTIONS,
      loading: false,
      isInstantReady: false,
      refreshBundle: async () => {},
    };
  }
  return ctx;
}

export function usePortfolioSkills() {
  const { skills, refreshBundle } = usePortfolioData();
  return { skills, refreshSkills: refreshBundle };
}

export function usePortfolioSections() {
  const { sections, loading, refreshBundle } = usePortfolioData();
  return { sections, loading, refreshSections: refreshBundle };
}

export function usePortfolioDeveloper() {
  const { developer, refreshBundle } = usePortfolioData();
  return { developer, refreshDeveloper: refreshBundle };
}

