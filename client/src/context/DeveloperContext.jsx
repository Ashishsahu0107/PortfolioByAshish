import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { developerApi } from "../services/api";
import { usePortfolioSync } from "../hooks/usePortfolioSync";

const DeveloperContext = createContext(null);

export function DeveloperProvider({ children }) {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeveloper = useCallback(async () => {
    try {
      setLoading(true);
      const data = await developerApi.get();
      if (data) {
        const formatted = {
          ...data,
          firstName: data.firstName || data.name?.trim().split(/\s+/)[0] || "",
          lastName: data.lastName || data.name?.trim().split(/\s+/).slice(1).join(" ") || "",
          locationShort: data.locationShort || data.location?.split(",")[0].trim() || data.location || "",
        };
        setDeveloper(formatted);
        setError(null);
      } else {
        setDeveloper(null);
      }
    } catch (err) {
      console.warn("[DeveloperContext] Failed to load developer profile from backend:", err.message);
      setError(err.message || "Failed to load developer profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeveloper();
  }, [fetchDeveloper]);

  // Real-time synchronization whenever developer information is updated
  usePortfolioSync(fetchDeveloper, "developer");

  return (
    <DeveloperContext.Provider
      value={{
        developer,
        loading,
        error,
        refreshDeveloper: fetchDeveloper,
      }}
    >
      {children}
    </DeveloperContext.Provider>
  );
}

export function useDeveloper() {
  const context = useContext(DeveloperContext);
  return context || { developer: null, loading: false, error: null };
}
