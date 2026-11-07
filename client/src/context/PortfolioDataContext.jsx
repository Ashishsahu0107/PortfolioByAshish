import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { portfolioApi } from "../services/api";
import { BASELINE_PORTFOLIO } from "../data/baselinePortfolioData";

const CACHE_KEY = "portfolio_bundle_cache_v2";

/**
 * Default fallback section configuration for instant first paint
 */
export const DEFAULT_BUILTIN_SECTIONS = [
  {
    id: "hero",
    slug: "hero",
    name: "Hero",
    type: "builtin",
    enabled: true,
    order: 0,
  },
  {
    id: "about",
    slug: "about",
    name: "About",
    type: "builtin",
    enabled: true,
    order: 1,
  },
  {
    id: "skills",
    slug: "skills",
    name: "Skills",
    type: "builtin",
    enabled: true,
    order: 2,
  },
  {
    id: "projects",
    slug: "projects",
    name: "Projects",
    type: "builtin",
    enabled: true,
    order: 3,
  },
  {
    id: "process",
    slug: "process",
    name: "Process",
    type: "builtin",
    enabled: true,
    order: 4,
  },
  {
    id: "experience",
    slug: "experience",
    name: "Experience",
    type: "builtin",
    enabled: true,
    order: 5,
  },
  {
    id: "contact",
    slug: "contact",
    name: "Contact",
    type: "builtin",
    enabled: true,
    order: 6,
  },
];

/**
 * Synchronously retrieves cached portfolio bundle from storage or baseline snapshot
 */
export function getStoredPortfolioBundle() {
  if (typeof window === "undefined") return BASELINE_PORTFOLIO;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.data) {
        return parsed.data;
      }
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {}
  return BASELINE_PORTFOLIO;
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
      }),
    );
  } catch {}
}

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  // Synchronous cache hydration on frame 0 (instant first paint)
  const [bundle, setBundle] = useState(() => {
    return getStoredPortfolioBundle();
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());

  const refreshBundle = useCallback(async (silent = true) => {
    try {
      let res = null;
      // If index.html already started prefetching in <head>, consume that promise first
      if (
        typeof window !== "undefined" &&
        window.__PORTFOLIO_BUNDLE_PROMISE__
      ) {
        res = await window.__PORTFOLIO_BUNDLE_PROMISE__;
        window.__PORTFOLIO_BUNDLE_PROMISE__ = null;
      }

      if (!res || !res.success) {
        res = await portfolioApi.getBundle();
      }

      if (res && res.success && res.data) {
        setBundle(res.data);
        setStoredPortfolioBundle(res.data);
        setLastUpdated(Date.now());
      }
    } catch (err) {
      console.warn("[PortfolioDataProvider] Dynamic sync notice:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Background revalidation on mount
  useEffect(() => {
    refreshBundle(true);
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
    const currentBundle = bundle || BASELINE_PORTFOLIO;
    return {
      bundle: currentBundle,
      developer: currentBundle.developer || BASELINE_PORTFOLIO.developer,
      about: currentBundle.about || BASELINE_PORTFOLIO.about,
      skills: currentBundle.skills || BASELINE_PORTFOLIO.skills,
      projects: currentBundle.projects || BASELINE_PORTFOLIO.projects,
      experience: currentBundle.experience || BASELINE_PORTFOLIO.experience,
      sections:
        currentBundle.sections && currentBundle.sections.length > 0
          ? currentBundle.sections
          : DEFAULT_BUILTIN_SECTIONS,
      loading,
      isInstantReady: true,
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
      bundle: BASELINE_PORTFOLIO,
      developer: BASELINE_PORTFOLIO.developer,
      about: BASELINE_PORTFOLIO.about,
      skills: BASELINE_PORTFOLIO.skills,
      projects: BASELINE_PORTFOLIO.projects,
      experience: BASELINE_PORTFOLIO.experience,
      sections: DEFAULT_BUILTIN_SECTIONS,
      loading: false,
      isInstantReady: true,
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

export function usePortfolioProjects() {
  const { projects, refreshBundle } = usePortfolioData();
  return { projects, refreshProjects: refreshBundle };
}

export function usePortfolioExperience() {
  const { experience, refreshBundle } = usePortfolioData();
  return { experience, refreshExperience: refreshBundle };
}

export function usePortfolioAbout() {
  const { about, loading, refreshBundle } = usePortfolioData();
  return { about, loading, refreshAbout: refreshBundle };
}
